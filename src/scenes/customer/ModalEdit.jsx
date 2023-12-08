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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { editCustomer, fetchCustomers } from "../../redux/customerSlice";
import { ToastContainer, toast } from "react-toastify";
import UploadImageField from "../../components/uploadImage";
// import { getGenres, getGenresId } from '../../redux/genreSlice';
const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditCustomer,
}) => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.customers);
  const [edit, setEdit] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const dataToServer = useRef(null); // Step 2
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [serverError, setServerError] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(edit.avatar || "");
  const reloadCustomers = () => {
    dispatch(fetchCustomers())
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
    if (selectedEditCustomer && customers) {
      if (selectedEditCustomer.id) {
        const customerToEdit = customers.find(
          (customer) => customer.id === selectedEditCustomer.id
        );
        if (customerToEdit) {
          console.log(customerToEdit);
          setFullnameValue(customerToEdit.fullname);
          setEdit(customerToEdit);
          setInitialFormState(customerToEdit);
        }
      }
    }
  }, [selectedEditCustomer, customers]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
    console.log(setEdit);
  };
  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl); // Set the download URL in the state
    setEdit((prevRescuseVehicleOwner) => ({
      ...prevRescuseVehicleOwner,
      avatar: imageUrl,
    }));
  };

  const handleSaveClick = () => {
    if (!selectedEditCustomer || !edit) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }

    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges =
      JSON.stringify(edit) !== JSON.stringify(initialFormState);

    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ
      dispatch(editCustomer({ data: edit }))
        .then(() => {
          setIsSuccess(true);
          toast.success("Cập nhật thành công.");
          handleClose();
          reloadCustomers();
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

  if (!customers) {
    // Thêm điều kiện kiểm tra nếu customers không có giá trị
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
                sx={{ textAlign: "center" }}
              >
                {selectedEditCustomer ? "Sửa Thông Tin Khách Hàng" : "Customer Detail"}
              </Typography>

              {selectedEditCustomer && (
               <Card>
               <CardContent>
                 <TextField
                   name="id"
                   label="id"
                   value={edit.id}
                   onChange={(event) => {
                     // Check if it's coming from selectedEditRescuseVehicleOwner and prevent changes
                     if (!selectedEditCustomer) {
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
                     if (!selectedEditCustomer) {
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
                       Active
                     </MenuItem>
                     <MenuItem key="status-INACTIVE" value="INACTIVE">
                       INACTIVE
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
