import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { editManager, fetchManagers } from "../../../redux/managerSlice";
import UploadImageField from "../../../components/uploadImage";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../../data.json";
import moment from "moment";
import * as yup from 'yup';
const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditManager,
  accountData,
}) => {
  const dispatch = useDispatch();
  const managers = useSelector((state) => state.manager.managers);
  const [edit, setEdit] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [fullnameValue, setFullnameValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [dataJson, setDataJson] = useState([]);
  const [editBirthdate, setEditBirthdate] = useState('');
  const formatDateForClient = (birthdate) => {
    console.log(birthdate)
    const formattedDate = moment(birthdate)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .startOf("day")
      .format("YYYY-MM-DD"); 
      console.log(formattedDate)
    return formattedDate;
  };
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu về khu vực");
    }
    setDataJson(areaData);
  }, [dataJson]);

  const [currentImageUrl, setCurrentImageUrl] = useState(edit.avatar || "");
  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl); 
    setEdit((prevManager) => ({
      ...prevManager,
      avatar: imageUrl,
    }));
  };
  useEffect(() => {
    console.log(accountData);
  }, [accountData]);

  const reloadManagers = () => {
    dispatch(fetchManagers())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredCustomers(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách khách hàng:", error);
      });
  };

  useEffect(() => {
    if (selectedEditManager && managers) {
      if (selectedEditManager.id) {
        const customerToEdit = managers.find(
          (customer) => customer.id === selectedEditManager.id
        );
        if (customerToEdit) {
          console.log(customerToEdit);
          setFullnameValue(customerToEdit.fullname);
          setEdit(customerToEdit);
          setInitialFormState(customerToEdit);
        }

      }
      if (selectedEditManager) {
        console.log(selectedEditManager.birthdate)
        const formattedDate = formatDateForClient(selectedEditManager.birthdate);
        setEditBirthdate(formattedDate);
      }
    }
  }, [selectedEditManager, managers]);
  const handleBirthdateChange = (event) => {
    setEditBirthdate(event.target.value); 
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
    console.log(setEdit);
  };
  const isValidPhoneNumber = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };
  const birthdateSchema = yup.date()
  .max(new Date(), "Ngày sinh không được lớn hơn ngày hiện tại")
  .min(new Date(new Date().getFullYear() - 120, 0, 1), "Ngày sinh không hợp lệ");
  const handleSaveClick = () => {
    if (!birthdateSchema.isValidSync(editBirthdate)) {
      toast.error("Ngày sinh không hợp lệ");
      return;
    }
    if (!isValidPhoneNumber(edit.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }
    if (!selectedEditManager || !edit) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }

    const updatedEdit = { ...edit, birthdate: editBirthdate };

    const hasChanges =
      JSON.stringify(updatedEdit) !== JSON.stringify(initialFormState);
    const updatedInitialValues = {
      ...edit,
      account: {
        id: accountData.account.id,
        email: accountData.account.email,
        password: accountData.account.password,
        deviceToken: accountData.account.deviceToken,
        createAt: accountData.account.createAt,
      },
    };

    console.log(updatedInitialValues);
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      dispatch(editManager( edit ))
        .then(() => {
          setIsSuccess(true);
          toast.success("Cập nhật thành công.");
          handleClose();
          reloadManagers();
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(
              `Lỗi khi cập nhật khách hàng: ${error.response.data.message}`
            );
          } else {
            toast.error("Lỗi khi cập nhật khách hàng.");
          }
        });
    }
  };

  const handleClose = () => {
    setOpenEditModal(false);
  };

  if (!managers) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <Modal
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="Customer-detail-modal"
        aria-describedby="Customer-detail-modal-description"
        closeAfterTransition
      >
        <Fade in={openEditModal}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "80%",
                maxWidth: "800px",
                maxHeight: "90%",
                overflowY: "auto",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 5,
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
                aria-label="close"
                onClick={handleClose}
              >
                <Close />
              </IconButton>
              <Typography
                variant="h5"
                component="h2"
                id="Customer-detail-modal"
                sx={{ textAlign: "center" ,fontWeight: "bold" }}
              >
                {selectedEditManager
                  ? "Sửa Thông Tin Quản Lí"
                  : "Customer Detail"}
              </Typography>

              {selectedEditManager && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="id"
                      value={edit.id}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditMnâger and prevent changes
                        if (!selectedEditManager) {
                          handleInputChange(event);
                        }
                      }}
                      fullWidth
                      margin="normal"
                      style={{ display: "none" }}
                    />
                    <TextField
                      name="email"
                      label="Email"
                      type="text"
                      value={accountData?.account?.email || ""}
                      onChange={handleInputChange}
                      disabled // Disable the TextField
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="fullname"
                      label="Họ Và Tên"
                      value={edit.fullname || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />

                    <TextField
                      name="accountId"
                      label="AccountId"
                      value={edit.accountId}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditMnâger and prevent changes
                        if (!selectedEditManager) {
                          handleInputChange(event);
                        }
                      }}
                      fullWidth
                      margin="normal"
                      style={{ display: "none" }}
                    />
                    <Grid
                      container
                      spacing={4}
                      alignItems="center"
                      marginBottom={2}
                    >
                      <Grid item>
                        <Avatar
                          alt="Avatar"
                          src={edit.avatar} // Set the src attribute to the image URL
                          sx={{ width: 50, height: 50 }}
                        />
                      </Grid>
                      <Grid item>
                        <UploadImageField
                          onImageUploaded={handleImageUploaded}
                          imageUrl={currentImageUrl}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label="Download URL"
                      type="text"
                      value={downloadUrl}
                      fullWidth
                      margin="normal"
                      disabled
                      style={{ display: "none" }}
                    />

                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                      <InputLabel id="demo-simple-select-label">
                        Giới Tính
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={edit.sex || ""}
                        onChange={handleInputChange}
                        variant="outlined"
                        className="filter-select"
                        name="sex"
                        label="Giới Tính"
                      >
                        <MenuItem key="status-name" value="Nam">
                          Nam
                        </MenuItem>
                        <MenuItem key="status-nu" value="Nữ">
                          Nữ
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined" sx={{marginTop:"10px"}}>
                      <InputLabel id="area-label">Khu Vực</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="area"
                        name="area"
                        variant="outlined"
                        value={edit.area || ""}
                        onChange={handleInputChange}
                        className="filter-select"
                        label="Khu vực"
                      >
                        {dataJson?.area &&
                          dataJson.area.length >= 3 &&
                          dataJson.area.slice(0, 3).map((item, index) => (
                            <MenuItem value={item.value}>
                              {item.name}
                              <Tooltip
                                key={index}
                                title={
                                  item.description
                                    ? item.description
                                        .split("\n")
                                        .map((line, i) => (
                                          <div key={i}>{line}</div>
                                        ))
                                    : "Không có mô tả"
                                }
                              >
                                <InfoIcon
                                  style={{
                                    marginLeft: "5px",
                                    fontSize: "16px",
                                  }}
                                />
                              </Tooltip>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="date"
                      label="Ngày Sinh"
                      className="filter-select"
                      onChange={handleBirthdateChange}
                      value={editBirthdate}
                      name="birthdate"
               
                      sx={{ gridColumn: "span 1" }}

                      margin="normal"
                    />
                    
                    <TextField
                      name="phone"
                      label="Số Điện Thoại"
                      type="text"
                      value={edit.phone || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="address"
                      label="Địa Chỉ"
                      value={edit.address || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                      <InputLabel id="demo-simple-select-label">
                        Trạng Thái
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={edit.status || ""}
                        onChange={handleInputChange}
                        variant="outlined"
                        className="filter-select"
                        name="status"
                        label="Status"
                      >
                        <MenuItem key="status-active" value="ACTIVE">
                          Đang Hoạt Động
                        </MenuItem>
                        <MenuItem key="status-INACTIVE" value="INACTIVE">
                          Không Hoạt Động
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <Button
                      onClick={handleSaveClick}
                      variant="contained"
                      color="primary"
                    >
                      Lưu
                    </Button>
                  </Box>
                </Card>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ModalEdit;
