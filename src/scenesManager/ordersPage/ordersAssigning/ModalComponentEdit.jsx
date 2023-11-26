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
  createChangeTypeRescue,
  fetchOrdersAssigned,
} from "../../../redux/orderSlice";

const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditOrder,
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

  //check value rescue type
  const checkRescueTypeChange = (event) => {
    const newRescueType = event.target.value;

    if (newRescueType === selectedEditOrder.rescueType) {
      toast.error("Vui lòng chọn một loại hình cứu hộ khác.");
      return;
    }

    setTypeRescue(newRescueType);
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
    if (selectedEditOrder && orders) {
      if (selectedEditOrder.id) {
        const OrderToEdit = orders.find(
          (order) => order.id === selectedEditOrder.id
        );
        if (OrderToEdit) {
          setFullnameValue(OrderToEdit.fullname);
          setEdit(OrderToEdit);
          setInitialFormState(OrderToEdit);
        }
      }
    }
  }, [selectedEditOrder, orders]);

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

  const handleSaveChangeRescueType = () => {
    console.log(setEdit);
    if (!selectedEditOrder || !edit) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }
    if (typeRescue === selectedEditOrder.rescueType) {
      toast.error("Vui lòng chọn một loại hình cứu hộ khác trước khi lưu.");
      return;
    }
    const selectedType = typeRescue;
    const selectedOrderId = edit.id;
    console.log(selectedType);

    if (!selectedOrderId) {
      console.error("No orderId to reload details for.");
      toast.error("No valid order ID found.");
      return;
    }
    // Tạo một bản sao của đối tượng `edit` với tên dịch vụ
    const updatedEdit = {
      orderID: selectedOrderId, // Lấy id của đơn hàng
      type: selectedType, // Lưu tên dịch vụ vào thuộc tính `service` hoặc tùy chỉnh tên thuộc tính tương ứng trong đối tượng `edit`
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
      dispatch(createChangeTypeRescue(updatedEdit))
        .then((response) => {
          console.log(response)
          if (response.payload.status === 201) {
            toast.success("Thay đổi loại cứu hộ thành công.");
            handleClose();
            if (onDataUpdated) {
              onDataUpdated(); // Call the callback function after successful update
            }
            setIsSuccess(true);
            setTypeRescue(null);
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
            toast.error(
              `Lỗi khi thay đổi loại hình cứu hộ: ${error.response.data.message}`
            );
          } else if (error.message) {
            toast.error(`Lỗi khi thay đổi loại hình cứu hộ: ${error.message}`);
          } else {
            toast.error("Lỗi khi thay đổi loại hình cứu hộ.");
          }
        });
    }
  };

  const handleClose = () => {
    setOpenEditModal(false);
    if (isSuccess) {
      console.log("success" + isSuccess);
      reloadOrderAssigned(); // Reload orders when the modal is closed after a successful update
    }
  };
  const handleCancel = () => {
    // Đặt lại các trạng thái hoặc thực hiện các xử lý cần thiết trước khi đóng modal
    // Ở đây, bạn có thể đặt lại các trạng thái hoặc làm bất kỳ xử lý nào khác cần thiết trước khi đóng modal
    setOpenEditModal(false);
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
                sx={{ textAlign: "center" }}
              >
                {selectedEditOrder
                  ? "Thay Đổi Loại Hình Cứu Hộ"
                  : "Hủy Đơn Cứu Hộ"}
              </Typography>

              {selectedEditOrder && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="id"
                      value={edit.id}
                      onChange={(event) => {
                        // Check if it's coming from selectedEditRescuseVehicleOwner and prevent changes
                        if (!selectedEditOrder) {
                          handleInputChange(event);
                        }
                      }}
                      fullWidth
                      margin="normal"
                      style={{ display: "none" }}
                    />

                    <Typography sx={{ display: "none" }}>
                      {selectedEditOrder.rescueType}
                    </Typography>

                    <FormControl fullWidth variant="filled">
                      <InputLabel id="rescueType-label">
                        Loại Hình Thức Cứu Hộ
                      </InputLabel>
                      <Select
                        labelId="rescueType-label"
                        id="rescueType"
                        name="rescueType"
                        value={typeRescue}
                        onChange={checkRescueTypeChange}
                      >
                        <MenuItem value="Towing">Xe Kéo</MenuItem>
                        <MenuItem value="Fixing">Sửa Tại Chỗ Cơ Bản</MenuItem>
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
                      onClick={handleSaveChangeRescueType}
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
