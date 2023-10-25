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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import { createAcceptOrder, fetchOrdersNew } from "../../../redux/orderSlice";
import { fetchVehicle, getVehicleId } from "../../../redux/vehicleSlice";
import { fetchTechnicians } from "../../../redux/technicianSlice";

const ModalEdit = ({ openEditModal, setOpenEditModal, selectedEditOrder }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
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
  const [currentImageUrl, setCurrentImageUrl] = useState(edit.avatar || "");
  const [serverError, setServerError] = useState(null);
  const [selectedVehicle, setSelectedVehicel] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [vehicleData, setVehicleData] = useState([]);
  const [technicianId, setTechnicianId] = useState(null);
  const [loadingTechnician, setLoadingTechnician] = useState(true);
  const [technicianData, setTechnicianData] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const managerString = localStorage.getItem("manager");
  let manager = null;

  if (managerString) {
    try {
      manager = JSON.parse(managerString); // Thử phân tích chuỗi JSON
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleResponse = await dispatch(fetchVehicle());
        const vehicleData = vehicleResponse.payload.data;

        if (vehicleData) {
          const activeManufacturers = vehicleData
            .filter((item) => item.status === "ACTIVE")
            .map((item) => ({
              id: item.id,
              manufacturer: item.manufacturer,
            }));

          setVehicleData(activeManufacturers);
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
    if (selectedTechnician) {
      const selectedTechnicianId = selectedTechnician.id;
      // Filter the active technicians based on the selected technician's ID
      const filteredTechnicianDetails = technicianData.find(
        (technician) => technician.id === selectedTechnicianId
      );
      setTechnicianDetails(filteredTechnicianDetails);
    }
  }, [selectedTechnician, technicianData]);

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
        }
      }
    }
  }, [selectedEditOrder, orders]);
  useEffect(() => {
    if (selectedEditOrder) {
      // Kiểm tra xem selectedEditOrder có chứa giá trị id không
      if (selectedEditOrder.id) {
        setOrderId(selectedEditOrder.id);
      } else {
        setOrderId(null);
      }
    }
  }, [selectedEditOrder]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEdit((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
    console.log(setEdit);
  };

  const handleSaveClick = () => {
    console.log("orderId " + orderId);
    console.log("vehicleId " + vehicleId);
    console.log("techniciansId " + technicianId);
    console.log("managerId " + manager.id);
    if (!selectedEditOrder || !data) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }

    // Kiểm tra xem có sự thay đổi trong dữ liệu so với dữ liệu ban đầu
    const hasChanges =
      JSON.stringify(data) !== JSON.stringify(initialFormState);

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
          handleClose();
          reloadOrders();
          setIsSuccess(true);
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
  };

  if (!orders) {
    return null;
  }

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
                  ? "Tạo thông tin điều phối nhân sự"
                  : "RescuseVehicleOwner Detail"}
              </Typography>

              {selectedEditOrder && (
                <Card>
                  <CardContent>
                    <TextField
                      name="id"
                      label="id"
                      value={edit.id || ""}
                      onChange={(event) => {
                        if (!selectedEditOrder) {
                          handleInputChange(event);
                        } 

                        // Lấy giá trị `id` từ selectedEditOrder và đặt nó vào orderId
                      }}
                      style={{display:"none"}}
                    />

                    <Autocomplete
                      id="technicians-select"
                      options={technicianData} // Should now contain only active manufacturers
                      getOptionLabel={(option) => option && option.fullname}
                      value={selectedTechnician}
                      onChange={(_, newValue) => {
                        setSelectedTechnician(newValue);
                        // Handle the selected manufacturer here
                        console.log("Selected fullname:", newValue);
                        // You can also get the details of the selected manufacturer using the 'data' array
                        setTechnicianId(newValue && newValue.id);
                        // Handle the selected manufacturer and id here
                        console.log(
                          "Selected fullname technicians:",
                          newValue && newValue.fullname
                        );
                        console.log(
                          "Selected id technicians :",
                          newValue && newValue.id
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Danh Sách Kỹ Thuật Viên Đang Hoạt Động"
                          variant="filled"
                          margin="normal"
                        />
                      )}
                    />
                    {technicianDetails && (
                      <div>
                        <h2>Selected Technician Details</h2>
                        <p>Fullname: {technicianDetails.fullname}</p>
                        <p>Avatar: {technicianDetails.avatar}</p>
                        <p>Avatar: {technicianDetails.avatar}</p>
                        <p>Avatar: {technicianDetails.avatar}</p>
                        <p>Avatar: {technicianDetails.avatar}</p>

                        {/* Add more properties as needed */}
                      </div>
                    )}
                    <Autocomplete
                      id="vehicle-select"
                      options={vehicleData} // Use the fetched vehicle data
                      getOptionLabel={(option) => option && option.manufacturer}
                      value={selectedVehicle}
                      onChange={(_, newValue) => {
                        setSelectedVehicel(newValue);
                        // Set the selected vehicle ID when an option is selected
                        setVehicleId(newValue && newValue.id);
                        // Handle the selected manufacturer and ID here
                        console.log(
                          "Selected manufacturer:",
                          newValue && newValue.manufacturer
                        );
                        console.log("Selected ID:", newValue && newValue.id);
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
                  </CardContent>

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
                      Lưu
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
