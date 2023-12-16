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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {
  createCancelOrder,
  createChangeTypeRescue,
  fetchOrdersAssigned,
} from "../../../redux/orderSlice";

const ModalCancel = ({
  openCancelModal,
  setOpenCancelModal,
  selectedCancelOrder,
  onDataUpdated,
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
  const [typeRescue, setTypeRescue] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  //check value rescue type
  const checkRescueTypeChange = (event) => {
    const newRescueType = event.target.value;

    if (newRescueType === selectedCancelOrder.rescueType) {
      toast.error("Vui lòng chọn một loại hình cứu hộ khác.");
      return;
    }

    setTypeRescue(newRescueType);
  };
  const handleCancellationReasonChange = (event) => {
    setCancellationReason(event.target.value);
  };
  const reloadOrderAssigned = () => {
    dispatch(fetchOrdersAssigned())
      .then((response) => {
        const data = response.payload.data;
        console.log(data);
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
    if (selectedCancelOrder && orders) {
      if (selectedCancelOrder.id) {
        const OrderToEdit = orders.find(
          (order) => order.id === selectedCancelOrder.id
        );
        if (OrderToEdit) {
          setFullnameValue(OrderToEdit.fullname);
          setEdit(OrderToEdit);
          setInitialFormState(OrderToEdit);
        }
      }
    }
  }, [selectedCancelOrder, orders]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEdit((prevEdit) => ({
      ...prevEdit,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders); // Update the local state when the Redux state changes
    }
  }, [orders]);

  const handleCancelRescue = () => {
    console.log(setEdit);
    if (!selectedCancelOrder || !edit) {
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
    console.log(edit);
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ
      dispatch(createCancelOrder(updatedEdit))
        .then((response) => {
          console.log(response.payload.message);
          if (response.payload.status === 201) {
            toast.success("Đơn hàng đã được hủy trong hệ thống");
            handleClose();
            if (onDataUpdated) {
              onDataUpdated(); // Call the callback function after successful update
            }
            setIsSuccess(true);
            setCancellationReason(null);
          } else if (response.payload.status === 400) {
            // Xử lý lỗi khi status là 400 (Bad Request)
            toast.error("Lỗi: Yêu cầu không hợp lệ hoặc thiếu thông tin.");
          } else if (response.payload.status === 500) {
            // Xử lý lỗi khi status là 500 (Internal Server Error)
            toast.error("Lỗi: Lỗi phía máy chủ. Vui lòng thử lại sau.");
          } else {
            // Xử lý các trường hợp lỗi khác (nếu có)
            toast.error("Hủy đơn không thành công");
          }
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
    setOpenCancelModal(false);
    if (isSuccess) {
      console.log("success" + isSuccess);
      reloadOrderAssigned(); // Reload orders when the modal is closed after a successful update
    }
  };
  const handleCancel = () => {
    // Đặt lại các trạng thái hoặc thực hiện các xử lý cần thiết trước khi đóng modal
    // Ở đây, bạn có thể đặt lại các trạng thái hoặc làm bất kỳ xử lý nào khác cần thiết trước khi đóng modal
    setOpenCancelModal(false);
  };
  return (
    <>
      <ToastContainer />
      <Modal
        open={openCancelModal}
        onClose={handleClose}
        aria-labelledby="Order-detail-modal"
        aria-describedby="Order-detail-modal-description"
        closeAfterTransition
      >
        <Fade in={openCancelModal}>
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
                sx={{ textAlign: "center",fontWeight: "bold" }}
              >
                {selectedCancelOrder ? "Hủy Đơn Cứu Hộ" : "Hủy Đơn Cứu Hộ"}
              </Typography>

              {selectedCancelOrder && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="id"
                      value={edit.id}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditOrder and prevent changes
                        if (!selectedCancelOrder) {
                          handleInputChange(event);
                        }
                      }}
                      fullWidth
                      margin="normal"
                      style={{ display: "none" }}
                    />

                    <FormControl fullWidth margin="normal">
                      <InputLabel id="cancellation-reason-label">
                        Lý do hủy đơn
                      </InputLabel>
                      <Select
                        labelId="cancellation-reason-label"
                        id="cancellation-reason-select"
                        value={cancellationReason}
                        label="Lý do hủy đơn"
                        onChange={handleCancellationReasonChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Không cần nữa">Không cần nữa</MenuItem>
                        <MenuItem value="Đặt nhầm đơn hàng">
                          Đặt nhầm đơn hàng
                        </MenuItem>
                        <MenuItem value="Thay đổi địa chỉ đơn hàng">
                          Thay đổi địa chỉ đơn hàng
                        </MenuItem>
                        <MenuItem value="Đơn hàng chậm trễ">
                          Đơn hàng chậm trễ
                        </MenuItem>
                        {/* Thêm các lý do khác tại đây */}
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
                      onClick={handleCancelRescue}
                      variant="contained"
                      color="primary"
                    >
                      Đồng Ý 
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

export default ModalCancel;
