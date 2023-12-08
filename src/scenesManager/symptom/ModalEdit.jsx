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
import { editService, editSymptom, fetchServices, fetchSymptom } from "../../redux/serviceSlice";

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
    
    dispatch(fetchSymptom())
    
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
        console.error("Lỗi khi tải lại danh sách hiện tượng:", error);
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
      toast.error("Không có thông tin hiện tượng để cập nhật.");
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
      dispatch(editSymptom({ data: edit }))
        .then((response) => {
          console.log(response);
          toast.success("Cập nhật thành công.");
          handleClose();
          reloadServices();
          setIsSuccess(true);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(
              `Lỗi khi cập nhật hiện tượng: ${error.response.data.message}`
            );
          } else if (error.message) {
            toast.error(`Lỗi khi cập nhật  hiện tượng: ${error.message}`);
          } else {
            toast.error("Lỗi khi cập nhật  hiện tượng.");
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
                sx={{textAlign:"center"}}
              >
                {selectedEditService
                  ? "Sửa Thông Tin Hiện Tượng"
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
                      name="symptom1"
                      label="Tên Hiện Tượng"
                      value={edit.symptom1 || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
              
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
