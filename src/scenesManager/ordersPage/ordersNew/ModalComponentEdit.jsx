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
  Avatar,
  Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import {
  createAcceptOrder,
  fetchOrdersNew,
  getFormattedAddress,
  getFormattedAddressGG,
  sendNotification,
} from "../../../redux/orderSlice";
import { fetchVehicle, getVehicleId } from "../../../redux/vehicleSlice";
import { fetchTechnicians } from "../../../redux/technicianSlice";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import CategoryIcon from "@mui/icons-material/Category";
import PlaceIcon from "@mui/icons-material/Place";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
const ModalEdit = ({
  openEditModal,
  setOpenEditModal,
  selectedEditOrder,
  formattedAddress,
}) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  // console.log(formattedAddress);
  const [edit, setEdit] = useState({});
  const [data, setData] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});
  const [fullnameValue, setFullnameValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtereRescueVehicleOwners, setFilteredRescueVehicleOwners] = useState(
    []
  );
  const [serverError, setServerError] = useState(null);
  const [selectedVehicle, setSelectedVehicel] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [technicianId, setTechnicianId] = useState(null);
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
  //lọc kéo và sửa cho tech và carowner
  useEffect(() => {
    // Filter and set the list of technicians or rescue vehicles based on the selected rescueType
    if (selectedRescueType === "Fixing") {
      setFilteredTechnicianData(
        technicianData.filter((tech) => tech.status === "ACTIVE")
      );
      setFilteredTechnicianData([]);
    } else if (selectedRescueTypeTowing === "Towing") {
      setFilteredVehicleData(
        vehicleData.filter((vehicle) => vehicle.status === "ACTIVE")
      );
      setFilteredVehicleData([]);
    }
  }, [
    selectedRescueType,
    selectedRescueTypeTowing,
    technicianData,
    vehicleData,
  ]);

  useEffect(() => {
    if (selectedTechnician) {
      console.log("test tec" + selectedTechnician);
      const selectedTechnicianId = selectedTechnician.id;
      // Filter the active technicians based on the selected technician's ID
      const filteredTechnicianDetails = technicianData.find(
        (technician) => technician.id === selectedTechnicianId
      );
      setTechnicianDetails(filteredTechnicianDetails);
      console.log("detail" + technicianDetails);
    } else {
      setTechnicianDetails(null);
    }
  }, [selectedTechnician, technicianData]);

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

  const reloadOrders = () => {
    dispatch(fetchOrdersNew())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredRescueVehicleOwners(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách khách hàng:", error);
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
          setSelectedOrderFormattedAddress(OrderToEdit.formattedAddress);
        }
      }
    }
  }, [selectedEditOrder, orders]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
    console.log(setEdit);
  };
  const hanldeSenNoti = () => {
    const message = {
      title: "Thông báo",
      body: "Điều phối thành công",
    };
  };
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
        technicianID: technicianId,
        managerID: manager.id,
      };
      dispatch(createAcceptOrder(requestData))
        .then(() => {
          toast.success("Gửi điều phối thành công.");
          // Tạo đối tượng dữ liệu thông báo
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
          reloadOrders();
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
    setEdit("");
  };

  // Function to reset Fixing state variables
  const resetFixingState = () => {
    setSelectedTechnician(null);
    setTechnicianId(null);
  };

  // Function to reset Towing state variables
  const resetTowingState = () => {
    setSelectedVehicel(null);
    setVehicleId(null);
  };

  // When rescue type is changed, reset the state accordingly
  useEffect(() => {
    if (selectedRescueType === "Fixing") {
      resetTowingState();
    } else if (selectedRescueType === "Towing") {
      resetFixingState();
    }
  }, [selectedRescueType]);

  return (
    <>
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
                maxWidth: "800px", // You can adjust the maximum width
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
                variant="h6"
                component="h2"
                id="RescuseVehicleOwner-detail-modal"
              >
                {selectedEditOrder
                  ? "Tạo thông tin điều phối nhân sự"
                  : "RescuseVehicleOwner Detail"}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {selectedEditOrder && (
                    <>
                      <Card sx={{ height: "300px" }}>
                        <CardContent>
                          <Typography variant="h4" sx={{ marginBottom: 2 }}>
                            Thông Tin Chi Tiết Đơn Hàng
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
                              <Avatar
                                alt="Mary Vaughn"
                                src="https://thumbs.dreamstime.com/b/businessman-icon-vector-male-avatar-profile-image-profile-businessman-icon-vector-male-avatar-profile-image-182095609.jpg"
                                sx={{
                                  width: 44,
                                  height: 44,
                                  marginRight: 2.75,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  display: "flex",
                                  alignItems: "center", // Căn chỉnh theo chiều dọc
                                }}
                              >
                                Mary Vaughn
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center", // Căn chỉnh theo chiều dọc
                              marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                            }}
                          >
                            <CategoryIcon /> <strong>Rescue Type:</strong>{" "}
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
                                  ? "green"
                                  : edit.rescueType === "Towing"
                                  ? "red"
                                  : "grey"
                              }
                            >
                              {edit.rescueType === "Towing" && <SupportIcon />}
                              {edit.rescueType === "Fixing" && <HandymanIcon />}
                              <Typography color="white">
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
                            }}
                          >
                            <QueryBuilderIcon /> <strong>Date:</strong>{" "}
                            {edit.createdAt}
                          </Typography>
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <PlaceIcon /> <strong>Departure:</strong>{" "}
                            {edit.formattedAddress}
                          </Typography>

                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                            }}
                          >
                            <PlaceIcon /> <strong>Destination:</strong>{" "}
                            {edit.destination}
                          </Typography>
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                            }}
                          >
                            <PlaceIcon /> <strong>Ghi chú:</strong>{" "}
                            {edit.customerNote}
                          </Typography>
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                            }}
                          >
                            <PaymentIcon /> <strong>Payment ID:</strong>{" "}
                            {edit.paymentId}
                          </Typography>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ height: "300px" }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ marginBottom: 2 }}>
                        Điều phối nhân sự
                      </Typography>
                      {useEffect(() => {
                        // Reset các giá trị khi thay đổi loại cứu hộ
                        setSelectedVehicel(null);
                        setVehicleDetails(null);
                        setSelectedTechnician(null);
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
                              setTechnicianId(newValue && newValue.id);
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
                                />
                                {option.fullname}
                              </li>
                            )}
                          />

                          {technicianDetails && (
                            <div>
                              <h2>Selected Technician Details</h2>
                              <p>Fullname: {technicianDetails.fullname}</p>
                              <p>phone: {technicianDetails.phone}</p>
                              <p>status: {technicianDetails.status}</p>
                              {/* Add more properties as needed */}
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
                              <h2>Selected Vehicle Details</h2>
                              <p>vinNumber: {vehicleDetails.vinNumber}</p>
                              <p>
                                License Plate: {vehicleDetails.licensePlate}
                              </p>
                              {/* Add more properties as needed */}
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
