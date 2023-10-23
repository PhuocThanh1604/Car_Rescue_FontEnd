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
} from "@mui/material";
import { Close} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  editRescueVehicleOwner,
  fetchRescueVehicleOwners,
} from "../../../redux/rescueVehicleOwnerSlice";
import { ToastContainer, toast } from "react-toastify";
import UploadImageField from "../../../components/uploadImage";

const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditRescuseVehicleOwner,
}) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const [edit, setEdit] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtereRescueVehicleOwners, setFilteredRescueVehicleOwners] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState(edit.avatar || "");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [serverError, setServerError] = useState(null);

  const reloadRescueVehicleOwners = () => {
    dispatch(fetchRescueVehicleOwners())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredRescueVehicleOwners(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách khách hàng:", error);
      });
  };

  useEffect(() => {
    if (selectedEditRescuseVehicleOwner && orders) {
      if (selectedEditRescuseVehicleOwner.id) {
        const RescuseVehicleOwnerToEditToEdit = orders.find(
          (rescuseVehicleOwner) =>
            rescuseVehicleOwner.id === selectedEditRescuseVehicleOwner.id
        );
        if (RescuseVehicleOwnerToEditToEdit) {
          console.log(RescuseVehicleOwnerToEditToEdit);
          setFullnameValue(RescuseVehicleOwnerToEditToEdit.fullname);
          setEdit(RescuseVehicleOwnerToEditToEdit);
          setInitialFormState(RescuseVehicleOwnerToEditToEdit);
        }
      }
    }
  }, [selectedEditRescuseVehicleOwner, orders]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevRescuseVehicleOwner) => ({
      ...prevRescuseVehicleOwner,
      [name]: value,
    }));
    console.log(setEdit);
  };
  
  const handleSaveClick = () => {
    if (!selectedEditRescuseVehicleOwner || !edit) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }
  
    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges =
      JSON.stringify(edit) !== JSON.stringify(initialFormState);
    console.log(edit)
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ
      dispatch(editRescueVehicleOwner({ data: edit }))
        .then(() => {
          toast.success("Cập nhật thành công.");
          handleClose();
          reloadRescueVehicleOwners();
          setIsSuccess(true);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(`Lỗi khi cập nhật khách hàng: ${error.response.data.message}`);
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

  if (!orders) {
    return null;
  }
  // Hàm kiểm tra URL hợp lệ
  const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };
  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl); // Set the download URL in the state
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
                variant="h6"
                component="h2"
                id="RescuseVehicleOwner-detail-modal"
              >
                {selectedEditRescuseVehicleOwner
                  ? "Sửa Thông Tin Đơn Hàng Đã Hoàn Thành"
                  : "RescuseVehicleOwner Detail"}
              </Typography>

              {selectedEditRescuseVehicleOwner && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="id"
                      value={edit.id}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditRescuseVehicleOwner and prevent changes
                        if (!selectedEditRescuseVehicleOwner) {
                          handleInputChange(event);
                        }
                      }}
                      fullWidth
                      margin="normal"
                      style={{ display: "none" }}
                    />
                    <TextField
                      name="fullname"
                      label="Họ Và Tên"
                      value={fullnameValue}
                      disabled // Disable the TextField
                      fullWidth
                      margin="normal"
                    />

                    <TextField
                      name="accountId"
                      label="AccountId"
                      value={edit.accountId}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditRescuseVehicleOwner and prevent changes
                        if (!selectedEditRescuseVehicleOwner) {
                          handleInputChange(event);
                        }
                      }}
                      fullWidth
                      margin="normal"
                      style={{ display: "none" }}
                    />
                    <Grid container spacing={4} alignItems="center" marginBottom={2}>
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
                        <MenuItem key="status-nam" value="Nam">
                          Nam
                        </MenuItem>
                        <MenuItem key="status-nu" value="Nu">
                          Nữ
                        </MenuItem>
                      </Select>
                    </FormControl>

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
                        <MenuItem key="status-outofstock" value="Unactive">
                         Không Hoạt Động
                        </MenuItem>
                     
                      </Select>
                    </FormControl>
                  </CardContent>

                  <Box sx={{ display: "flex", justifyContent: "center" ,marginBottom:"5px"}}>
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
      {serverError && (
        <Typography color="error">
          {serverError}
        </Typography>
      )}
    </>
  );
};

export default ModalEdit;
