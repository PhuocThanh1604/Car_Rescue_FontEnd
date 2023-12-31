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
  Avatar,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Grid from "@mui/system/Unstable_Grid/Grid";
import {
  editTechnician,
  fetchTechnicians,
} from "../../../redux/technicianSlice";
import UploadImageField from "../../../components/uploadImage";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../../data.json";
import moment from "moment";
import * as yup from 'yup';
const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditTechnician,
  accountData,
}) => {
  const dispatch = useDispatch();
  const technicians = useSelector((state) => state.technician.technicians);
  const [edit, setEdit] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const dataToServer = useRef(null); // Step 2
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [editBirthdate, setEditBirthdate] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState(edit.avatar || "");

  const [dataJson, setDataJson] = useState([]);

  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu về khu vực");
    }
    setDataJson(areaData);
  }, [dataJson]);

  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl);
    setEdit((prevRescuseVehicleOwner) => ({
      ...prevRescuseVehicleOwner,
      avatar: imageUrl,
    }));
  };

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
    console.log(accountData);
  }, [accountData]);

  const reloadTechnicians = () => {
    dispatch(fetchTechnicians())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredTechnicians(data);
          setLoading(false);
          console.log("Services reloaded:", data);
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi tải lại danh sách khách hàng:", error);
      });
  };

  useEffect(() => {
    if (
      !selectedEditTechnician ||
      !technicians ||
      !Array.isArray(technicians)
    ) {
      toast.dismiss("Dữ liệu không hợp lệ để thực hiện tác vụ.");
      return;
    }

    const technicianToEdit = technicians.find(
      (technician) => technician.id === selectedEditTechnician.id
    );

    if (!technicianToEdit) {
      toast.dismiss("Không tìm thấy thông tin kỹ thuật viên để chỉnh sửa.");
      return;
    }

    console.log("Data của Kỹ Thuật Viên " + technicianToEdit);
    setFullnameValue(technicianToEdit.fullname);
    setEdit(technicianToEdit);
    setInitialFormState(technicianToEdit);
    if (technicianToEdit) {
      const formattedDate = formatDateForClient(technicianToEdit.birthdate);
      setEditBirthdate(formattedDate);
    }

  }, [selectedEditTechnician, technicians]);


  const handleBirthdateChange = (event) => {
    setEditBirthdate(event.target.value); 
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevTechnician) => ({
      ...prevTechnician,
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
    if (!selectedEditTechnician || !edit) {
      toast.error("Không có thông tin kỹ thuật viên để cập nhật.");
      return;
    }
    const updatedEdit = { ...edit, birthdate: editBirthdate };

    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges =
      JSON.stringify(updatedEdit) !== JSON.stringify(initialFormState);

    const updatedInitialValues = {
      ...updatedEdit,
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
      if (
        selectedEditTechnician.status === "ASSIGNED" &&
        (edit.status === "ACTIVE" || edit.status === "INACTIVE")
      ) {
        if (edit.status === "ACTIVE") {
          toast.warn(
            "Kỹ thuật viên đang ở trạng thái Đang làm việc không thể chuyển sang trạng thái Hoạt Động"
          );
        } else {
          toast.warn(
            "Kỹ thuật viên đang ở trạng thái Đang làm việc không thể chuyển sang trạng thái Không Hoạt Động."
          );
        }

        return;
      }
      dispatch(editTechnician({ data: updatedInitialValues }))
        .then(() => {
          setIsSuccess(true);
          toast.success("Cập nhật thành công.");
          handleClose();
          reloadTechnicians();
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(
              `Lỗi khi cập nhật kỹ thuật viên: ${error.response.data.message}`
            );
          } else {
            toast.error("Lỗi khi cập nhật kỹ thuật viên.");
          }
        });
    }
  };

  const handleClose = () => {
    setOpenEditModal(false);
  };

  if (!technicians) {
    // Thêm điều kiện kiểm tra nếu Technician không có giá trị
    return null;
  }

  return (
    <>
      <ToastContainer />
      <Modal
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="Technician-detail-modal"
        aria-describedby="Technician-detail-modal-description"
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
                id="Technician-detail-modal"
                textAlign="center"
                fontWeight="bold"
              >
                {selectedEditTechnician
                  ? "Sửa Thông Tin Kỹ Thuật Viên"
                  : "Technician Detail"}
              </Typography>

              {selectedEditTechnician && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="id"
                      value={edit.id}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditRescuseVehicleOwner and prevent changes
                        if (!selectedEditTechnician) {
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
                      value={edit.fullname}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />

                    <TextField
                      name="accountId"
                      label="AccountId"
                      value={edit.accountId}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditRescuseVehicleOwner and prevent changes
                        if (!selectedEditTechnician) {
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
                        <MenuItem key="status-active" value="Nam">
                          Nam
                        </MenuItem>
                        <MenuItem key="status-outofstock" value="Nữ">
                          Nữ
                        </MenuItem>
                      </Select>
                    </FormControl>


                    
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{ marginTop: "10px" }}
                    >
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
                        {edit.status === "ASSIGNED" ? ( // Kiểm tra nếu edit.status không phải là "ASSIGNED", hiển thị MenuItem
                          <MenuItem value="ASSIGNED" sx={{ display: "none" }}>
                            Đang làm việc
                          </MenuItem>
                        ) : null}{" "}
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
