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
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { editService, fetchServices } from "../../redux/serviceSlice";
import { fetchModelCar, updateModelCar } from "../../redux/modelCarSlice";
import { textAlign } from "@mui/system";

const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditService,
  setSelectedEditService,
}) => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.service.services);
  const [edit, setEdit] = useState(selectedEditService);
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtereServices, setFilteredServices] = useState([]);

  const reloadServices = () => {
    dispatch(fetchModelCar())
      .then((response) => {
        const data = response.payload.data;
        console.log(data);
        if (data) {
          setFilteredServices(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.dismiss("Lỗi khi tải lại danh sách dịch vụ:", error);
      });
  };
  useEffect(() => {
    if (isSuccess) {
      // Gọi hàm để tải lại dữ liệu ở đây
      // Ví dụ:
      reloadServices();
      // Đặt lại cờ isSuccess thành false sau khi đã xử lý tải lại dữ liệu
      setIsSuccess(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (selectedEditService && services) {
      // ... code xử lý khác
      setEdit(selectedEditService); // Thay đổi dòng này để sử dụng selectedEditService từ props thay vì useState
      // ... code xử lý khác
    }
  }, [selectedEditService, services]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEdit((prevEdit) => ({
      ...prevEdit,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    if (!selectedEditService || !edit) {
      toast.error("Không có thông tin dịch vụ để cập nhật.");
      return;
    }
    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges =
      JSON.stringify(edit) !== JSON.stringify(selectedEditService);

    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ
      dispatch(updateModelCar({ data: edit }))
        .then(() => {
          toast.success("Cập nhật mẫu xe thành công.");
          handleClose();
          reloadServices();
          setIsSuccess(true);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(
              `Lỗi khi cập nhật dịch vụ: ${error.response.data.message}`
            );
          } else if (error.message) {
            toast.error(`Lỗi khi cập nhật dịch vụ: ${error.message}`);
          } else {
            toast.error("Lỗi khi cập nhật dịch vụ.");
          }
        });
    }
  };

  const handleClose = () => {
    setOpenEditModal(false);
  };

  if (!services) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <Modal
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="Service-detail-modal"
        aria-describedby="Service-detail-modal-description"
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
                id="Service-detail-modal"
                sx={{ textAlign: "center" }} // Chỉnh style tại đây để căn giữa
              >
                {selectedEditService
                  ? "Sửa Thông Tin Mẫu Xe"
                  : "Service Detail"}
              </Typography>

              {selectedEditService && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="ID"
                      value={edit && edit.id ? edit.id : ""}
                      fullWidth
                      margin="normal"
                      disabled
                      style={{ display: "none" }}
                    />

                    <TextField
                      name="model1"
                      label="Tên Mẫu Xe"
                      value={edit && edit.model1 ? edit.model1 : ""}
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
                        value={edit && edit.status ? edit.status : ""}
                        onChange={handleInputChange}
                        variant="outlined"
                        className="filter-select"
                        name="status"
                        label="Status"
                      >
                        <MenuItem key="status-active" value="ACTIVE">
                          Hoạt Động
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
