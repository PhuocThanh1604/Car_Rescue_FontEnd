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
  Tooltip,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PlaceIcon from "@mui/icons-material/Place";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import { getCustomerId } from "../../../redux/customerSlice";
import { useDispatch } from "react-redux";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TimerIcon from "@mui/icons-material/Timer";
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import MapIcon from "@mui/icons-material/Map";
import { getTechnicianId } from "../../../redux/technicianSlice";
import { getVehicleId } from "../../../redux/vehicleSlice";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import { CategoryRounded } from "@mui/icons-material";
import { getRescueVehicleOwnerId } from "../../../redux/rescueVehicleOwnerSlice";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import moment from "moment";
import { tokens } from "../../../theme";
import { getImageOfOrder, getOrderDetailId } from "../../../redux/orderSlice";
import { getServiceId } from "../../../redux/serviceSlice";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../../data.json";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { toast } from "react-toastify";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const MyModal = (props) => {
  const { openModal, setOpenModal, selectedDetailOrder } = props;
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [serviceNames, setServiceNames] = useState([]);
  const [data, setData] = useState({
    customer: {},
    technician: {},
    vehicle: {},
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const iconColor = { color: colors.blueAccent[500] };
  const [dataRescueVehicleOwner, setDataRescueVehicleOwner] = useState({});
  const [rescueVehicleOwnerId, setRescueVehicleOwnerId] = useState({});
  const [dataImage, setDataImage] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const [dataJson, setDataJson] = useState([]);
  const imageWidth = "300px";
  const imageHeight = "200px";
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu");
    }
    setDataJson(areaData);
  }, [dataJson]);
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // Lưu giá trị vào một biến
  useEffect(() => {
    if (selectedDetailOrder && selectedDetailOrder.vehicleId) {
      const vehicleRvoidId = data.vehicle[selectedDetailOrder.vehicleId]?.rvoid;
      if (vehicleRvoidId) {
        fetchRescueVehicleOwner(vehicleRvoidId);
      }
    }
    if (selectedDetailOrder && selectedDetailOrder.id) {
      fetchOrderDetail(selectedDetailOrder.id);
      fetchImageOfOrder(selectedDetailOrder.id);
    }
  }, [selectedDetailOrder, data.vehicle, rescueVehicleOwnerId]);

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
            toast.dismiss("Image URLs not found in the API response.");
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
  const fetchRescueVehicleOwner = (vehicleRvoidId) => {
    console.log(vehicleRvoidId);
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
            console.error("Service name not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data:", error);
        });
    }
  };
  // Lấy vehicleRvoidId từ selectedDetailOrder và data.vehicle

  useEffect(() => {
    if (selectedDetailOrder) {
      // Gọi API chỉ khi cần thiết
      fetchDataIfNeeded("customer", selectedDetailOrder.customerId);
      fetchDataIfNeeded("technician", selectedDetailOrder.technicianId);
      fetchDataIfNeeded("vehicle", selectedDetailOrder.vehicleId);
    }
  }, [selectedDetailOrder]);

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
      // không cần 'default' vì tất cả các trường hợp đã được xử lý
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
          console.error(`${type} data not found in the API response.`);
        }
      })
      .catch((error) => {
        console.error(`Error while fetching ${type} data:`, error);
      });
  };
  const handleClick = () => {
    setCollapse(!collapse);
  };

  const vehicleRvoidId =
    selectedDetailOrder && selectedDetailOrder.vehicleId
      ? data.vehicle[selectedDetailOrder.vehicleId]?.rvoid
      : null;
  let formattedDate = "Không rõ ngày tạo";
  if (selectedDetailOrder && selectedDetailOrder.createdAt) {
    const date = new Date(selectedDetailOrder.createdAt);
    formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  
  const fetchOrderDetail = (orderId) => {
    console.log(orderId);
    setServiceNames(null);
    // Make sure you have a check to prevent unnecessary API calls
    if (orderId) {
      dispatch(getOrderDetailId({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data && Array.isArray(data)) {
            const serviceDetails = data.map((item) => ({
              serviceId: item.serviceId,
              quantity: item.quantity,
              type: null, // Thêm type vào object để lưu thông tin loại dịch vụ từ API
            }));

            // Tạo mảng promises để gọi API lấy thông tin từng serviceId và quantity
            const servicePromises = serviceDetails.map(
              ({ serviceId, quantity }) => {
                return dispatch(getServiceId({ id: serviceId }))
                  .then((serviceResponse) => {
                    const serviceName = serviceResponse.payload.data.name;
                    const serviceType = serviceResponse.payload.data.type;
                    let updatedQuantity = quantity;

                    // Xử lý thông tin quantity dựa trên loại dịch vụ (type)
                    if (serviceType === "Towing") {
                      updatedQuantity += " km"; // Nếu là Towing thì thêm chuỗi ' km' vào quantity
                    } else if (serviceType === "Fixing") {
                      updatedQuantity = `Số lượng: ${quantity}`; // Nếu là Fixing thì sử dụng format riêng
                    }

                    console.log(
                      `ServiceId: ${serviceId}, ServiceName: ${serviceName}, Quantity: ${updatedQuantity}`
                    );
                    return { serviceName, updatedQuantity }; // Trả về thông tin đã được xử lý
                  })
                  .catch((serviceError) => {
                    console.error(
                      `Error while fetching service data for serviceId ${serviceId}:`,
                      serviceError
                    );
                    return null;
                  });
              }
            );

            // Sử dụng Promise.all để chờ tất cả các promises hoàn thành
            Promise.all(servicePromises)
              .then((serviceData) => {
                // Log tất cả serviceName và quantity từ API
                console.log(
                  "Tất cả serviceName và quantity từ API:",
                  serviceData
                );
                // Cập nhật state với serviceNames và quantity đã lấy được từ API
                setServiceNames((prevServiceNames) => ({
                  ...prevServiceNames,
                  [orderId]: serviceData,
                }));
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

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "Đang cập nhật";
    return moment(dateTime)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .format("DD/MM/YYYY HH:mm:ss");
    // Set the time zone to Vietnam's ICT
  };

  // Styled Grid component
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
              component="h2"
              id="book-detail-modal"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Thông Tin Chi Tiết Đơn Hàng Đang Điều Phối
            </Typography>

            {selectedDetailOrder && (
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
                        <Typography variant="h5" sx={{ marginBottom: 2 ,fontWeight:"bold"}}>
                          Thông Tin Khách Hàng
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
                            {data.customer[selectedDetailOrder.customerId]
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
                            {data.customer[selectedDetailOrder.customerId]
                              ?.sex || "Không có thông tin"}
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
                            {data.customer[selectedDetailOrder.customerId]
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
                            {data.customer[selectedDetailOrder.customerId]
                              ?.address || "Không có thông tin"}
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
                            Thông tin đơn hàng
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
                              {formatDateTime(
                                selectedDetailOrder.startTime || "Đang cập nhật"
                              )}
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
                              {selectedDetailOrder.endTime || "Đang cập nhật"}
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
                            <MapIcon style={iconColor} />
                            <strong>Khu vực: </strong>
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
                              {selectedDetailOrder.area || "khu vực 1"}
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
                            <CreditScoreIcon style={iconColor} />{" "}
                            <strong>Tổng tiền đã thanh toán:</strong>
                            <Typography
                              variant="h6"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            >
                              {" "}
                              {"Chưa thanh toán"}
                            </Typography>
                          </Typography>

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
                                          {/* Add <br /> if it's not the last service in serviceNames */}
                                        </React.Fragment>
                                      );
                                    }
                                  )
                                : "Không có thông tin"}
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
                        {selectedDetailOrder.rescueType === "Fixing" && (
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
                                      selectedDetailOrder.technicianId
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
                                    selectedDetailOrder.technicianId
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
                                    selectedDetailOrder.technicianId
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
                                    selectedDetailOrder.technicianId
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
                                    selectedDetailOrder.technicianId
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
                                    selectedDetailOrder.technicianId
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
                                    selectedDetailOrder.technicianId
                                    ]?.area === 2 ? (
                                    <Typography></Typography>
                                  ) : data.technician[
                                    selectedDetailOrder.technicianId
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
                                {dataImage && dataImage.length > 0 ? (
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
                                ) : (
                                  <Box
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: imageHeight,
                                    }}
                                  >
                                     <ReportProblemOutlinedIcon
                                  style={{ fontSize: 64, color: colors.amber[200] }}
                                />
                                 
                                  </Box>
                                )}
                              </CardMedia>
                            </Grid>
                          </>
                        )}

                        {selectedDetailOrder.rescueType === "Towing" && (
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
                                        selectedDetailOrder.technicianId
                                        ]?.area === 2 ? (
                                          <Typography>
                                          {dataJson.area[1]?.name || "Không có"}
                                          <Tooltip
                                            title={dataJson.area[1]?.description}
                                          >
                                            <InfoIcon
                                              style={{
                                                fontSize: "16px",
                                              }}
                                            />
                                          </Tooltip>
                                        </Typography>
                                      ) : data.technician[
                                        selectedDetailOrder.technicianId
                                        ]?.area === 3 ? (
                                          <Typography>
                                          {dataJson.area[2]?.name || "Không có"}
                                          <Tooltip
                                            title={dataJson.area[2]?.description}
                                          >
                                            <InfoIcon
                                              style={{
                                                fontSize: "16px",
                                              }}
                                            />
                                          </Tooltip>
                                        </Typography>
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
                                      {data.vehicle[selectedDetailOrder.vehicleId]
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
                                      {data.vehicle[selectedDetailOrder.vehicleId]
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
                                      {data.vehicle[selectedDetailOrder.vehicleId]
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
                                      {data.vehicle[selectedDetailOrder.vehicleId]
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
                                      {data.vehicle[selectedDetailOrder.vehicleId]
                                        ?.vinNumber || "Không có thông tin"}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={4}>
                                  <Box sx={{ marginLeft: "0px" }}>
                                    {data.vehicle[selectedDetailOrder.vehicleId]
                                      ?.image ? (
                                      <img
                                        src={
                                          data.vehicle[
                                            selectedDetailOrder.vehicleId
                                          ]?.image
                                        }
                                        alt="Hình Ảnh Của Xe"
                                        style={{
                                          width: "160px",
                                          height: "100px",
                                          border: "2px solid #000",
                                          objectFit: "cover",
                                        }}
                                        // onClick={() => setShowModal(true)}
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
                                sx={{ textAlign: "center" , marginBottom:"10px"}}
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
