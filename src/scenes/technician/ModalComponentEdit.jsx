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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { editTechnician, fetchTechnicians } from "../../redux/technicianSlice";
import Grid from "@mui/system/Unstable_Grid/Grid";
import UploadImageField from "../../components/uploadImage";
// import { getGenres, getGenresId } from '../../redux/genreSlice';
const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditTechnician,
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
  const [serverError, setServerError] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(edit.avatar || "");
  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl); // Set the download URL in the state
    setEdit((prevRescuseVehicleOwner) => ({
      ...prevRescuseVehicleOwner,
      avatar: imageUrl,
    }));
  };

  const reloadTechnicians = () => {
    dispatch(fetchTechnicians())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredTechnicians(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
          console.log("Services reloaded:", data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách khách hàng:", error);
      });
  };

  useEffect(() => {
    if (selectedEditTechnician && technicians) {
      if (selectedEditTechnician.id) {
        const technicianToEdit = technicians.find(
          ( technician) =>  technician.id === selectedEditTechnician.id
        );
        if (technicianToEdit) {
          console.log("Data của Kỹ Thuật Viên "+technicianToEdit);
          setFullnameValue(technicianToEdit.fullname);
          setEdit(technicianToEdit);
          setInitialFormState(technicianToEdit);
        }
      }
    }
  }, [selectedEditTechnician, technicians]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevTechnician) => ({
      ...prevTechnician,
      [name]: value,
    }));
    console.log(setEdit);
  };
  const handleSaveClick = () => {
    if (!selectedEditTechnician || !edit) {
      toast.error("Không có thông tin kỹ thuật viên để cập nhật.");
      return;
    }
  
    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges = JSON.stringify(edit) !== JSON.stringify(initialFormState);
  
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      if (
        selectedEditTechnician.status === "ASSIGNED" &&
        (edit.status === "ACTIVE" || edit.status === "INACTIVE")
      ) {
        if (edit.status === "ACTIVE") {
          toast.warn("Kỹ thuật viên đang ở trạng thái Đang làm việc không thể chuyển sang trạng thái Hoạt Động");
        } else  {
          toast.warn("Kỹ thuật viên đang ở trạng thái Đang làm việc không thể chuyển sang trạng thái Không Hoạt Động.");
        } 
        
        return;
      }
      // Gửi yêu cầu cập nhật lên máy chủ
      dispatch(editTechnician({ data: edit }))
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
  // Hàm kiểm tra URL hợp lệ
  const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

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
                variant="h4"
                component="h2"
                id="Technician-detail-modal"
                textAlign= "center"

              >
                {selectedEditTechnician ? "Sửa Thông Tin Kỹ Thuật Viên" : "Technician Detail"}
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
                      if (!selectedEditTechnician) {
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
 
                  {/* <TextField
                    name="avatar"
                    label="Hình Ảnh"
                    type="text"
                    value={edit.avatar || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  /> */}
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
                      <MenuItem key="status-outofstock" value="Nu">
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
                      <MenuItem key="status-assigned" value="ASSIGNED">
                       Đang làm việc
                      </MenuItem>
                      <MenuItem key="status-INACTIVE" value="INACTIVE">
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
    </>
  );
};

export default ModalEdit;
