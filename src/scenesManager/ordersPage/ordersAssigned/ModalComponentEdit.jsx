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

} from "@mui/material";
import { Close} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { createCancelOrder, fetchOrdersAssigned } from "../../../redux/orderSlice";

const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditOrder,
  onDataUpdated
}) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const [edit, setEdit] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [cancellationReason, setCancellationReason] = useState("");
  
  const reloadOrderAssigned = () => {
    dispatch(fetchOrdersAssigned())
    
      .then((response) => {
        const data = response.payload.data;
        console.log(data)
        if (data) {
          setFilteredOrders(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách đơn hàng:", error);
      });
  };
  useEffect(() => {
    if (selectedEditOrder && orders) {
      if (selectedEditOrder.id) {
        const OrderToEditToEdit = orders.find(
          (Order) =>
            Order.id === selectedEditOrder.id
        );
        if (OrderToEditToEdit) {
          console.log(OrderToEditToEdit);
          setFullnameValue(OrderToEditToEdit.fullname);
          setEdit(OrderToEditToEdit);
          setInitialFormState(OrderToEditToEdit);
        }
      }
    }
  }, [selectedEditOrder, orders]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEdit((prevEdit) => ({
      ...prevEdit,
      [name]: value
    }));
  };
  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders); // Update the local state when the Redux state changes
    }
  }, [orders]);
  

  const handleSaveClick = () => {
    console.log(setEdit);
    if (!selectedEditOrder || !edit) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }

     // Lấy tên dịch vụ đã chọn
     const selectedCancellationReason = cancellationReason;
     const selectedOrderId = edit.id;
     console.log(selectedCancellationReason);
 
     if (!selectedOrderId) {
       console.error("No orderId to reload details for.");
       toast.error("No valid order ID found.");
       return;
     }
     // Tạo một bản sao của đối tượng `edit` với tên dịch vụ
     const updatedEdit = {
      orderID: selectedOrderId, // Lấy id của đơn hàng
      cancellationReason: selectedCancellationReason, // Lưu tên dịch vụ vào thuộc tính `service` hoặc tùy chỉnh tên thuộc tính tương ứng trong đối tượng `edit`
     };
  
    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges =
      JSON.stringify(updatedEdit) !== JSON.stringify(initialFormState);
    console.log(edit)
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ
      dispatch(createCancelOrder(updatedEdit))
        .then(() => {
          toast.success("Hủy đơn thành công.");
          handleClose();
          if (onDataUpdated) {
            onDataUpdated(); // Call the callback function after successful update
          }
          setIsSuccess(true);
          setCancellationReason(null)
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(`Lỗi khi hủy đơn : ${error.response.data.message}`);
          } else if (error.message) {
            toast.error(`Lỗi khi hủy đơn: ${error.message}`);
          } else {
            toast.error("Lỗi khi hủy đơn");
          }
        });
    }
  };
  
  const handleClose = () => {
    setOpenEditModal(false);
    if (isSuccess) {
      console.log("success"+isSuccess);
      reloadOrderAssigned(); // Reload orders when the modal is closed after a successful update
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="Order-detail-modal"
        aria-describedby="Order-detail-modal-description"
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
                id="Order-detail-modal"
                sx={{textAlign:"center"}}
              >
                {selectedEditOrder
                  ? "Hủy Đơn Hàng"
                  : "Order Detail"}
              </Typography>

              {selectedEditOrder && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="id"
                      value={edit.id}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditOrder and prevent changes
                        if (!selectedEditOrder) {
                          handleInputChange(event);
                        }
                      }}
                      fullWidth
                      margin="normal"
                      style={{ display: "none" }}
                    />
                 


                    <TextField
                      name="cancellationReason"
                      label="Lý do hủy đơn"
                      value={cancellationReason}
                      onChange={(event) => {
                        setCancellationReason(event.target.value);
                      }}
                      fullWidth
                      margin="normal"
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
