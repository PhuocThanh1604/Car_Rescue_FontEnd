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
  Divider,
  useMediaQuery,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchOrdersInprogress,
  getOrderDetailId,
  updateServiceForTechnicians,
} from "../../../redux/orderSlice";
import { fetchServices, getServiceId } from "../../../redux/serviceSlice";
import AddIcon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Formik } from "formik";
import * as yup from "yup";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
const ModalEdit = ({ openEditModal, setOpenEditModal, selectedEditOrder }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [edit, setEdit] = useState({
    quantity: "",
  });
  const [order, setOrder] = useState({
    quantity: null, // Giá trị ban đầu của quantity từ order
    // Các thuộc tính khác của order
  });
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
  const [serviceId, setServiceId] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [quantityUpdateService, setQuantityUpdateService] = useState("");
  const [quantityValues, setQuantityValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  const checkoutSchema = yup.object().shape({
    quantity: yup.number().required("Required"),
    service: yup.string().required("Required"),
  });
  const initialValues = {
    orderId: selectedEditOrder?.[0]?.orderId || "",
    quantity: "",
    service: [],
  };
  const [orderQuantities, setOrderQuantities] = useState({});

  const [selectedEditOrderUpdate, setSelectedEditOrderUpdate] = useState([]);
  // //hanldeQuantityupdate
  //CHECK DUPLICATE NAME SERVICE
  const checkDuplicateSerivce = (newValue) => {
    const newRescueType = newValue ? newValue.name : "";

    selectedEditOrder.forEach((order) => {
      if (newRescueType === nameService[order.serviceId]) {
        toast.error("Dịch vụ đã có, vui lòng chọn loại khác");
        return null; // Ngăn chặn việc chọn giá trị này
      }
    });

    setSelectedService(newValue);
  };

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
    if (selectedEditOrder && selectedEditOrder.length > 0) {
      const newOrderQuantities = {};
      selectedEditOrder.forEach((order) => {
        newOrderQuantities[order.id] = order.quantity !== null ? order.quantity.toString() : '';
      });
      setOrderQuantities(newOrderQuantities);
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

  const handleInputChange = (event, orderId) => {
    const { value } = event.target;
    setOrderQuantities((prevOrderQuantities) => ({
      ...prevOrderQuantities,
      [orderId]: value,
    }));
    setIsEditing(true);
  };
  
  


  useEffect(() => {
    if (!isEditing) {
      setEdit((prevEdit) => ({
        ...prevEdit,
        quantity: order.quantity !== null ? order.quantity.toString() : '',
      }));
    }
  }, [order.quantity, isEditing]);


  const handleAddService = () => {
    // Lấy giá trị quantity từ values
    console.log(quantity);
    if (!selectedEditOrder || !edit) {
      toast.error("Không có thêm nhật dịch vụ");
      return;
    }
    // Check if a service is selected
    if (!selectedService) {
      toast.error("Vui lòng chọn một dịch vụ");
      return;
    }
    // Lấy tên dịch vụ đã chọn
    const selectedServiceName = selectedService.name;
    const selectedOrderId = selectedEditOrder[0].orderId;
    console.log(selectedServiceName);

    if (!selectedOrderId) {
      console.error("No orderId to reload details for.");
      toast.error("No valid order ID found.");
      return;
    }
    // Tạo một bản sao của đối tượng `edit` với tên dịch vụ
    const updatedEdit = {
      orderId: selectedOrderId, // Lấy id của đơn hàng
      service: selectedServiceName, // Lưu tên dịch vụ vào thuộc tính `service` hoặc tùy chỉnh tên thuộc tính tương ứng trong đối tượng `edit`
      quantity: quantity, // Lấy số lượng
    };
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
          setIsSuccess(true);
          reloadOrderDetail(selectedOrderId);
          handleClose();
          setQuantity(null);
          setSelectedService(null);
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
  const handleUpdateService = () => {
    // Lấy giá trị quantity từ values
    console.log(quantity);
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
    const selectedOrderId = selectedEditOrder[0].orderId;
    console.log(selectedServiceName);

    if (!selectedOrderId) {
      console.error("No orderId to reload details for.");
      toast.error("No valid order ID found.");
      return;
    }
    // Tạo một bản sao của đối tượng `edit` với tên dịch vụ
    const updatedEdit = {
      orderId: selectedOrderId, // Lấy id của đơn hàng
      service: selectedServiceName, // Lưu tên dịch vụ vào thuộc tính `service` hoặc tùy chỉnh tên thuộc tính tương ứng trong đối tượng `edit`
      quantity: quantity, // Lấy số lượng
    };
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
          setIsSuccess(true);
          reloadOrderDetail(selectedOrderId);
          handleClose();
          reloadOrderInprogress();
          setQuantity(null);
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
  const reloadOrderDetail = (orderId) => {
    console.log(orderId);
    if (!orderId) {
      console.error("No orderId provided for reloading order details.");
      return;
    }
    dispatch(getOrderDetailId({ id: orderId }))
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredOrders(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại chi tiết đơn:", error);
      });
  };
  const handleClose = () => {
    setOpenEditModal(false);
  };



  useEffect(() => {
    // Ensure selectedEditOrder is not null and is an array
    if (Array.isArray(selectedEditOrder) && selectedEditOrder.length > 0) {
      // Group services and set them in state or use them directly
      // Extract service IDs, removing duplicates based on custom criteria
      const serviceIdsSeen = new Set(); // To keep track of serviceIds we have seen
      const uniqueServiceIds = selectedEditOrder
        .map((order) => order.serviceId)
        .filter((serviceId) => {
          const isDuplicate = serviceIdsSeen.has(serviceId);
          serviceIdsSeen.add(serviceId); // Add the current serviceId to the set
          return !isDuplicate && serviceId && !nameService[serviceId]; // Return true if it's not a duplicate and not already fetched
        });

      // Fetch service names for unique service IDs
      uniqueServiceIds.forEach(fetchServiceName);
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
                      <div key={order.id || index}>
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
                          style={{ display: "none" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // This will add space between the children
                            marginLeft: "16px",
                            marginRight: "12px",
                          }}
                        >
                          <TextField
                            variant="outlined"
                            label="Tên dịch vụ"
                            value={nameService[order.serviceId] || ""}
                            fullWidth
                            margin="normal"
                            style={{ marginRight: "10px", flex: "1" }}
                            InputProps={{
                              readOnly: true, // If you don't want it to be editable, make it read-only
                            }}
                          />

                          <TextField
                            name="quantity"
                            label="Số lượng"
                            type="text"
                            value={orderQuantities[order.id] !== undefined ? orderQuantities[order.id] : ''}
                            onChange={(event) => handleInputChange(event, order.id)}
                            fullWidth
                            margin="normal"
                            style={{ marginLeft: "10px", flex: "1" }}
                          />
                          <TextField
                            variant="outlined"
                            label="Total"
                            value={order.tOtal || ""}
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
                          />
                        </div>
                      </div>
                    ))}

                  <Formik
                    onSubmit={handleAddService}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}
                  >
                    {(formikProps) => {
                      // Log current form values

                      return (
                        // Your form JSX goes here
                        <form onSubmit={formikProps.handleSubmit}>
                          <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                              "& > div": {
                                gridColumn: isNonMobile ? undefined : "span 4",
                              },
                            }}
                          >
                            <Autocomplete
                              id="service-select"
                              options={servicesData}
                              getOptionLabel={(option) =>
                                option.name || "Default Name"
                              }
                              sx={{ width: 260 }}
                              value={selectedService}
                              onChange={(_, newValue) => {
                                checkDuplicateSerivce(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Danh Sách Dịch Vụ"
                                  sx={{ marginLeft: 2 }}
                                />
                              )}
                            />
                            <TextField
                              name="quantity"
                              label="Số lượng"
                              type="number"
                              InputLabelProps={{ shrink: true }}
                              onChange={(e) => {
                                formikProps.handleChange(e); // Update Formik's internal state
                                setQuantity(e.target.value); // Update component's state
                              }}
                              onBlur={formikProps.handleBlur}
                              value={formikProps.values.quantity}
                              fullWidth
                              error={
                                formikProps.touched.quantity &&
                                Boolean(formikProps.errors.quantity)
                              }
                              helperText={
                                formikProps.touched.quantity &&
                                formikProps.errors.quantity
                              }
                              sx={{ gridColumn: "span 1", marginLeft: 14 }}
                            />
                          </Box>
                          <Button
                            onClick={handleAddService}
                            startIcon={<AddIcon />}
                            sx={{
                              color: "green", // This will set the text color to green
                              marginLeft: "16px",
                              marginTop: "10px",
                              marginBottom: "16px",
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
                        </form>
                      );
                    }}
                  </Formik>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "5px",
                      marginTop: "5px",
                    }}
                  >
                    <Button
                      onClick={handleUpdateService}
                      variant="contained"
                      color="primary"
                    >
                      Cập Nhật Dịch Vụ
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
