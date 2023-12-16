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
import { textAlign } from "@mui/system";

const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditService,
}) => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.service.services);
  const [edit, setEdit] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtereServices, setFilteredServices] = useState(
    []
  );

  const reloadServices = () => {
    
    dispatch(fetchServices())
    
      .then((response) => {
        const data = response.payload.data;
        console.log(data)
        if (data) {
          setFilteredServices(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách dịch vụ:", error);
      });
  };

  useEffect(() => {
    if (selectedEditService && services) {
      if (selectedEditService.id) {
        const ServiceToEditToEdit = services.find(
          (service) =>
          service.id === selectedEditService.id
        );
        if (ServiceToEditToEdit) {
          console.log(ServiceToEditToEdit);
          setFullnameValue(ServiceToEditToEdit.fullname);
          setEdit(ServiceToEditToEdit);
          setInitialFormState(ServiceToEditToEdit);
        }
      }
    }
  }, [selectedEditService, services]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevService) => ({
      ...prevService,
      [name]: value,
    }));
    console.log(setEdit);
  };

  const handleSaveClick = () => {
    if (!selectedEditService || !edit) {
      toast.error("Không có thông tin dịch vụ để cập nhật.");
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
      dispatch(editService({ data: edit }))
        .then((response) => {
          console.log(response);
          toast.success("Cập nhật dịch vụ thành công.");
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
                sx={{textAlign:"center",fontWeight:"bold"}}
              >
                {selectedEditService
                  ? "Sửa Thông Tin Dịch Vụ"
                  : "Service Detail"}
              </Typography>

              {selectedEditService && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="ID"
                      value={edit.id}
                      fullWidth
                      margin="normal"
                      disabled
                      style={{ display: "none" }}
                    />
                        <TextField
                      name="createdBy"
                      label="createdBy"
                      value={edit.createdBy}
                      fullWidth
                      margin="normal"
                      disabled
                      style={{ display: "none" }}
                    />
                    <TextField
                      name="name"
                      label="Tên Dịch Vụ"
                      value={edit.name || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="description"
                      label="Mô Tả"
                      type="text"
                      value={edit.description || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="price"
                      label="Giá Tiền Dịch Vụ"
                      type="number"
                      value={edit.price || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    {/* <TextField
                      name="type"
                      type="text"
                      label="Loại Dịch Vụ"
                      value={edit.type || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    /> */}
                      <FormControl fullWidth sx={{ marginTop: 1 }}>
                      <InputLabel id="demo-simple-select-label">
                        Loại Dịch Vụ
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={edit.type || ""}
                        onChange={handleInputChange}
                        variant="outlined"
                        className="filter-select"
                        name="type"
                        label="type"
                        fullWidth
                      >
                        <MenuItem key="status-active" value="Fixing">
                          Fixing
                        </MenuItem>
                        <MenuItem key="status-INACTIVE" value="Towing">
                          Towing
                        </MenuItem>
                      </Select>
                    </FormControl>
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
