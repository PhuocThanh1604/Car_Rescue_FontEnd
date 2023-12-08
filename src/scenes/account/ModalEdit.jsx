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
import { editAccount, fetchAccounts } from "../../redux/accountSlice";
// import { getGenres, getGenresId } from '../../redux/genreSlice';
const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  accountDetails,
  updateFilteredTechnicians
}) => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.account.accounts);
  const [edit, setEdit] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const dataToServer = useRef(null); // Step 2
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);


  const getCurrentDateISOString = () => {
    const date = new Date();
    return date.toISOString();
  };
  

  const reloadTechnicians = () => {
    dispatch(fetchAccounts())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredTechnicians(data); 
          setLoading(false);
          console.log("Accounts reloaded:", data);
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi tải lại danh sách khách hàng:", error);
      });
  };
  

  useEffect(() => {
    if (!accountDetails) {
      // Xử lý khi không có dữ liệu accountDetails
      return;
    }
    setEdit(accountDetails); 

    // Các xử lý khác ...
  }, [accountDetails]);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setEdit((prevTechnician) => ({
      ...prevTechnician,
      [name]: value,
    }));
  };
  const handleSaveClick = () => {

    if (!accountDetails || !edit) {
      toast.error("Không có thông tin kỹ thuật viên để cập nhật.");
      return;
    }
  
    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges = JSON.stringify(edit) !== JSON.stringify(initialFormState);
  
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {

      const currentDate = getCurrentDateISOString();
      const dataToSend = { ...edit, updatedAt: currentDate };
      dispatch(editAccount({ data: dataToSend }))
        .then(() => {
          setIsSuccess(true);
          toast.success("Cập nhật tài khoản thành công.");
          updateFilteredTechnicians();
          handleClose();
          updateFilteredTechnicians();
          // reloadTechnicians();
          
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

  if (!accounts) {
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
                textAlign= "center"

              >
                {accountDetails ? "Sửa Thông Tài Khoản" : "Technician Detail"}
              </Typography>

              {accountDetails && (
                <Card>
                <CardContent>
                  <TextField
                    name="id"
                    label="id"
                    value={edit.id }
                    onChange={(event) => {
                      // Check if it's coming from selectedEditRescuseVehicleOwner and prevent changes
                      if (!accountDetails) {
                        handleInputChange(event);
                      }
                    }}
                    fullWidth
                    margin="normal"
                    disabled 
                  />
                     
                  <TextField
                    name="email"
                    label="Email"
                    value={edit.email}
                    onChange={handleInputChange}
                 
                    fullWidth
                    margin="normal"
                  />
                      <TextField
                    name="deviceToken"
                    label="deviceToken"
                    value={edit.deviceToken}
                    onChange={handleInputChange}
                   
                    fullWidth
                    margin="normal"
                    style={{ display: "none" }}

                  />
                      <TextField
                    name="updatedAt"
                    label="updatedAt"
                    value={edit.updatedAt}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    style={{ display: "none" }}

                  />
                      <TextField
                    name="password"
                    label="password"
                    value={edit.password}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    style={{ display: "none" }}
                  />

 
             
           
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
