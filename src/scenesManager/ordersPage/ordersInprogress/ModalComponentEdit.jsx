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
  Autocomplete,
  CardActions,
  Collapse,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchOrdersInprogress,
  updateServiceForTechnicians,
} from "../../../redux/orderSlice";
import { fetchServices, getServiceId } from "../../../redux/serviceSlice";
import AddIcon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
const ModalEdit = ({ openEditModal, setOpenEditModal, selectedEditOrder }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const [edit, setEdit] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtereOrders, setFilteredOrders] = useState([]);
  const [serverError, setServerError] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [nameService, setNameService] = useState({});
  const [selectedServiceOrder, setSelectedServiceOrder] = useState(null);
  const [serviceId, setServiceId] = useState([]);

  const reloadOrderInprogress = () => {
    dispatch(fetchOrdersInprogress())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredOrders(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(
          "Lỗi khi tải lại danh sách đơn hàng đang thực hiện:",
          error
        );
      });
  };

  useEffect(() => {
    if (selectedEditOrder && orders) {
      if (selectedEditOrder.id) {
        const OrderToEdit = orders.find(
          (order) => order.id === selectedEditOrder.id
        );
        if (OrderToEdit) {
          console.log(OrderToEdit);
          setFullnameValue(OrderToEdit.fullname);
          setEdit(OrderToEdit);
          setInitialFormState(OrderToEdit);
        }
      }
    }
  }, [selectedEditOrder, orders]);

  //hàm lấy select service
  useEffect(() => {
    const getServices = async () => {
      try {
        const servicesResponse = await dispatch(fetchServices());

        const services = servicesResponse.payload.data;

        if (services) {
          //lọc dv status "ACTIVE"
          const activeService = services.filter(
            (service) => service.status === "ACTIVE"
          );
          setServicesData(activeService);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors if needed
      }
    };

    getServices();
  }, [dispatch]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
    console.log(setEdit);
  };

  const handleSaveClick = () => {
    if (!selectedEditOrder || !edit) {
      toast.error("Không có cập nhật dịch vụ");
      return;
    }

    // Check if a service is selected
    if (!selectedService) {
      toast.error("Vui lòng chọn một dịch vụ");
      return;
    }

    // Lấy tên dịch vụ đã chọn
    const selectedServiceName = selectedService.name;
    console.log(selectedServiceName);
    // Tạo một bản sao của đối tượng `edit` với tên dịch vụ
    const updatedEdit = {
      orderId: edit.id, // Lấy id của đơn hàng
      service: selectedServiceName, // Lưu tên dịch vụ vào thuộc tính `service` hoặc tùy chỉnh tên thuộc tính tương ứng trong đối tượng `edit`
      quantity: edit.quantity, // Lấy số lượng
    };
    console.log(updatedEdit);
    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges =
      JSON.stringify(updatedEdit) !== JSON.stringify(initialFormState);
    console.log(hasChanges);
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ
      dispatch(updateServiceForTechnicians(updatedEdit))
        .then(() => {
          toast.success("Cập nhật dịch vụ thành công");
          handleClose();

          setIsSuccess(true);
          reloadOrderInprogress();
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            // Lấy thông báo lỗi từ phản hồi máy chủ
            const serviceErrors = error.response.data.errors.Service;
            if (serviceErrors && serviceErrors.length > 0) {
              // In ra thông báo lỗi (hoặc xử lý theo cách bạn muốn)
              console.log(serviceErrors);
            }
          } else if (error.message) {
            toast.error(`Lỗi khi thêm dịch vụ: ${error.message}`);
          } else {
            toast.error("Lỗi khi thêm dịch vụ.");
          }
        });
    }
  };

  const handleClose = () => {
    setOpenEditModal(false);
  };

  //search service


  
  
  useEffect(() => {
// Ensure selectedEditOrder is not null and is an array
if (Array.isArray(selectedEditOrder) && selectedEditOrder.length > 0) {
  // Extract unique service IDs
  const uniqueServiceIds = [...new Set(selectedEditOrder.map(order => order.serviceId))];

  // Fetch service names for unique service IDs
  uniqueServiceIds.forEach((serviceId) => {
    fetchServiceName(serviceId);
  });
}
  }, [selectedEditOrder]);

  const fetchServiceName = (serviceId) => {
    console.log(serviceId);
    // Make sure you have a check to prevent unnecessary API calls
    if (!nameService[serviceId]) {
      dispatch(getServiceId({ id: serviceId }))
        .then((response) => {
          const data = response.payload.data;
          if (data && data.name) {
            setNameService((prevData) => ({
              ...prevData,
              [serviceId]: data.name,
            }));
          } else {
            console.error("Service name not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data:", error);
        });
    }
  };
  
  const handleServiceIdChange = (event, index) => {
    const newServiceId = event.target.value;
  
    // Update the serviceIds state with the new serviceId
    setServiceId(prevServiceIds => ({
      ...prevServiceIds,
      [index]: newServiceId
    }));
  
    // If you want to automatically call the API when the serviceId changes
    // getServiceId(newServiceId);
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
                {selectedEditOrder
                  ? "Cập nhật dịch vụ"
                  : "RescuseVehicleOwner Detail"}
              </Typography>

              {selectedEditOrder && (
                <Card>
                  <CardContent>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                          id: {selectedEditOrder[0].id}
                        </Typography>
                        <Typography variant="body2">
                          orderId:{selectedEditOrder[0].orderId}
                        </Typography>
                        <Typography variant="body2">
                          serviceId:{selectedEditOrder[0].serviceId}
                        </Typography>
                        <Typography variant="body2">
                          Số lượng :{selectedEditOrder[0].quantity}
                        </Typography>
                        <Typography variant="body2">
                          Tổng:{selectedEditOrder[0].tOtal}
                          <span> VNĐ</span>
                        </Typography>
                      </CardContent>
                    </Card>
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
                  </CardContent>
                  <Divider />
                  {selectedEditOrder &&
                    selectedEditOrder.length > 0 &&
                    selectedEditOrder.map((order, index) => (
                      <CardContent key={order.id || index}>
                        {/* <TextField
                          name="id"
                          label="id"
                          value={edit.id}
                          onChange={(event) => {
                            // Check if it's coming from selectedEditRescuseVehicleOwner and prevent changes
                            if (!selectedEditOrder) {
                              handleInputChange(event);
                            }
                          }}
                        
                          style={{ display: "none" }}
                        /> */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // This will add space between the children
                          }}
                        >
                            <TextField
                              variant="outlined"
                              label="Tên dịch vụ"
                              value={order.serviceId || ""}
                              fullWidth
                              margin="normal"
                              style={{ marginRight: "10px", flex: "1" }}
                            />
                           


                          <TextField
                            variant="outlined"
                            label="quantity"
                            value={order.quantity || ""} // Assuming 'total' is the property
                            onChange={(event) => {
                              // Handle the change. Here you need to implement the logic to update the state
                              // This is just a placeholder function, replace it with your actual state update logic
                              // const updatedOrders = selectedEditOrder.map(
                              //   (order, index) =>
                              //     index === 0
                              //       ? { ...order, total: event.target.value }
                              //       : order
                              // );
                              // setSelectedEditOrder(updatedOrders);
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AccountBalanceWalletIcon />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  VNĐ
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                            margin="normal"
                            style={{ marginLeft: "10px", flex: "1" }}
                            sx={{
                              flex: "1",
                              mt: 1, // Use theme spacing or specific value to reduce top margin
                              mb: 1, // Use theme spacing or specific value to reduce bottom margin
                            }}
                          />
                          <TextField
                            variant="outlined"
                            label="Total"
                            value={order.tOtal || ""} // Assuming 'total' is the property
                            onChange={(event) => {
                              // Handle the change. Here you need to implement the logic to update the state
                              // This is just a placeholder function, replace it with your actual state update logic
                              // const updatedOrders = selectedEditOrder.map(
                              //   (order, index) =>
                              //     index === 0
                              //       ? { ...order, total: event.target.value }
                              //       : order
                              // );
                              // setSelectedEditOrder(updatedOrders);
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AccountBalanceWalletIcon />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  VNĐ
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                            margin="normal"
                            style={{ marginLeft: "10px", flex: "1" }}
                            sx={{
                              flex: "1",
                              mt: 1, // Use theme spacing or specific value to reduce top margin
                              mb: 1, // Use theme spacing or specific value to reduce bottom margin
                            }}
                          />
                        </div>
                      </CardContent>
                    ))}
                  <Button
                    onClick={handleSaveClick}
                    startIcon={<AddIcon />}
                    sx={{
                      color: "green", // This will set the text color to green
                      marginLeft: "16px",
                      fontWeight: "bold",
                      "& .MuiButton-startIcon": {
                        // This targets the start icon specifically
                        color: "green", // This will set the icon color to green
                      },
                      "&:hover": {
                        backgroundColor: "rgba(0, 128, 0, 0.1)", // Light green background on hover
                        // If you want to change the icon color on hover as well, uncomment the following line:
                        // '& .MuiButton-startIcon': { color: 'darkgreen' },
                      },
                    }}
                  >
                    Thêm dịch vụ
                  </Button>

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
                      Lưu Dịch Vụ
                    </Button>
                  </Box>
                </Card>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
      {serverError && <Typography color="error">{serverError}</Typography>}
    </>
  );
};

export default ModalEdit;
