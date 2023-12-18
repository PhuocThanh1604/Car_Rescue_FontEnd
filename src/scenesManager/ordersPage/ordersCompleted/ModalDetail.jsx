import React, { useCallback, useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Rating,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/Place";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import CommentIcon from "@mui/icons-material/Comment";
import { useDispatch } from "react-redux";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import { CategoryRounded } from "@mui/icons-material";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TimerIcon from "@mui/icons-material/Timer";
import CakeIcon from "@mui/icons-material/Cake";
import PinDropIcon from "@mui/icons-material/PinDrop";
import { useTheme } from "@emotion/react";
import { toast } from "react-toastify";
import {
  getFeedbackOfOrderId,
  getFormattedAddressGG,
  getImageOfOrder,
  getOrderDetailId,
  getPaymentId,
} from "../../../redux/orderSlice";
import { getRescueVehicleOwnerId } from "../../../redux/rescueVehicleOwnerSlice";
import { getCustomerId } from "../../../redux/customerSlice";
import { getTechnicianId } from "../../../redux/technicianSlice";
import { getVehicleId } from "../../../redux/vehicleSlice";
import { getServiceId } from "../../../redux/serviceSlice";
import { tokens } from "../../../theme";
import areaData from "../../../data.json";
import InfoIcon from "@mui/icons-material/Info";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import moment from "moment";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const MyModal = (props) => {
  const dispatch = useDispatch();
  const { openModal, setOpenModal, selectedEditOrder } = props;
  const [collapse, setCollapse] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    customer: {},
    technician: {},
    vehicle: {},
  });
  const [dataPayment, setDataPayment] = useState([]);
  const [dataRescueVehicleOwner, setDataRescueVehicleOwner] = useState({});
  const [dataFeedBack, setDataFeedBack] = useState({});
  const [rescueVehicleOwnerId, setRescueVehicleOwnerId] = useState({});
  const [rating, setRating] = useState(0); // Initialize with a default rating, e.g., 0
  const [loading, setLoading] = useState(false);
  const [formattedAddresses, setFormattedAddresses] = useState({});
  const [firstServiceName, setFirstServiceName] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [dataImage, setDataImage] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const iconColor = { color: colors.blueAccent[500] };

  const [activeStep, setActiveStep] = React.useState(0);
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const [dataJson, setDataJson] = useState([]);
  const imageWidth = "300px";
  const imageHeight = "300px";
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu");
    }
    setDataJson(areaData);
  }, [dataJson]);
  // Assume you have a function to convert currency to VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    setLoading(true);
    if (selectedEditOrder && selectedEditOrder.departure) {
      fetchAddress("departure", selectedEditOrder.departure);
    }
    if (selectedEditOrder && selectedEditOrder.rescueType === "Fixing") {
      // Đặt lại địa chỉ điểm đến nếu rescueType là Fixing
      resetDestinationAddress();
    } else if (selectedEditOrder && selectedEditOrder.destination) {
      // Nếu không phải Fixing, thực hiện fetchAddress cho destination
      fetchAddress("destination", selectedEditOrder.destination);
    }
    if (selectedEditOrder && selectedEditOrder.id) {
      fetchOrderDetail(selectedEditOrder.id);
    }
    if (selectedEditOrder && selectedEditOrder.id) {
      fetchFeedBackOfOrder(selectedEditOrder.id);
      fetchOrder(selectedEditOrder.id);
      fetchImageOfOrder(selectedEditOrder.id);
    }
  }, [selectedEditOrder]);

  const resetDestinationAddress = () => {
    setFormattedAddresses((prevAddresses) => ({
      ...prevAddresses,
      destination: null, // Reset destination address to null or default value based on requirements
    }));
  };

  const fetchAddress = async (addressType, addressValue) => {
    if (!addressValue) {
      return; // Trả về nếu order không tồn tại hoặc địa chỉ đã được lưu trữ
    }

    const matches = /lat:\s*([^,]+),\s*long:\s*([^,]+)/.exec(addressValue);
    if (matches && matches.length === 3) {
      const [, lat, lng] = matches;

      if (!isNaN(lat) && !isNaN(lng)) {
        try {
          const response = await dispatch(getFormattedAddressGG({ lat, lng }));
          console.log(response.payload);
          // const formattedAddress = response.payload.display_name;//osm
          const formattedAddress = response.payload.formatted_address; // gong
          setFormattedAddresses((prevAddresses) => ({
            ...prevAddresses,
            [addressType]: formattedAddress,
          }));
        } catch (error) {
          setLoading(false);
          toast.error(
            "Không tìm thấy địa chỉ:",
            error.response ? error.response : error
          );
        } finally {
          setLoading(false); // Đảm bảo loading được đặt lại thành false dù có lỗi
        }
      }
    }
  };

  const fetchOrderDetail = (orderId) => {
    setServiceNames(null);
    if (orderId) {
      dispatch(getOrderDetailId({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          if (data && Array.isArray(data)) {
            const serviceDetails = data.map((item) => ({
              serviceId: item.serviceId,
              quantity: item.quantity,
              type: null,
            }));

            const servicePromises = serviceDetails.map(
              ({ serviceId, quantity }) => {
                return dispatch(getServiceId({ id: serviceId }))
                  .then((serviceResponse) => {
                    const serviceName = serviceResponse.payload.data.name;
                    const serviceType = serviceResponse.payload.data.type;
                    let updatedQuantity = quantity;

                    if (serviceType === "Towing") {
                      updatedQuantity += " km";
                    } else if (serviceType === "Fixing") {
                      updatedQuantity = `Số lượng: ${quantity}`;
                    }

                    return { serviceName, updatedQuantity };
                  })
                  .catch((serviceError) => {
                    setLoading(true);
                    toast.error(
                      `Error while fetching service data for serviceId ${serviceId}:`,
                      serviceError
                    );
                    return null;
                  });
              }
            );

            Promise.all(servicePromises)
              .then((serviceData) => {
                setServiceNames((prevServiceNames) => ({
                  ...prevServiceNames,
                  [orderId]: serviceData,
                }));
              })
              .catch((error) => {
                setLoading(false);
                toast.error(
                  "Error while processing service data promises:",
                  error
                );
              });
          } else {
            setLoading(false);
            toast.warning("Không có dịch vụ ");
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Error while fetching order data detail:", error);
        });
    }
  };

  // Lưu giá trị vào một biến
  useEffect(() => {
    if (selectedEditOrder && selectedEditOrder.vehicleId) {
      const vehicleRvoidId = data.vehicle[selectedEditOrder.vehicleId]?.rvoid;

      if (vehicleRvoidId) {
        setRescueVehicleOwnerId(vehicleRvoidId);
        fetchRescueVehicleOwner(vehicleRvoidId);
      }
    }
  }, [selectedEditOrder, data.vehicle]);

  const fetchRescueVehicleOwner = (vehicleRvoidId) => {
    // Make sure you have a check to prevent unnecessary API calls
    if (vehicleRvoidId) {
      dispatch(getRescueVehicleOwnerId({ id: vehicleRvoidId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data) {
            setDataRescueVehicleOwner((prevData) => ({
              ...prevData,
              [vehicleRvoidId]: data,
            }));
          } else {
            toast.error("Data RVO not found in the API response.");
          }
        })
        .catch((error) => {
          toast.error(
            "Error while fetching data of rvo!! please loading ",
            error
          );
        });
    }
  };

  const fetchOrder = (orderId) => {
    if (orderId) {
      dispatch(getPaymentId({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          if (data) {
            setDataPayment(data);
          } else {
            toast.error("Payment not found in the API response.");
          }
        })
        .catch((error) => {
          toast.error(
            "Error while fetching payment data!! Please loading",
            error
          );
        });
    }
  };
  const fetchImageOfOrder = (orderId) => {
    if (orderId) {
      dispatch(getImageOfOrder({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          if (data && Array.isArray(data) && data.length > 0) {
            const urls = data.map((item) => item.url);
            console.log(urls);

            setDataImage(data);
          } else {
            toast.error("Image URLs not found in the API response.");
          }
        })
        .catch((error) => {
          toast.error(
            "Error while fetching image data!! Please try loading again.",
            error
          );
        });
    }
  };

  const fetchFeedBackOfOrder = (orderId) => {
    if (orderId) {
      dispatch(getFeedbackOfOrderId({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;

          if (data) {
            setDataFeedBack(data);
            setDataFeedBack((prevData) => ({
              ...prevData,
              [orderId]: data,
            }));
          } else {
            toast.dismiss("Chưa có feedback từ khách hàng");
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(
            "Error while fetching feedback data:please loading agian",
            error
          );
        });
    }
  };

  useEffect(() => {
    if (selectedEditOrder) {
      fetchDataIfNeeded("customer", selectedEditOrder.customerId);
      fetchDataIfNeeded("technician", selectedEditOrder.technicianId);
      fetchDataIfNeeded("vehicle", selectedEditOrder.vehicleId);
    }
  }, [selectedEditOrder]);

  const fetchDataIfNeeded = useCallback(
    (type, id) => {
      if (id && !data[type][id]) {
        // Chỉ gọi API nếu dữ liệu chưa có trong state
        fetchData(type, id);
      }
    },
    [data]
  );
  const fetchData = (type, id) => {
    let action;
    switch (type) {
      case "customer":
        action = getCustomerId;
        break;
      case "technician":
        action = getTechnicianId;
        break;
      case "vehicle":
        action = getVehicleId;
        break;
    }

    dispatch(action({ id }))
      .then((response) => {
        const newData = response.payload.data;
        if (newData) {
          setData((prevData) => ({
            ...prevData,
            [type]: { ...prevData[type], [id]: newData },
          }));
        } else {
          toast.error(`${type} data not found in the API response.`);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`Error while fetching ${type} data:`, error);
      });
  };
  const handleClick = () => {
    setCollapse(!collapse);
  };

  const vehicleRvoidId =
    selectedEditOrder && selectedEditOrder.vehicleId
      ? data.vehicle[selectedEditOrder.vehicleId]?.rvoid
      : null;
  let formattedDateStart = "Không có thông tin";
  let formattedDateEnd = "Không có thông tin";

  if (
    selectedEditOrder &&
    selectedEditOrder.startTime &&
    selectedEditOrder.endTime
  ) {
    const dateStart = moment(selectedEditOrder.startTime)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .format("DD/MM/YYYY HH:mm"); // Format start date and time

    const dateEnd = moment(selectedEditOrder.endTime)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .format("DD/MM/YYYY HH:mm"); // Format end date and time

    formattedDateStart =
      dateStart !== "Invalid date" ? dateStart : "Không có thông tin";
    formattedDateEnd =
      dateEnd !== "Invalid date" ? dateEnd : "Không có thông tin";
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const StyledGrid1 = styled(Grid)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      paddingTop: "0 !important",
    },
    "& .MuiCardContent-root": {
      padding: theme.spacing(3, 4.75),
      [theme.breakpoints.down("md")]: {
        paddingTop: 0,
      },
    },
  }));
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="book-detail-modal"
      aria-describedby="book-detail-modal-description"
      closeAfterTransition
    >
      <Fade in={openModal}>
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
              onClick={() => setOpenModal(false)}
              aria-label="close"
            >
              <Close />
            </IconButton>

            <Typography
              variant="h4"
              id="book-detail-modal"
              sx={{
                marginBottom: "4px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Chi tiết đơn hàng hoàn thành
            </Typography>

            {selectedEditOrder && (
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid container spacing={1} alignItems="stretch">
                      <Grid item xs={5} alignItems="center">
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>
                          Thông Tin Khách Hàng
                        </Typography>
                        <Box
                          sx={{
                            mr: 2,
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <Avatar
                            alt="Avatar"
                            src={
                              data.customer[selectedEditOrder.customerId]
                                ?.avatar || "URL mặc định của avatar"
                            }
                            sx={{
                              width: 44,
                              height: 44,
                              marginLeft: 1.75,
                            }}
                          />
                        </Box>
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
                          <PersonRoundedIcon style={iconColor} />
                          <strong>Tên:</strong>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {" "}
                            {data.customer[selectedEditOrder.customerId]
                              ?.fullname || "Không có thông tin"}
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
                          <PeopleAltRoundedIcon style={iconColor} />
                          <strong>Giới Tính:</strong>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {" "}
                            {data.customer[selectedEditOrder.customerId]?.sex ||
                              "Không có thông tin"}
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
                          <PhoneRoundedIcon style={iconColor} />{" "}
                          <strong>SĐT:</strong>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {" "}
                            {data.customer[selectedEditOrder.customerId]
                              ?.phone || "Không có thông tin"}
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
                          <PlaceIcon style={iconColor} />{" "}
                          <strong>Địa chỉ:</strong>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {" "}
                            {data.customer[selectedEditOrder.customerId]
                              ?.address || "Không có thông tin"}
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
                          }}
                        >
                          <CakeIcon style={iconColor} />{" "}
                          <strong>Ngày sinh: </strong>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {data.customer[selectedEditOrder.customerId]
                              ?.birthdate
                              ? formatDate(
                                  data.customer[selectedEditOrder.customerId]
                                    .birthdate
                                )
                              : "Không có thông tin"}
                          </Typography>
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Divider
                          orientation="vertical"
                          sx={{ height: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <StyledGrid1>
                          <Typography variant="h5" sx={{ marginBottom: 2 }}>
                            FeedBack của đơn hàng
                          </Typography>
                          <Box
                            sx={{
                              mb: 2.75,
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            <Rating
                              readOnly
                              value={dataFeedBack.rating}
                              name="read-only"
                              sx={{ marginRight: 2 }}
                            />
                            <Typography variant="body2">
                              {dataFeedBack.rating} Star
                            </Typography>
                          </Box>
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
                              {formattedDateStart || "Đang cập nhật"}
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
                            <strong>Thời gian kết thúc: </strong>
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
                              {formattedDateEnd || "Đang cập nhật"}
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
                            <PlaceIcon style={iconColor} />
                            <strong>Địa chỉ bắt đầu: </strong>
                            <Typography
                              variant="h6"
                              component="span"
                              sx={{
                                padding: "8px",
                                marginLeft: "14px",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                flex: 1,
                              }}
                            >
                              {formattedAddresses.departure || "Đang cập nhật"}
                            </Typography>
                          </Typography>

                          {selectedEditOrder.rescueType === "Towing" && (
                            <Typography
                              variant="body1"
                              component="p"
                              sx={{
                                marginBottom: "8px",
                                fontSize: "1rem",
                              }}
                            >
                              <PinDropIcon style={iconColor} />
                              <strong>Địa chỉ kết thúc: </strong>
                              <Typography
                                variant="h6"
                                component="span"
                                sx={{
                                  padding: "8px",
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  whiteSpace: "normal",
                                  flex: 1,
                                }}
                              >
                                {formattedAddresses.destination ||
                                  "Không có thông tin"}
                              </Typography>
                            </Typography>
                          )}

                          {/* List all service */}
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              alignItems: "center",
                              marginBottom: "8px",
                              fontSize: "1rem",
                              marginRight: "2px",
                            }}
                          >
                            <AssignmentIcon style={iconColor} />{" "}
                            <strong>Dịch vụ đã chọn:</strong>{" "}
                            <Typography
                              variant="h6"
                              component="span"
                              sx={{
                                padding: "8px",
                                flex: 1,
                              }}
                            >
                              {serviceNames
                                ? Object.values(serviceNames).map(
                                    (serviceData, index) => {
                                      const allServices = serviceData.map(
                                        (
                                          { serviceName, updatedQuantity },
                                          innerIndex
                                        ) => (
                                          <React.Fragment key={innerIndex}>
                                            {serviceName ||
                                              "Không có thông tin"}{" "}
                                            ({updatedQuantity})
                                            {innerIndex <
                                              serviceData.length - 1 && ", "}
                                          </React.Fragment>
                                        )
                                      );

                                      return (
                                        <React.Fragment key={index}>
                                          {allServices}
                                          {index <
                                            Object.values(serviceNames).length -
                                              1 && <br />}
                                        </React.Fragment>
                                      );
                                    }
                                  )
                                : "Không có thông tin"}
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
                            <PaymentIcon style={iconColor} />{" "}
                            <strong>Phương Thức Thanh toán:</strong>{" "}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "5px",
                                backgroundColor: colors.teal[800],
                                borderRadius: "16px",
                              }}
                            >
                              <Typography
                                variant="h5"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "4px",
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  color: "white",
                                }}
                              >
                                {dataPayment.method === "Cash"
                                  ? "Tiền Mặt"
                                  : dataPayment.method === "Banking"
                                  ? "Chuyển khoản"
                                  : dataPayment.method || "Đang tải..."}
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
                              marginRight: "2px",
                            }}
                          >
                            <CreditScoreIcon style={iconColor} />{" "}
                            <strong>Tổng tiền đã thanh toán:</strong>
                            <Typography
                              variant="h6"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: colors.redAccent[400],
                              }}
                            >
                              {" "}
                              {dataPayment.amount
                                ? formatCurrency(dataPayment.amount)
                                : "Không có thông tin"}
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
                            <CommentIcon style={iconColor} />
                            <strong>Ghi chú: </strong>
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
                              {dataFeedBack.note}
                            </Typography>
                          </Typography>
                        </StyledGrid1>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>

                <CardActions className="card-action-dense">
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button onClick={handleClick}>Details</Button>
                    <IconButton size="small" onClick={handleClick}>
                      {collapse ? (
                        <ExpandLessIcon sx={{ fontSize: "1.875rem" }} />
                      ) : (
                        <ExpandMoreIcon sx={{ fontSize: "1.875rem" }} />
                      )}
                    </IconButton>
                  </Box>
                </CardActions>
                <Collapse in={collapse}>
                  <Divider sx={{ margin: 0 }} />
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Grid container spacing={2} alignItems="stretch">
                        {selectedEditOrder.rescueType === "Fixing" && (
                          <>
                            {" "}
                            <Grid item xs={3} alignItems="center">
                              <Typography
                                variant="h6"
                                sx={{ marginBottom: 2, textAlign: "center" }}
                              >
                                Kỹ Thuật Viên Nhận Đơn
                              </Typography>
                              <Box
                                sx={{
                                  mr: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "10px",
                                }}
                              >
                                <Avatar
                                  alt="Avatar"
                                  src={
                                    data.technician[
                                      selectedEditOrder.technicianId
                                    ]?.avatar || "URL mặc định của avatar"
                                  }
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    marginLeft: 1.75,
                                  }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PeopleAltRoundedIcon style={iconColor} />
                                <Typography variant="h6">
                                  {" "}
                                  Tên:
                                  {data.technician[
                                    selectedEditOrder.technicianId
                                  ]?.fullname || "Không có thông tin"}{" "}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PeopleAltRoundedIcon style={iconColor} />
                                <Typography variant="h6">
                                  Giới Tính:{" "}
                                  {data.technician[
                                    selectedEditOrder.technicianId
                                  ]?.sex || "Không có thông tin"}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PhoneRoundedIcon style={iconColor} />
                                <Typography variant="h6">
                                  SĐT:{" "}
                                  {data.technician[
                                    selectedEditOrder.technicianId
                                  ]?.phone || "Không có thông tin"}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PlaceIcon style={iconColor} />
                                <Typography variant="h6">
                                  Địa Chỉ:{" "}
                                  {data.technician[
                                    selectedEditOrder.technicianId
                                  ]?.address || "Không có thông tin"}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <MapRoundedIcon style={iconColor} />
                                <Typography variant="h6">
                                  {data.technician[
                                    selectedEditOrder.technicianId
                                  ]?.area === 1 ? (
                                    <Typography>
                                      {dataJson.area[0]?.name || "Không có"}
                                      <Tooltip
                                        title={dataJson.area[0]?.description}
                                      >
                                        <InfoIcon
                                          style={{
                                            fontSize: "16px",
                                          }}
                                        />
                                      </Tooltip>
                                    </Typography>
                                  ) : data.technician[
                                      selectedEditOrder.technicianId
                                    ]?.area === 2 ? (
                                    <Typography></Typography>
                                  ) : data.technician[
                                      selectedEditOrder.technicianId
                                    ]?.area === 3 ? (
                                    <Typography></Typography>
                                  ) : (
                                    <Typography>Không có thông tin</Typography>
                                  )}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={1}>
                              <Divider
                                orientation="vertical"
                                sx={{ height: "100%" }}
                              />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography
                                variant="h6"
                                sx={{ textAlign: "center" }}
                              >
                                Hình ảnh đơn hàng
                              </Typography>
                              <CardMedia>
                                <AutoPlaySwipeableViews
                                  axis={
                                    theme.direction === "rtl"
                                      ? "x-reverse"
                                      : "x"
                                  }
                                  index={activeStep}
                                  onChangeIndex={handleStepChange}
                                  enableMouseEvents
                                >
                                  {dataImage.map((item, index) => (
                                    <Box
                                      key={index}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <img
                                        src={item.url}
                                        alt={`Image ${index}`}
                                        style={{
                                          width: imageWidth,
                                          height: imageHeight,
                                          objectFit: "contain",
                                        }}
                                      />
                                    </Box>
                                  ))}
                                </AutoPlaySwipeableViews>
                              </CardMedia>
                            </Grid>
                          </>
                        )}

                        {selectedEditOrder.rescueType === "Towing" && (
                          <>
                            <Grid item xs={5}>
                              <Typography
                                variant="h6"
                                sx={{ marginBottom: 2, textAlign: "center" }}
                              >
                                Xe Cứu Hộ Nhận Đơn
                              </Typography>
                              <Grid container spacing={2}>
                                <Box
                                  sx={{
                                    mr: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <Avatar
                                    alt="Avatar"
                                    src={
                                      dataRescueVehicleOwner[vehicleRvoidId]
                                        ?.avatar ||
                                      "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
                                    }
                                    sx={{
                                      width: 44,
                                      height: 44,
                                      marginLeft: 1.75,
                                    }}
                                  />
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {" "}
                                    Tên Chủ Xe:
                                    {dataRescueVehicleOwner[vehicleRvoidId]
                                      ?.fullname || "Không có thông tin"}
                                  </Typography>
                                </Box>
                                <Grid item xs={6}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <MapRoundedIcon style={iconColor} />
                                    <Typography variant="h6">
                                      {dataRescueVehicleOwner[vehicleRvoidId]
                                        ?.area === 1 ? (
                                        <Typography>
                                          {dataJson.area[0]?.name || "Không có"}
                                          <Tooltip
                                            title={
                                              dataJson.area[0]?.description
                                            }
                                          >
                                            <InfoIcon
                                              style={{
                                                fontSize: "16px",
                                              }}
                                            />
                                          </Tooltip>
                                        </Typography>
                                      ) : data.technician[
                                          selectedEditOrder.technicianId
                                        ]?.area === 2 ? (
                                        <Typography></Typography>
                                      ) : data.technician[
                                          selectedEditOrder.technicianId
                                        ]?.area === 3 ? (
                                        <Typography></Typography>
                                      ) : (
                                        <Typography>
                                          Không có thông tin
                                        </Typography>
                                      )}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1, // Khoảng cách giữa icon và văn bản
                                    }}
                                  >
                                    <ReceiptRoundedIcon style={iconColor} />
                                    <Typography variant="h6">
                                      Biển Số:{" "}
                                      {data.vehicle[selectedEditOrder.vehicleId]
                                        ?.licensePlate || "Không có thông tin"}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1, // Khoảng cách giữa icon và văn bản
                                    }}
                                  >
                                    <CalendarTodayIcon style={iconColor} />
                                    <Typography variant="h6">
                                      Đời xe:
                                      {data.vehicle[selectedEditOrder.vehicleId]
                                        ?.manufacturingYear ||
                                        "Không có thông tin"}
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1, // Khoảng cách giữa icon và văn bản
                                    }}
                                  >
                                    <TimeToLeaveIcon style={iconColor} />
                                    <Typography variant="h6">
                                      Hãng Xe:{" "}
                                      {data.vehicle[selectedEditOrder.vehicleId]
                                        ?.manufacturer || "Không có thông tin"}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1, // Khoảng cách giữa icon và văn bản
                                    }}
                                  >
                                    <CategoryRounded style={iconColor} />
                                    <Typography variant="h6">
                                      Loại Xe:{" "}
                                      {data.vehicle[selectedEditOrder.vehicleId]
                                        ?.type || "Không có thông tin"}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1, // Khoảng cách giữa icon và văn bản
                                    }}
                                  >
                                    <ReceiptRoundedIcon style={iconColor} />
                                    <Typography variant="h6">
                                      Số khung xe:{" "}
                                      {data.vehicle[selectedEditOrder.vehicleId]
                                        ?.vinNumber || "Không có thông tin"}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={4}>
                                  <Box sx={{ marginLeft: "0px" }}>
                                    {data.vehicle[selectedEditOrder.vehicleId]
                                      ?.image ? (
                                      <img
                                        src={
                                          data.vehicle[
                                            selectedEditOrder.vehicleId
                                          ]?.image
                                        }
                                        alt="Hình Ảnh Của Xe"
                                        style={{
                                          width: "160px",
                                          height: "100px",
                                          border: "2px solid #000",
                                          objectFit: "cover",
                                        }}
                                        onClick={() => setShowModal(true)}
                                        title="Nhấp để xem ảnh rõ hơn"
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
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={1}>
                              <Divider
                                orientation="vertical"
                                sx={{ height: "100%" }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="h6"
                                sx={{ textAlign: "center" }}
                              >
                                Hình ảnh đơn hàng
                              </Typography>
                              <CardMedia>
                                <AutoPlaySwipeableViews
                                  axis={
                                    theme.direction === "rtl"
                                      ? "x-reverse"
                                      : "x"
                                  }
                                  index={activeStep}
                                  onChangeIndex={handleStepChange}
                                  enableMouseEvents
                                >
                                  {dataImage.map((item, index) => (
                                    <Box
                                      key={index}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <img
                                        src={item.url}
                                        alt={`Image ${index}`}
                                        style={{
                                          width: imageWidth,
                                          height: imageHeight,
                                          objectFit: "contain",
                                        }}
                                      />
                                    </Box>
                                  ))}
                                </AutoPlaySwipeableViews>
                              </CardMedia>
                            </Grid>
                          </>
                        )}

                        {/*iMAGE*/}
                      </Grid>
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MyModal;
