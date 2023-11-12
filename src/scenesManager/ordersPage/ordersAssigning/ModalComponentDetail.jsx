import React, { useEffect, useState } from "react";
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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/Place";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";

import { getCustomerId } from "../../../redux/customerSlice";
import { useDispatch } from "react-redux";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import MarkChatUnreadRoundedIcon from "@mui/icons-material/MarkChatUnreadRounded";
import { getTechnicianId } from "../../../redux/technicianSlice";
import { getVehicleId } from "../../../redux/vehicleSlice";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import { CategoryRounded } from "@mui/icons-material";
const MyModal = (props) => {
  const { openModal, setOpenModal, selectedEditOrder } = props;
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [customerId, setCustomerId] = useState({});
  const [technicianId, setTechnicianId] = useState({});
  const [dataTechnician, setDataTechnician] = useState({});
  const [vehicleId, setVehicleId] = useState({});
  const [dataVehicle, setDataVehicle] = useState({});
  const [dataCustomer, setDataCustomer] = useState({});
  // const [rescueId, setTechnicianId] = useState({});

  useEffect(() => {
    if (
      selectedEditOrder &&
      selectedEditOrder.customerId &&
      selectedEditOrder.customerId !== customerId &&
      selectedEditOrder.technicianId &&
      selectedEditOrder.technicianId !== technicianId &&
      selectedEditOrder.vehicleId &&
      selectedEditOrder.vehicleId !== vehicleId
    ) {
      setCustomerId(selectedEditOrder.customerId);
      fetchCustomer(selectedEditOrder.customerId);
      setTechnicianId(selectedEditOrder.technicianId);
      fetchTechnicians(selectedEditOrder.technicianId);
      setVehicleId(selectedEditOrder.vehicleId);
      fetchVehicle(selectedEditOrder.vehicleId);
    }
  }, [selectedEditOrder, customerId, technicianId]);

  const fetchCustomer = (customerId) => {
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
  const fetchTechnicians = (technicianId) => {
    console.log(technicianId);
    // Make sure you have a check to prevent unnecessary API calls
    if (technicianId) {
      dispatch(getTechnicianId({ id: technicianId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data) {
            setDataTechnician((prevData) => ({
              ...prevData,
              [technicianId]: data,
            }));
          } else {
            console.error("Service name not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching technician data:", error);
        });
    }
  };
  const fetchVehicle = (vehicleId) => {
    console.log(vehicleId);
   
    if (vehicleId) {
      dispatch(getVehicleId({ id: vehicleId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data) {
            setDataVehicle((prevData) => ({
              ...prevData,
              [vehicleId]: data,
            }));
          } else {
            console.error("Service name not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching vehicle data:", error);
        });
    }
  };
  const handleClick = () => {
    setCollapse(!collapse);
  };

  // const date = new Date(selectedEditOrder.createdAt);
  // const formattedDate = `${date.getDate()}/${
  //   date.getMonth() + 1
  // }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
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

            <Typography variant="h4" component="h2" id="book-detail-modal">
              Thông Tin Chi Tiết Đơn Hàng Đang Điều Phối
            </Typography>

            {selectedEditOrder && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ display: "none" }}>
                    id: {selectedEditOrder.id}
                  </Typography>

                  <Box
                    sx={{
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
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
                      {dataCustomer[selectedEditOrder.customerId]?.fullname ||
                        "Đang tải..."}
                    </Typography>
                    <Avatar
                      alt="Avatar"
                      src={
                        dataCustomer[selectedEditOrder.customerId]?.avatar ||
                        "URL mặc định của avatar"
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
                    <MarkChatUnreadRoundedIcon /> <strong>Ghi chú: </strong>
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px",
                      }}
                    >
                      {" "}
                      {selectedEditOrder.customerNote}
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
                    <WatchLaterRoundedIcon /> <strong>Ngày tạo: </strong>
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px",
                      }}
                    >
                      {/* {formattedDate} */}
                    </Typography>
                  </Typography>
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
                                dataTechnician[selectedEditOrder.technicianId]
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
                              {dataTechnician[selectedEditOrder.technicianId]
                                ?.fullname || "Đang tải..."}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <PeopleAltRoundedIcon />
                            <Typography variant="h6">
                              Giới Tính:{" "}
                              {dataTechnician[selectedEditOrder.technicianId]
                                ?.sex || "Đang tải..."}
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
                            <Typography variant="h6">
                              SĐT:{" "}
                              {dataTechnician[selectedEditOrder.technicianId]
                                ?.phone || "Đang tải..."}
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
                            <Typography variant="h6">
                              Địa Chỉ:{" "}
                              {dataTechnician[selectedEditOrder.technicianId]
                                ?.address || "Đang tải..."}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <MapRoundedIcon />
                            <Typography variant="h6">
                              Khu vực:{" "}
                              {dataTechnician[selectedEditOrder.technicianId]
                                ?.area || "Đang tải..."}
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
                                dataTechnician[selectedEditOrder.technicianId]
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
                              {dataTechnician[selectedEditOrder.technicianId]
                                ?.fullname || "Đang tải..."}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <ReceiptRoundedIcon />
                            <Typography variant="h6">
                              Biển Số:{" "}
                              {dataVehicle[selectedEditOrder.vehicleId]
                                ?.licensePlate || "Đang tải..."}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <TimeToLeaveIcon />
                            <Typography variant="h6">
                              Hãng Xe:{" "}
                              {dataVehicle[selectedEditOrder.vehicleId]
                                ?.manufacturer || "Đang tải..."}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <CategoryRounded />
                            <Typography variant="h6">
                              Loại Xe:{" "}
                              {dataVehicle[selectedEditOrder.vehicleId]
                                ?.type || "Đang tải..."}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1, // Khoảng cách giữa icon và văn bản
                            }}
                          >
                            <CalendarTodayIcon />
                            <Typography variant="h6">
                              Năm:{" "}
                              {dataVehicle[selectedEditOrder.vehicleId]
                                ?.manufacturingYear || "Đang tải..."}
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
