import React, { useState, useEffect } from "react";
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
  Avatar,
  Grid,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import UploadImageField from "../../../components/uploadImage";
import {
  editRescueVehicleOwner,
  fetchRescueVehicleOwners,
} from "../../../redux/rescueVehicleOwnerSlice";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../../data.json";
import * as yup from 'yup';
import moment from "moment";
const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditRescuseVehicleOwner,
  accountData
 
}) => {
  const dispatch = useDispatch();
  const rescueVehicleOwners = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const [edit, setEdit] = useState({
   
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtereRescueVehicleOwners, setFilteredRescueVehicleOwners] = useState(
    []
  );
  const [currentImageUrl, setCurrentImageUrl] = useState(edit.avatar || "");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [serverError, setServerError] = useState(null);
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

  
  useEffect(() => {
    console.log(accountData);

  }, [accountData]);
  const reloadRescueVehicleOwners = () => {
    dispatch(fetchRescueVehicleOwners())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredRescueVehicleOwners(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách khách hàng:", error);
      });
  };

  useEffect(() => {
    if (selectedEditRescuseVehicleOwner && rescueVehicleOwners) {
      if (selectedEditRescuseVehicleOwner.id) {
        const RescuseVehicleOwnerToEdit = rescueVehicleOwners.find(
          (rescuseVehicleOwner) =>
            rescuseVehicleOwner.id === selectedEditRescuseVehicleOwner.id
        );
        if (RescuseVehicleOwnerToEdit) {
          setEdit(RescuseVehicleOwnerToEdit);
          setInitialFormState(RescuseVehicleOwnerToEdit);
        }
        if (selectedEditRescuseVehicleOwner) {
          const formattedDate = formatDateForClient(selectedEditRescuseVehicleOwner.birthdate);
          setEditBirthdate(formattedDate);
        }
      }
    }
  }, [selectedEditRescuseVehicleOwner, rescueVehicleOwners]);

  const handleBirthdateChange = (event) => {
    setEditBirthdate(event.target.value); 
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevRescuseVehicleOwner) => ({
      ...prevRescuseVehicleOwner,
      [name]: value,
    }));
  
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
    if (!selectedEditRescuseVehicleOwner || !edit) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }
    const updatedEdit = { ...edit, birthdate: editBirthdate };

    const hasChanges =
      JSON.stringify(updatedEdit) !== JSON.stringify(initialFormState);

    const updatedInitialValues = {
      ...updatedEdit,
      account: {
        id: accountData.account.id,
        email: accountData.account.email,
        password: accountData.account.password,
        deviceToken: accountData.account.deviceToken,
        createAt: accountData.account.createAt
      },
    };
    console.log(updatedInitialValues);

    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ
      dispatch(editRescueVehicleOwner({ data: updatedInitialValues }))
        .then(() => {
          toast.success("Cập nhật thành công.");
          handleClose();
          reloadRescueVehicleOwners();
          setIsSuccess(true);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(
              `Lỗi khi cập nhật khách hàng: ${error.response.data.message}`
            );
          } else if (error.message) {
            toast.error(`Lỗi khi cập nhật khách hàng: ${error.message}`);
          } else {
            toast.error("Lỗi khi cập nhật khách hàng.");
          }
        });
    }
  };

  const handleClose = () => {
    setOpenEditModal(false);
  };

  if (!rescueVehicleOwners) {
    return null;
  }

  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl);
    setEdit((prevRescuseVehicleOwner) => ({
      ...prevRescuseVehicleOwner,
      avatar: imageUrl,
    }));
  };


  return (
    <>
      <ToastContainer />
      <Modal
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="RescuseVehicleOwner-detail-modal"
        aria-describedby="RescuseVehicleOwner-detail-modal-description"
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
                id="RescuseVehicleOwner-detail-modal"
                sx={{ textAlign: "center" ,fontWeight: "bold" }}
              >
                {selectedEditRescuseVehicleOwner
                  ? "Sửa Thông Tin Chủ Xe Cứu Hộ"
                  : "RescuseVehicleOwner Detail"}
              </Typography>

              {selectedEditRescuseVehicleOwner &&  (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="id"
                      value={edit.id}
                      onChange={(event) => {
                        if (!selectedEditRescuseVehicleOwner) {
                          handleInputChange(event);
                        }
                      }}
                      sx={{display: 'none'}}
                      fullWidth
                      margin="normal"
                    />
                     <TextField
                      name="email"
                      label="Email"
                      type="text"
                      value={accountData?.account?.email || ""}
                      onChange={handleInputChange}
                      disabled 
                      fullWidth
                      margin="normal"
                    /> 
                    <TextField
                      name="fullname"
                      label="Họ Và Tên"
                      type="text"
                      value={edit.fullname|| ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    /> 

                    <TextField
                      name="accountId"
                      label="AccountId"
                      value={edit.accountId}
                      onChange={(event) => {
                        if (!selectedEditRescuseVehicleOwner) {
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
                          src={edit.avatar} 
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
                        <MenuItem key="status-nam" value="Nam">
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
                          Hoạt Động
                        </MenuItem>
                        <MenuItem key="status-outofstock" value="INACTIVE">
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
      {serverError && <Typography color="error">{serverError}</Typography>}
    </>
  );
};

export default ModalEdit;
