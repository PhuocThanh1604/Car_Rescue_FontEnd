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
  Rating,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/Place";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { useDispatch } from "react-redux";
import { getRescueVehicleOwnerId } from "../../../redux/rescueVehicleOwnerSlice";
import { getCustomerId } from "../../../redux/customerSlice";
import { getTechnicianId } from "../../../redux/technicianSlice";
import { getVehicleId } from "../../../redux/vehicleSlice";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import { CategoryRounded } from "@mui/icons-material";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
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

  const [dataRescueVehicleOwner, setDataRescueVehicleOwner] = useState({});
  const [rescueVehicleOwnerId, setRescueVehicleOwnerId] = useState({});
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

  const vehicleRvoidId =
    selectedEditOrder && selectedEditOrder.vehicleId
      ? data.vehicle[selectedEditOrder.vehicleId]?.rvoid
      : null;
  let formattedDate = "Không có thông tin";
  if (selectedEditOrder && selectedEditOrder.birthdate) {
    const date = new Date(selectedEditOrder.birthdate);
    formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
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
  const StyledGrid2 = styled(Grid)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      paddingLeft: "0 !important",
    },
    [theme.breakpoints.down("md")]: {
      order: -1,
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

            <Typography variant="h6" component="h2" id="book-detail-modal">
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
                      <Grid item xs={6} alignItems="center">
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>
                          Thông Tin Khách Hàng
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
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {data.customer[selectedEditOrder.customerId]
                              ?.fullname || "Không có thông tin"}
                          </Typography>
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
                          <PeopleAltRoundedIcon />
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
                          <PhoneRoundedIcon /> <strong>SĐT:</strong>
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
                          <PlaceIcon /> <strong>Địa chỉ:</strong>
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
                          <WatchLaterRoundedIcon /> <strong>Ngày sinh: </strong>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {formattedDate}
                          </Typography>
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Divider
                          orientation="vertical"
                          sx={{ height: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={5} alignItems="center">
                        <StyledGrid1 item xs={12} md={6} lg={7}>
                          <Typography variant="h5" sx={{ marginBottom: 2 }}>
                            FeedBack của đơn hàng
                          </Typography>
                          <Box
                            sx={{
                              mb: 4.75,
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            <Rating
                              readOnly
                              value={5}
                              name="read-only"
                              sx={{ marginRight: 2 }}
                            />
                            <Typography variant="body2">
                              5 Star | 98 reviews
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ marginBottom: 4 }}>
                            Before there was a United States of America, there
                            were coffee houses, because how are you supposed to
                            build.
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
                            <PeopleAltRoundedIcon />
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
                            <PhoneRoundedIcon />
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
                            <PlaceIcon />
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
                            <MapRoundedIcon />
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

                        {/*CarOWnẻ*/}
                        <Grid item xs={5} alignItems="center">
                          <Typography
                            variant="h6"
                            sx={{ marginBottom: 2, textAlign: "center" }}
                          >
                            Xe Cứu Hộ Nhận Đơn
                          </Typography>
                          <Grid container>
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
                            <Grid item xs={6}>
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
                                <TimeToLeaveIcon />
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
                                <CategoryRounded />
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
                                <CalendarTodayIcon />
                                <Typography variant="h6">
                                  Năm:{" "}
                                  {data.vehicle[selectedEditOrder.vehicleId]
                                    ?.manufacturingYear || "Không có thông tin"}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={4}>
                              <Box sx={{ marginTop: "0px" }}>
                                {data.vehicle[selectedEditOrder.vehicleId]
                                  ?.image ? (
                                  <img
                                    src={
                                      data.vehicle[selectedEditOrder.vehicleId]
                                        ?.image
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
                                {showModal && (
                                  <div
                                    style={{
                                      position: "fixed",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    onClick={() => setShowModal(false)}
                                  >
                                    <img
                                      src={
                                        data.vehicle[
                                          selectedEditOrder.vehicleId
                                        ]?.image
                                      }
                                      alt="Hình Ảnh Của Xe"
                                      style={{
                                        maxWidth: "80%",
                                        maxHeight: "80%",
                                        objectFit: "contain",
                                      }}
                                    />
                                  </div>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>

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
