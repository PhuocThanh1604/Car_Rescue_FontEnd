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
  Collapse,
  Divider,
  Grid,
  IconButton,
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
import { styled, useTheme } from "@mui/material/styles";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import { getCustomerId } from "../../../redux/customerSlice";
import { useDispatch } from "react-redux";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TimerIcon from "@mui/icons-material/Timer";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getTechnicianId } from "../../../redux/technicianSlice";
import { getVehicleId } from "../../../redux/vehicleSlice";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import PinDropIcon from "@mui/icons-material/PinDrop";
import { CategoryRounded } from "@mui/icons-material";
import { getRescueVehicleOwnerId } from "../../../redux/rescueVehicleOwnerSlice";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import {
  getFormattedAddressGG,
  getOrderDetailId,
} from "../../../redux/orderSlice";
import { tokens } from "../../../theme";
import { getServiceId } from "../../../redux/serviceSlice";
const MyModal = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { openModal, setOpenModal, selectedEditOrder } = props;
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [data, setData] = useState({
    customer: {},
    technician: {},
    vehicle: {},
  });
  const [loading, setLoading] = useState(false);
  const [formattedAddresses, setFormattedAddresses] = useState({});
  const [dataRescueVehicleOwner, setDataRescueVehicleOwner] = useState({});
  const [rescueVehicleOwnerId, setRescueVehicleOwnerId] = useState({});
  const [firstServiceName, setFirstServiceName] = useState([]);
  const iconColor = { color: colors.blueAccent[500] };
  const [serviceNames, setServiceNames] = useState([]);

  useEffect(() => {
    if (selectedEditOrder && selectedEditOrder.departure) {
      fetchAddress("departure", selectedEditOrder.departure);
    }
    if (selectedEditOrder && selectedEditOrder.destination) {
      fetchAddress("destination", selectedEditOrder.destination);
    }
    if (selectedEditOrder && selectedEditOrder.id) {
      fetchOrderDetail(selectedEditOrder.id);
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

  // Lưu giá trị vào một biến
  useEffect(() => {
    if (selectedEditOrder && selectedEditOrder.vehicleId) {
      const vehicleRvoidId = data.vehicle[selectedEditOrder.vehicleId]?.rvoid;
      if (vehicleRvoidId) {
        fetchRescueVehicleOwner(vehicleRvoidId);
      }
    }
  }, [selectedEditOrder, data.vehicle, rescueVehicleOwnerId]);

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
  // Lấy vehicleRvoidId từ selectedEditOrder và data.vehicle

  useEffect(() => {
    if (selectedEditOrder) {
      // Gọi API chỉ khi cần thiết
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
  // Hiển thị tất cả dịch vụ và quantity
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
            }));

            // Tạo mảng promises để gọi API lấy thông tin từng serviceId và quantity
            const servicePromises = serviceDetails.map(
              ({ serviceId, quantity }) => {
                return dispatch(getServiceId({ id: serviceId }))
                  .then((serviceResponse) => {
                    const serviceName = serviceResponse.payload.data.name;
                    console.log(
                      `ServiceId: ${serviceId}, ServiceName: ${serviceName}, Quantity: ${quantity}`
                    );
                    return { serviceName, quantity };
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

  const vehicleRvoidId =
    selectedEditOrder && selectedEditOrder.vehicleId
      ? data.vehicle[selectedEditOrder.vehicleId]?.rvoid
      : null;
  let formattedDate = "Không rõ ngày tạo";
  if (selectedEditOrder && selectedEditOrder.createdAt) {
    const date = new Date(selectedEditOrder.createdAt);
    formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 because months start at 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formats to dd/mm/yyyy
  }

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
              sx={{ textAlign: "center" }}
            >
              Thông Tin Chi Tiết Đơn Hàng Đang Điều Phối
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
                            marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
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
                            <LocationOnIcon style={iconColor} />
                            <strong>Địa chỉ xe hư: </strong>
                            <Typography
                              variant="h6"
                              component="span"
                              sx={{
                                padding: "8px",
                                borderRadius: "4px",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                flex: 1,
                              }}
                            >
                              {formattedAddresses.departure || "Đang cập nhật"}
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
                            <PinDropIcon style={iconColor} />
                            <strong>Địa chỉ đến: </strong>
                            <Typography
                              variant="h6"
                              component="span"
                              sx={{
                                padding: "8px",
                                borderRadius: "4px",
                                marginLeft: "10px",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                flex: 1,
                              }}
                            >
                              {formattedAddresses.destination ||
                                "Đang cập nhật"}
                            </Typography>
                          </Typography>

                          {/* List all services */}
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
                                          { serviceName, quantity },
                                          innerIndex
                                        ) => (
                                          <React.Fragment key={innerIndex}>
                                            {serviceName ||
                                              "Không có thông tin"}{" "}
                                            ({quantity})
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
                    <Typography variant="h4" sx={{ marginBottom: 2 }}>
                      Thông Tin Nhân Sự Đang Điều Phối
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Grid container spacing={2} alignItems="stretch">
                        <Grid item xs={5} alignItems="center">
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
                                data.technician[selectedEditOrder.technicianId]
                                  ?.avatar || "URL mặc định của avatar"
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
                              {data.technician[selectedEditOrder.technicianId]
                                ?.fullname || "Không có thông tin"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <PeopleAltRoundedIcon style={iconColor} />
                            <Typography variant="h6">
                              Giới Tính:{" "}
                              {data.technician[selectedEditOrder.technicianId]
                                ?.sex || "Không có thông tin"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <PhoneRoundedIcon style={iconColor} />
                            <Typography variant="h6">
                              SĐT:{" "}
                              {data.technician[selectedEditOrder.technicianId]
                                ?.phone || "Không có thông tin"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <PlaceIcon style={iconColor} />
                            <Typography variant="h6">
                              Địa Chỉ:{" "}
                              {data.technician[selectedEditOrder.technicianId]
                                ?.address || "Không có thông tin"}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <MapRoundedIcon style={iconColor} />
                            <Typography variant="h6">
                              Khu vực:{" "}
                              {data.technician[selectedEditOrder.technicianId]
                                ?.area || "Không có thông tin"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={1}>
                          <Divider
                            orientation="vertical"
                            sx={{ height: "100%" }}
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <Typography
                            variant="h6"
                            sx={{ marginBottom: 2, textAlign: "center" }}
                          >
                            Xe Cứu Hộ Nhận Đơn
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
                              Tên Chủ Xe:{" "}
                              {dataRescueVehicleOwner[vehicleRvoidId]
                                ?.fullname || "Không có thông tin"}
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
                            <CalendarTodayIcon style={iconColor} />
                            <Typography variant="h6">
                              Năm:{" "}
                              {data.vehicle[selectedEditOrder.vehicleId]
                                ?.manufacturingYear || "Không có thông tin"}
                            </Typography>
                          </Box>
                        </Grid>
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