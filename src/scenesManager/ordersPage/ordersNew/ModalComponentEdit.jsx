import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  useTheme,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Autocomplete,
  Avatar,
  Grid,
  Tooltip,
} from "@mui/material";
import { CategoryRounded, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../../../theme";
import { toast } from "react-toastify";
import {
  createAcceptOrder,
  fetchOrdersNew,
  getOrderDetailId,
  getPaymentId,
  sendNotification,
} from "../../../redux/orderSlice";
import { fetchVehicle } from "../../../redux/vehicleSlice";
import { fetchTechnicians } from "../../../redux/technicianSlice";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import CategoryIcon from "@mui/icons-material/Category";
import PlaceIcon from "@mui/icons-material/Place";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import { getCustomerId } from "../../../redux/customerSlice";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import MarkChatUnreadRoundedIcon from "@mui/icons-material/MarkChatUnreadRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import SourceRoundedIcon from "@mui/icons-material/SourceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { getServiceId } from "../../../redux/serviceSlice";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditOrder,
  formattedAddress,
  onDataUpdated,
}) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [edit, setEdit] = useState({});
  const [data, setData] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [serverError, setServerError] = useState(null);
  const [selectedVehicle, setSelectedVehicel] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [vehicleData, setVehicleData] = useState([]);
  const [serviceNames, setServiceNames] = useState({});
  const [firstServiceName, setFirstServiceName] = useState([]);
  // const [technicianId, setTechnicianId] = useState(null);
  const [loadingTechnician, setLoadingTechnician] = useState(true);
  const [technicianData, setTechnicianData] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [selectedRescueType, setSelectedRescueType] = useState([
    "Fixing",
    "Towing",
  ]);
  const [selectedRescueTypeTowing, setSelectedRescueTypeTowing] =
    useState("Towing");
  const [filteredTechnicianData, setFilteredTechnicianData] = useState([]);
  const [filteredVehicleData, setFilteredVehicleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formattedAddresses, setFormattedAddresses] = useState({});
  const [selectedOrderFormattedAddress, setSelectedOrderFormattedAddress] =
    useState("");
  const [customerId, setCustomerId] = useState({});
  const [paymentId, setPaymentId] = useState({});
  const [dataCustomer, setDataCustomer] = useState({});
  const [dataOrder, setDataOrder] = useState({});
  const [dataOrderDetail, setDataOrderDetail] = useState({});
  const managerString = localStorage.getItem("manager");
  let manager = null;

  if (managerString) {
    try {
      manager = JSON.parse(managerString); // Thử phân tích chuỗi JSON
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }

  // 1. Tạo hàm xử lý sự kiện cho TextField để cập nhật edit.id
  const handleEditIdChange = (event) => {
    const { value } = event.target;
    console.log("addres modal" + value);
    setEdit((prevOrder) => ({
      ...prevOrder,
      id: value,
    }));
  };
  useEffect(() => {
    if (formattedAddress) {
      console.log("addres modal" + formattedAddress);
      setEdit((prevEdit) => ({
        ...prevEdit,
        formattedAddress: formattedAddress,
      }));
    }
  }, [formattedAddress]);

  useEffect(() => {
    // Filter and set the list of technicians or rescue vehicles based on the selected rescueType
    if (selectedRescueType === "Fixing") {
      if (technicianData !== null) {
        setFilteredTechnicianData(
          technicianData.filter((tech) => tech.status === "ACTIVE")
        );
      }
      resetTowingState();
    } else if (selectedRescueType === "Towing") {
      if (vehicleData !== null) {
        setFilteredVehicleData(
          vehicleData.filter((vehicle) => vehicle.status === "ACTIVE")
        );
      }
      // resetFixingState();
    }
  }, [selectedRescueType, technicianData, vehicleData]);
  // useEffect(() => {
  //   if (selectedTechnician) {
  //     console.log("test tec" + selectedTechnician);
  //     const selectedTechnicianId = selectedTechnician.id;
  //     // Filter the active technicians based on the selected technician's ID
  //     const filteredTechnicianDetails = technicianData.find(
  //       (technician) => technician.id === selectedTechnicianId
  //     );
  //     setTechnicianDetails(filteredTechnicianDetails);
  //     console.log("detail" + technicianDetails);
  //   } else {
  //     setTechnicianDetails(null);
  //   }
  // }, [selectedTechnician, technicianData]);

  //Cái nay chính
  useEffect(() => {
    if (selectedVehicle) {
      const selectedVehicleId = selectedVehicle.id;
      // Lọc danh sách các phương tiện dựa trên ID của phương tiện được chọn
      const filteredVehicleDetails = vehicleData.find(
        (vehicle) => vehicle.id === selectedVehicleId
      );
      setVehicleDetails(filteredVehicleDetails);
      console.log("detail" + vehicleDetails);
    } else {
      setVehicleDetails(null);
    }
  }, [selectedVehicle, vehicleData]);
  // useEffect(() => {
  //   if (selectedVehicle && vehicleData) {
  //     const selectedVehicleId = selectedVehicle.id;

  //     // Check if vehicleData needs updating
  //     const needsVehicleDataUpdate = vehicleData.some(item => item.id === selectedVehicleId);
  //     if (needsVehicleDataUpdate) {
  //       const updatedVehicleData = vehicleData.filter(item => item.id !== selectedVehicleId);
  //       setVehicleData(updatedVehicleData);
  //     }

  //     // Update vehicleDetails only if it's different
  //     const newVehicleDetails = vehicleData.find(vehicle => vehicle.id === selectedVehicleId);
  //     if (vehicleDetails !== newVehicleDetails) {
  //       setVehicleDetails(newVehicleDetails);
  //     }
  //   } else if (!selectedVehicle && vehicleDetails !== null) {
  //     setVehicleDetails(null);
  //   }
  // }, [selectedVehicle, vehicleData]); // Ensure dependencies are correct
  // Xóa selectedVehicleId khỏi danh sách phụ thuộc

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleResponse = await dispatch(fetchVehicle());
        const vehicleData = vehicleResponse.payload.data;
        console.log("Dữ liệu xe cứu hộ:", vehicleData);
        if (vehicleData) {
          const activeManufacturers = vehicleData.filter(
            (item) => item.status === "ACTIVE"
          );

          setVehicleData(activeManufacturers);

          // Xác định selectedVehicle ban đầu
        } else {
          setVehicleData([]);
          console.error("Vehicle response does not contain 'data'.");
        }
      } catch (error) {
        console.error("Error while fetching vehicle data:", error);
      } finally {
        setLoadingVehicle(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const technicianResponse = await dispatch(fetchTechnicians());
        const technicianData = technicianResponse.payload.data;
        console.log("dữ liệu tech " + technicianData);
        if (technicianData) {
          const activeTechnicians = technicianData.filter(
            (item) => item.status === "ACTIVE"
          );

          setTechnicianData(activeTechnicians);

          if (activeTechnicians.length > 0) {
            console.log("Active Technicians FullNAME:");
            activeTechnicians.forEach((technician) => {
              console.log("Avatar:", technician.avatar);
              // You can also access other properties here if needed.
            });
          } else {
            console.log("No active technicians found.");
          }
        } else {
          console.error("Technician response does not contain 'data'.");
        }
      } catch (error) {
        console.error("Error while fetching technician data:", error);
      } finally {
        setLoadingTechnician(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedEditOrder && Array.isArray(orders) && selectedEditOrder.id) {
      const OrderToEdit = orders.find(
        (order) => order.id === selectedEditOrder.id
      );
      if (OrderToEdit) {
        setFullnameValue(OrderToEdit.fullname);
        setEdit(OrderToEdit);
        setInitialFormState(OrderToEdit);
        setSelectedOrderFormattedAddress(OrderToEdit.formattedAddress);
      }
    }

    if (edit.id && edit.id !== paymentId) {
      console.log(edit.id);
      setPaymentId(edit.id);
      fetchOrder(edit.id);
      fetchOrderDetail(edit.id);
    }
  }, [selectedEditOrder, orders, edit.id, paymentId]);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders); // Update the local state when the Redux state changes
    }
  }, [orders]);
  const handleSaveClick = () => {
    if (!selectedEditOrder || !data) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }
    const orderId = edit.id;
    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges =
      JSON.stringify(data) !== JSON.stringify(initialFormState);
    const message = {
      title: "Thông báo",
      body: "Điều phối thành công",
    };
    // Gửi thông báo sau khi xử lý thành công

    // Thay YOUR_FCM_SERVER_KEY bằng API key của bạn
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ, bao gồm vehicleId và orderId
      const requestData = {
        orderID: orderId,
        vehicleID: vehicleId,
        managerID: manager.id,
      };
      dispatch(createAcceptOrder(requestData))
        .then(() => {
          if (selectedVehicle && vehicleData) {
            // Loại bỏ phương tiện đã chọn từ danh sách vehicleData
            const updatedVehicleData = vehicleData.filter(
              (item) => item.id !== selectedVehicle.id
            );
            setVehicleData(updatedVehicleData);
          }
          toast.success("Gửi điều phối thành công.");
          // Reset vehicleDetails here
          setVehicleDetails(null);
          setSelectedVehicel(null);

          const notificationData = {
            // deviceId: "eZ3zGYZ-SU-rsFAjjsDLrS:APA91bH45eTlMbPI8GfqxllTtB4tzSgpB-9ppDGfJ4xv3FuxpbRqAj2RHcgZn-pj0JG9CGxGmi69HHTRkzNlSbOy5xuryR43BFIMtn9_l68ZfJRzfr8C55Yk2vP19Y5jjSiRHgKLMTTk", // Thay YOUR_DEVICE_ID bằng ID thiết bị cần gửi thông báo đến
            deviceId:
              "fb7Ts8adTSeqW2D4jsgsEe:APA91bHS0xEkeHkeK58sL9a33CLxgm00KFIY6cHJokVA8R1JO_rrinjDDbvCSLsKo01M6IvJ88q5lOWJCpf0zAU1i75lGqVaSQDa4HBFGd7Du7XnJDgCsZZUJ-4WmH0yb5AsheUp9fzm", // Thay YOUR_DEVICE_ID bằng ID thiết bị cần gửi thông báo đến
            isAndroiodDevice: true, // true nếu là thiết bị Android, false nếu là thiết bị khác
            title: message.title,
            body: message.body,
          };

          // Gửi thông báo bằng hàm sendNotification
          dispatch(sendNotification(notificationData))
            .then(() => {
              console.log("Gửi thông báo thành công");
            })
            .catch((error) => {
              console.error("Lỗi khi gửi thông báo:", error);
            });
          handleClose();
          setIsSuccess(true);
          if (onDataUpdated) {
            onDataUpdated(); // Call the callback function after successful update
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(
              `Lỗi khi tạo điều phối: ${error.response.data.message}`
            );
          } else if (error.message) {
            toast.error(`Lỗi khi tạo điều phối: ${error.message}`);
          } else {
            toast.error("Lỗi khi tạo điều phối.");
          }
        });
    }
  };
  const handleClose = () => {
    setOpenEditModal(false);
    if (isSuccess) {
      console.log("success" + isSuccess);
      dispatch(fetchOrdersNew())
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data) {
            setLoading(false);
            setTechnicianData(null);
            setVehicleData(null);
            setFilteredTechnicianData(null);
            setSelectedVehicel(null);
            setVehicleDetails(null);
            setFilteredOrders(data);
            // Đặt loading thành false sau khi tải lại dữ liệu
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải lại danh sách đơn hàng:", error);
        });
    }
  };

  // Function to reset Towing state variables
  const resetTowingState = () => {
    setSelectedVehicel(null);
    setVehicleId(null);
    setVehicleData(null);
  };

  // When rescue type is changed, reset the state accordingly
  //get Full NameCustomer

  useEffect(() => {
    if (edit.customerId && edit.customerId !== customerId) {
      console.log(edit.customerId);
      setCustomerId(edit.customerId);
      fetchCustomerName(edit.customerId);
    }
  }, [edit.customerId, customerId]);

  const fetchCustomerName = (customerId) => {
    console.log(customerId);
    // Make sure you have a check to prevent unnecessary API calls
    if (customerId) {
      dispatch(getCustomerId({ id: customerId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data) {
            setDataCustomer((prevData) => ({
              ...prevData,
              [customerId]: data,
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

  const fetchOrder = (orderId) => {
    console.log(orderId);
    // Make sure you have a check to prevent unnecessary API calls
    if (orderId) {
      dispatch(getPaymentId({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data) {
            setDataOrder((prevData) => ({
              ...prevData,
              [orderId]: data,
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

  //Hiển thị 1 dịch vụ đầu tiên
  // Thay đổi hàm fetchOrderDetail
  const fetchOrderDetail = (orderId) => {
    console.log(orderId);
    // Make sure you have a check to prevent unnecessary API calls
    if (orderId) {
      dispatch(getOrderDetailId({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data && Array.isArray(data)) {
            const serviceIds = data.map((item) => item.serviceId);
            console.log(serviceIds);

            // Tạo mảng promises để gọi API lấy thông tin từng serviceId
            const servicePromises = serviceIds.map((serviceId) => {
              return dispatch(getServiceId({ id: serviceId }))
                .then((serviceResponse) => {
                  const serviceName = serviceResponse.payload.data.name;
                  console.log(
                    `ServiceId: ${serviceId}, ServiceName: ${serviceName}`
                  );
                  return {
                    serviceId,
                    serviceName,
                  };
                })
                .catch((serviceError) => {
                  console.error(
                    `Error while fetching service data for serviceId ${serviceId}:`,
                    serviceError
                  );
                  return null;
                });
            });

            // Sử dụng Promise.all để chờ tất cả các promises hoàn thành
            Promise.all(servicePromises)
              .then((serviceData) => {
                // Truy cập serviceName đầu tiên trong danh sách dịch vụ
                const firstServiceName =
                  serviceData[0]?.serviceName || "Không có thông tin";

                // Cập nhật chỉ serviceName đầu tiên vào state
                setFirstServiceName(firstServiceName);
              })
              .catch((error) => {
                console.error(
                  "Error while processing service data promises:",
                  error
                );
              });
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


  // Hàm fetch chung
  // const fetchData = (dispatch, getIdAction, setDataFunction) => (orderId) => {
  //   console.log(orderId);
  //   if (orderId) {
  //     dispatch(getIdAction({ id: orderId }))
  //       .then((response) => {
  //         const data = response.payload.data;
  //         console.log(data);
  //         if (data) {
  //           setDataFunction((prevData) => ({
  //             ...prevData,
  //             [orderId]: data,
  //           }));
  //         } else {
  //           console.error("Service name not found in the API response.");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error while fetching service data:", error);
  //       });
  //   }
  // };

  // // Sử dụng hàm fetchData để fetch dữ liệu order và order detail
  // const fetchOrder = fetchData(dispatch, getPaymentId, setDataOrder);
  // const fetchOrderDetail = fetchData(
  //   dispatch,
  //   getOrderDetailId,
  //   setDataOrderDetail
  // );
  // Thay someOrderId bằng dependency của useEffect của bạn, để đảm bảo useEffect chạy khi dependency thay đổi

  const date = new Date(edit.createdAt);
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

  return (
    <>
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
                width: "100%",
                maxWidth: "1000px", // You can adjust the maximum width
                maxHeight: "100%", // Set a fixed maximum height
                overflowY: "auto", // Add overflow to enable scrolling if content overflows
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
                variant="h2"
                component="h4"
                id="Order-detail-modal"
                sx={{
                  marginBottom: "16px",
                  textAlign: "center", // Căn giữa nội dung theo chiều ngang
                  width: "100%", // Đảm bảo chiều rộng phù hợp với container
                  margin: "auto", // Căn giữa theo chiều dọc nếu cần
                }}
              >
                {selectedEditOrder
                  ? "Thông tin điều phối nhân sự"
                  : "Order Detail"}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  {selectedEditOrder && (
                    <>
                      <Card sx={{ height: "400px" }}>
                        <CardContent>
                          <Typography variant="h4" sx={{ marginBottom: 2 }}>
                            Chi Tiết Đơn Hàng
                          </Typography>
                          <TextField
                            name="id"
                            label="id"
                            value={edit.id || ""}
                            onChange={handleEditIdChange}
                            style={{ display: "none" }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                mr: 2,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                variant="outlined"
                                label="Tên dịch vụ"
                                value={edit.customerId || ""}
                                fullWidth
                                margin="normal"
                                style={{
                                  marginRight: "10px",
                                  flex: "1",
                                  display: "none",
                                  fontSize: "1rem",
                                  marginRight: "2px",
                                }}
                                InputProps={{
                                  readOnly: true, // If you don't want it to be editable, make it read-only
                                }}
                              />
                              <PersonRoundedIcon />
                              <strong>Khách Hàng: </strong>{" "}
                              <Typography
                                variant="body1"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: "10px",
                                }}
                              >
                                {dataCustomer[edit.customerId]?.fullname ||
                                  "Đang tải..."}
                              </Typography>
                              <Avatar
                                alt="Avatar"
                                src={
                                  dataCustomer[edit.customerId]?.avatar ||
                                  "URL mặc định của avatar"
                                }
                                sx={{
                                  width: 44,
                                  height: 44,
                                  marginLeft: 1.75,
                                }}
                              />
                            </Box>
                          </Box>
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center", // Căn chỉnh theo chiều dọc
                              marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                              fontSize: "1rem",
                              marginRight: "2px",
                            }}
                          >
                            <CategoryIcon /> <strong>Loại cứu hộ: </strong>{" "}
                            <Box
                              width="30%"
                              ml="4px"
                              p="2px"
                              display="flex"
                              justifyContent="center"
                              fontSize={10}
                              borderRadius={8}
                              backgroundColor={
                                edit.rescueType === "Fixing"
                                  ? colors.yellowAccent[400]
                                  : colors.grey[800]
                                  ? colors.redAccent[600]
                                  : edit.rescueType === "Towing"
                              }
                            >
                              {edit.rescueType === "Towing" && <SupportIcon />}
                              {edit.rescueType === "Fixing" && <HandymanIcon />}
                              <Typography color="black">
                                {edit.rescueType}
                              </Typography>
                            </Box>
                          </Typography>
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                              fontSize: "1rem",
                            }}
                          >
                            <WatchLaterRoundedIcon />{" "}
                            <strong>Ngày tạo: </strong>
                            <Typography
                              variant="h5"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            >
                              {formattedDate}
                            </Typography>
                          </Typography>

                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px",
                              fontSize: "1rem",
                              marginRight: "2px",
                            }}
                          >
                            <PlaceIcon />
                            <strong>Địa điểm xe hư: </strong>{" "}
                            <Typography
                              variant="h5"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            >
                              {edit.formattedAddress}
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
                            <PlaceIcon /> <strong>Địa điểm muốn đến: </strong>{" "}
                            <Tooltip title={edit.destination}>
                              <Typography
                                variant="h5"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: "10px",
                                }}
                              >
                                {edit.destination}
                              </Typography>
                            </Tooltip>
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
                            <MapRoundedIcon /> <strong>Khu vực: </strong>{" "}
                            <Typography
                              variant="h5"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            >
                              {" "}
                              {edit.area}
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
                            <MarkChatUnreadRoundedIcon />{" "}
                            <strong>Ghi chú: </strong>
                            <Typography
                              variant="h5"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            >
                              {" "}
                              {edit.customerNote}
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
                            <PaymentIcon /> <strong>Thanh toán:</strong>{" "}
                            <Typography
                              variant="h5"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            >
                              {dataOrder[edit.id]?.method || "Đang tải..."}
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
                            <AddShoppingCartIcon /> <strong>Dịch vụ đã chọn:</strong>{" "}
                            <Typography
                              variant="h5"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            >
                             {firstServiceName}
                            </Typography>
                          </Typography>


                        
                   
                        </CardContent>
                      </Card>
                    </>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ height: "400px" }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ marginBottom: 1 }}>
                        Điều phối nhân sự
                      </Typography>
                      {useEffect(() => {
                        // Reset các giá trị khi thay đổi loại cứu hộ
                        setSelectedVehicel(null);
                        setVehicleDetails(null);
                        // setSelectedTechnician(null);
                        setTechnicianDetails(null);
                      }, [edit.rescueType])}

                      {edit.rescueType === "Fixing" && (
                        <div>
                          <Autocomplete
                            id="technicians-select"
                            options={technicianData}
                            getOptionLabel={(option) =>
                              option && option.fullname
                            }
                            value={selectedTechnician}
                            onChange={(_, newValue) => {
                              setSelectedTechnician(newValue);
                              // setTechnicianId(newValue && newValue.id);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Danh Sách Kỹ Thuật Viên Đang Hoạt Động"
                                variant="filled"
                                margin="normal"
                              />
                            )}
                            renderOption={(props, option) => (
                              <li {...props}>
                                <Avatar
                                  src={option.avatar}
                                  alt={option.fullname}
                                  sx={{ marginRight: "10px" }}
                                />
                                {option.fullname}
                              </li>
                            )}
                          />

                          {technicianDetails && (
                            <div>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 2,
                                }}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <h3>Thông tin kỹ thuật viên đã chọn</h3>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column", // Đặt các Box theo chiều dọc
                                      gap: 2, // Khoảng cách giữa các Box
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1, // Khoảng cách giữa icon và văn bản
                                      }}
                                    >
                                      <PersonRoundedIcon />
                                      <Typography variant="body1">
                                        Tên: {technicianDetails.fullname}
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1, // Khoảng cách giữa icon và văn bản
                                      }}
                                    >
                                      <PlaceIcon />
                                      <Typography variant="body1">
                                        Địa chỉ: {technicianDetails.address}
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1, // Khoảng cách giữa icon và văn bản
                                      }}
                                    >
                                      <PhoneRoundedIcon />
                                      <Typography variant="body1">
                                        Số điện thoại: {technicianDetails.phone}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      marginTop: "10px",
                                    }}
                                  >
                                    <CheckCircleRoundedIcon />
                                    <Typography variant="body1">
                                      Trạng thái:
                                    </Typography>
                                    <Box
                                      width="30%"
                                      ml="4px"
                                      display="flex"
                                      justifyContent="center"
                                      fontSize={10}
                                      borderRadius={8}
                                      backgroundColor={
                                        technicianDetails.status === "ACTIVE"
                                          ? "green"
                                          : technicianDetails.status ===
                                            "INACTIVE"
                                          ? "red"
                                          : "grey"
                                      }
                                    >
                                      <Typography color="white">
                                        {technicianDetails.status}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                <Box sx={{ flex: 1, marginTop: "10px" }}>
                                  {technicianDetails.avatar ? (
                                    <img
                                      src={technicianDetails.avatar}
                                      alt="Hình Ảnh Nhân viên"
                                      style={{
                                        width: "80%",
                                        height: "auto",
                                        border: "2px solid #000",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                                      alt="Hình Ảnh Mặc Định"
                                      style={{
                                        width: "80%",
                                        height: "auto",
                                        border: "2px solid #000",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </div>
                          )}
                        </div>
                      )}

                      {edit.rescueType === "Towing" && (
                        <div>
                          <Autocomplete
                            id="vehicle-select"
                            options={vehicleData}
                            getOptionLabel={(option) =>
                              option && option.manufacturer
                            }
                            value={selectedVehicle}
                            onChange={(_, newValue) => {
                              setSelectedVehicel(newValue);
                              setVehicleId(newValue && newValue.id);
                              // Cập nhật vehicleDetails dựa trên newValue
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Danh Sách Xe Cứu Hộ Đang Hoạt Động"
                                variant="filled"
                                margin="normal"
                              />
                            )}
                          />

                          {vehicleDetails && (
                            <div>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 2,
                                }}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <h3>Thông tin xe đã chọn</h3>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      marginBottom: 2, // Thêm khoảng cách dưới cùng cho mỗi Box
                                    }}
                                  >
                                    <SourceRoundedIcon />
                                    <Typography variant="body1">
                                      Mã xe: {vehicleDetails.vinNumber}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      marginBottom: 2, // Thêm khoảng cách dưới cùng cho mỗi Box
                                    }}
                                  >
                                    <ReceiptRoundedIcon />
                                    <Typography variant="body1">
                                      Biển số xe: {vehicleDetails.licensePlate}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      marginBottom: 2, // Thêm khoảng cách dưới cùng cho mỗi Box
                                    }}
                                  >
                                    <CategoryRounded />
                                    <Typography variant="body1">
                                      Loại xe: {vehicleDetails.type}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      marginBottom: 2, // Thêm khoảng cách dưới cùng cho mỗi Box
                                    }}
                                  >
                                    <TimeToLeaveIcon />
                                    <Typography variant="body1">
                                      Hiệu xe: {vehicleDetails.manufacturer}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      marginBottom: 2, // Thêm khoảng cách dưới cùng cho mỗi Box
                                    }}
                                  >
                                    <CalendarTodayIcon />
                                    <Typography variant="body1">
                                      Đời xe: {vehicleDetails.manufacturingYear}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ flex: 1, marginTop: "10px" }}>
                                  {vehicleDetails.image ? (
                                    <img
                                      src={vehicleDetails.image}
                                      alt="Hình Ảnh Của Xe"
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                        border: "2px solid #000",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                                      alt="Hình Ảnh Mặc Định"
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                        border: "2px solid #000",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                <Button onClick={handleSaveClick} variant="contained">
                  Đồng Ý Điều Phối
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {serverError && <Typography color="error">{serverError}</Typography>}
    </>
  );
};

export default ModalEdit;
