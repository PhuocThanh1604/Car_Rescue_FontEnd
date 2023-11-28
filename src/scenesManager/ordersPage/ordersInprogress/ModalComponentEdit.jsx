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
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import PlaceIcon from "@mui/icons-material/Place";
import CakeIcon from "@mui/icons-material/Cake";
import TimerIcon from "@mui/icons-material/Timer";
import {
  addServiceForTechnicians,
  fetchOrdersInprogress,
  getFormattedAddressGG,
  getOrderDetailId,
  getOrderId,
  updateServiceForTechnicians,
} from "../../../redux/orderSlice";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { fetchServices, getServiceId } from "../../../redux/serviceSlice";
import AddIcon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../../theme";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import moment from "moment";
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
    // Lấy thời gian hiện tại
    const currentDateTime = moment();
  const [orderDetailIdService, setOrderDetailIdService] = useState([]);
  const [orderDetailId, setOrderDetailId] = useState("");
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
  const [dataOrder, setDataOrder] = useState([]);
  const [quantity, setQuantity] = useState("");
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
  const [formattedAddresses, setFormattedAddresses] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const iconColor = { color: colors.blueAccent[500] };

  useEffect(() => {
    if (selectedEditOrder && selectedEditOrder[0].orderId) {
      fetchOrder(selectedEditOrder[0].orderId);
    }
    if (dataOrder && dataOrder.departure) {
      fetchAddress("departure", dataOrder.departure);
    }
    if (dataOrder && dataOrder.destination) {
      fetchAddress("destination", dataOrder.destination);
    }
  }, [selectedEditOrder]);

  const fetchAddress = async (addressType, addressValue) => {
    console.log("latlng" + addressValue);
    if (!addressValue) {
      return; // Trả về nếu order không tồn tại hoặc địa chỉ đã được lưu trữ
    }

    const matches = /lat:\s*([^,]+),\s*long:\s*([^,]+)/.exec(addressValue);
    console.log(matches);
    if (matches && matches.length === 3) {
      const [, lat, lng] = matches;

      if (!isNaN(lat) && !isNaN(lng)) {
        console.log("Latitude:", lat, "Longitude:", lng);
        try {
          const response = await dispatch(getFormattedAddressGG({ lat, lng }));
          console.log(response);
          const formattedAddress =
            response.payload.results[0].formatted_address;
          console.log(formattedAddress);
          setFormattedAddresses((prevAddresses) => ({
            ...prevAddresses,
            [addressType]: formattedAddress,
          }));
        } catch (error) {
          console.error(
            "Error fetching address:",
            error.response ? error.response : error
          );
        } finally {
          setLoading(false); // Đảm bảo loading được đặt lại thành false dù có lỗi
        }
      }
    }
  };
  //Hiển thị 1 dịch vụ đầu tiên

  const fetchOrder = (orderId) => {
    console.log(orderId);
    // Make sure you have a check to prevent unnecessary API calls
    if (orderId) {
      dispatch(getOrderId({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          if (data) {
            setDataOrder(data);
          } else {
            console.error(
              "Service data not found in the API response or data is not an array."
            );
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data detail:", error);
        });
    }
  };
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
    const setSelectedOrderDetails = () => {
      if (selectedEditOrder?.id) {
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
    };

    const setOrderQuantitiesForEdit = () => {
      if (selectedEditOrder && selectedEditOrder.length > 0) {
        const newOrderQuantities = {};
        selectedEditOrder.forEach((order) => {
          newOrderQuantities[order.id] =
            order.quantity !== null ? order.quantity.toString() : "";
        });
        setOrderQuantities(newOrderQuantities);
      }
    };

    setSelectedOrderDetails();
    setOrderQuantitiesForEdit();
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

  const [totalForOrder, setTotalForOrder] = useState({});

  const updateTotalForOrder = (orderId, newTotal) => {
    setTotalForOrder((prevTotals) => ({
      ...prevTotals,
      [orderId]: newTotal,
    }));
  };
  const handleInputChange = (event, orderId) => {
    const newQuantity = event.target.value;

    // Cập nhật số lượng và lưu trữ
    setOrderQuantities((prevOrderQuantities) => ({
      ...prevOrderQuantities,
      [orderId]: newQuantity,
    }));

    setIsEditing(true);
    setOrderDetailIdService((prevOrderDetailIdService) => {
      const updatedIds = [...prevOrderDetailIdService];
      const index = updatedIds.findIndex((id) => id === orderId);
      if (index === -1) {
        updatedIds.push(orderId); // Thêm mới nếu orderId chưa tồn tại
      }
      return updatedIds;
    });

    console.log(
      `Quantity người dùng đã nhập cho orderId ${orderId}:`,
      newQuantity
    );
  };

  useEffect(() => {
    if (!isEditing) {
      setEdit((prevEdit) => ({
        ...prevEdit,
        quantity: order.quantity !== null ? order.quantity.toString() : "",
      }));
    }
    if (!isEditing) {
      setEdit((prevEdit) => ({
        ...prevEdit,
        quantity: order.quantity !== null ? order.quantity.toString() : "",
      }));
    }
    // handleUpdateService(isEditing)
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
      dispatch(addServiceForTechnicians(updatedEdit))
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
    if (!selectedEditOrder || !edit) {
      toast.error("Không có thêm nhật dịch vụ");
      return;
    }

    const updatedEdits = orderDetailIdService
      .map((orderDetailId) => {
        const updatedOrder = selectedEditOrder.find(
          (order) => order.id === orderDetailId
        );

        if (!updatedOrder) {
          return null; // Trường hợp không tìm thấy orderDetailId trong selectedEditOrder
        }

        const updatedQuantity =
          orderQuantities[updatedOrder.id] !== undefined
            ? orderQuantities[updatedOrder.id]
            : updatedOrder.quantity;
        const { serviceId } = updatedOrder;
        const selectedServiceName = nameService[serviceId]; // Lấy tên dịch vụ từ serviceId

        const updatedEdit = {
          orderDetailId: orderDetailId,
          service: selectedServiceName,
          quantity: updatedQuantity,
        };

        return updatedEdit;
      })
      .filter((updatedEdit) => updatedEdit !== null); // Lọc bỏ các phần tử null trong mảng

    // Tiến hành dispatch update cho từng updatedEdit trong mảng updatedEdits
    updatedEdits.forEach((updatedEdit) => {
      const hasChanges =
        JSON.stringify(updatedEdit) !== JSON.stringify(initialFormState);
      console.log(hasChanges);

      if (hasChanges) {
        dispatch(updateServiceForTechnicians(updatedEdit))
          .then(() => {
            toast.success("Cập nhật dịch vụ thành công");
            setIsSuccess(true);
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
              const serviceErrors = error.response.data.errors.Service;
              if (serviceErrors && serviceErrors.length > 0) {
                console.log(serviceErrors);
              }
            } else if (error.message) {
              toast.error(`Lỗi khi thêm dịch vụ: ${error.message}`);
            } else {
              toast.error("Lỗi khi thêm dịch vụ.");
            }
          });
      } else {
        toast.info("Không có thay đổi để lưu.");
        handleClose();
      }
    });
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



  
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "Đang cập nhật";
    return moment(dateTime).tz("Asia/Ho_Chi_Minh").add(7,'hours').format('DD/MM/YYYY HH:mm:ss');
    // Set the time zone to Vietnam's ICT
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
                id="RescuseVehicleOwner-detail-modal"
                align="center"
              >
                {selectedEditOrder
                  ? "Cập nhật dịch vụ"
                  : "RescuseVehicleOwner Detail"}
              </Typography>

              {selectedEditOrder && (
                <Card>
                  <CardContent>
                    <CardContent>
                      <Typography variant="h5" sx={{ marginBottom: 2 }}>
                        Thông Tin đơn hàng
                      </Typography>

                      <Typography
                        variant="body1"
                        component="p"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                          fontSize: "1rem",
                          marginRight: "2px",
                        }}
                      >
                        <PlaceIcon style={iconColor} />{" "}
                        <strong>Địa chỉ xe hư:</strong>
                        <Typography
                          variant="h6"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "10px",
                          }}
                        >
                          {formattedAddresses.departure||"Đang cập nhật"}
                        </Typography>
                      </Typography>
                  
                      <Typography
                        variant="body1"
                        component="p"
                        sx={{
                          marginBottom: "8px",
                          fontSize: "1rem",
                        }}
                      >
                        <LocationOnIcon style={iconColor} />
                        <strong>Địa chỉ xe hư: </strong>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            padding: "8px",
                            borderRadius: "4px",
                            marginLeft: "4px",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                            flex: 1,
                          }}
                        >
                          {}
                          {formattedAddresses.destination||"Đang cập nhật"}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body1"
                        component="p"
                        sx={{
                          marginBottom: "8px",
                          fontSize: "1rem",
                        }}
                      >
                        <TimerIcon style={iconColor} />
                        <strong>Thời gian bắt đầu: </strong>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            padding: "8px",
                            borderRadius: "4px",
                            marginLeft: "4px",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                            flex: 1,
                          }}
                        >
                           {formatDateTime(dataOrder.startTime || "Đang cập nhật")}
                        </Typography>
                      </Typography>
                
                      <Typography
                        variant="body1"
                        component="p"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                          fontSize: "1rem",
                          marginRight: "2px",
                        }}
                      >
                        <AssignmentIcon style={iconColor} />{" "}
                        <strong>Ghi chú kỹ thuật viên:</strong>
                        <Typography
                          variant="h6"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "10px",
                          }}
                        >
                          {" "}
                          {dataOrder.staffNote || "Không có thông tin"}
                        </Typography>
                      </Typography>
                    </CardContent>
                    {/* 
                    <CardContent>
                      <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        orderDetailId: {dataOrder.id}
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
                    </CardContent> */}
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
                          value={order.id}
                          // onChange={(event) => {
                          //   const updatedOrderId = event.target.value;
                          //   // Cập nhật giá trị orderId vào orderDetailIdService
                          //   setOrderDetailIdSerivce(updatedOrderId);
                          // }}
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
                            type="number"
                            value={
                              orderQuantities[order.id] !== undefined
                                ? orderQuantities[order.id]
                                : ""
                            }
                            onChange={(event) =>
                              handleInputChange(event, order.id)
                            }
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
                                  <AccountBalanceWalletIcon style={iconColor}  />
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
