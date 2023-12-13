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
  CardActions,
  Collapse,
  Divider,
} from "@mui/material";
import { CategoryRounded, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../../../theme";
import { toast } from "react-toastify";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import {
  createAcceptOrder,
  fetchOrdersNew,
  getCarById,
  getFormattedAddressGG,
  getOrderDetailId,
  getPaymentId,
  sendNotification,
} from "../../../redux/orderSlice";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
import { getModelCarId } from "../../../redux/modelCarSlice";
import { getRescueVehicleOwnerId } from "../../../redux/rescueVehicleOwnerSlice";
import { getAccountId } from "../../../redux/accountSlice";
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
  const iconColor = { color: colors.blueAccent[500] };
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
  const [loadingTechnician, setLoadingTechnician] = useState(true);
  const [technicianData, setTechnicianData] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [selectedRescueType, setSelectedRescueType] = useState([
    "Fixing",
    "Towing",
  ]);
  const [showModal, setShowModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [selectedRescueTypeTowing, setSelectedRescueTypeTowing] =
    useState("Towing");
  const [filteredTechnicianData, setFilteredTechnicianData] = useState([]);
  const [filteredVehicleData, setFilteredVehicleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formattedAddresses, setFormattedAddresses] = useState({});
  const [selectedOrderFormattedAddress, setSelectedOrderFormattedAddress] =
    useState("");
  const [customerId, setCustomerId] = useState({});
  const [carId, setCarId] = useState({});
  const [modelId, setModelId] = useState({});
  const [paymentId, setPaymentId] = useState({});
  const [dataCustomer, setDataCustomer] = useState({});
  const [dataCar, setDataCar] = useState({});
  const [dataOrder, setDataOrder] = useState({});
  const [dataDeparture, setDataDeparture] = useState({});
  const [accountId, setAccountId] = useState("");
  const [accountIdCustomer, setAccountIdCustomer] = useState("");

  const [accountDeviceToken, setAccountDeviceToken] = useState("");
  const [accountDeviceTokenCustomer, setAccountDeviceTokenCustomer] =
    useState("");

  const [dataModel, setDataModel] = useState("");
  const [fullnameRvo, setFullnameRvo] = useState({});
  const managerString = localStorage.getItem("manager");
  let manager = null;

  if (managerString) {
    try {
      manager = JSON.parse(managerString); 
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }

  useEffect(() => {
    if (edit.departure) {
      fetchAddress("departure", edit.departure);
    }

    if (edit.destination) {
      fetchAddress("destination", edit.destination);
    }
  }, [edit.departure, edit.destination]);

  const fetchAddress = async (addressType, addressValue) => {
    if (!addressValue) {
      return; // Trả về nếu order không tồn tại hoặc địa chỉ đã được lưu trữ
    }

    const matches = /lat:\s*([^,]+),\s*long:\s*([^,]+)/.exec(addressValue);
    if (matches && matches.length === 3) {
      const [, lat, lng] = matches;

      if (!isNaN(lat) && !isNaN(lng)) {
        console.log("lat"+lat,"lng"+lng)
        try {
          const response = await dispatch(getFormattedAddressGG({ lat, lng }));
          console.log(response.payload);
          const formattedAddress = response.payload.formattedAddress;
          setFormattedAddresses((prevAddresses) => ({
            ...prevAddresses,
            [addressType]: formattedAddress,
          }));
        } catch (error) {
          setLoading(false)
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
  const handleClick = () => {
    setCollapse(!collapse);
  };

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
      if (technicianData !== null && technicianData !== undefined) {
        const filteredTechnicians = technicianData.filter(
          (tech) => tech && tech.status === "ACTIVE"
        );
        setFilteredTechnicianData(filteredTechnicians);
      }
    } else if (selectedRescueType === "Towing") {
      if (vehicleData !== null && vehicleData !== undefined) {
        const filteredVehicles = vehicleData.filter(
          (vehicle) => vehicle && vehicle.status === "ACTIVE"
        );
        setFilteredVehicleData(filteredVehicles);
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
    if (selectedVehicle && vehicleData.length > 0) {
      const selectedVehicleId = selectedVehicle.id;
      const filteredVehicleDetails = vehicleData.find(
        (vehicle) => vehicle.id === selectedVehicleId
      );
      setVehicleDetails(filteredVehicleDetails);
    } else {
      setVehicleDetails(null);
    }
  }, [selectedVehicle, vehicleData]);
  useEffect(() => {
    if (vehicleDetails && vehicleDetails.rvoid) {
      // Lưu giữ giá trị rvoid mỗi khi vehicleDetails thay đổi
      const savedRvoid = vehicleDetails.rvoid;

      fetchRVO(savedRvoid);
    }
  }, [vehicleDetails]);

  useEffect(() => {
    if (accountId && !accountDeviceToken) {
      fetchAccounts(accountId);
    }
  }, [accountId, accountDeviceToken]);
  const fetchAccounts = (accountId) => {
    console.log(accountId);
    // Make sure you have a check to prevent unnecessary API calls
    if (accountId) {
      //lấy devices của account
      console.log("RovId off Account " + accountId);
      dispatch(getAccountId({ id: accountId }))
        .then((response) => {
          const dataAccount = response.payload.data;
          console.log(dataAccount.id);
          console.log("DeviceToken of Account " + dataAccount.deviceToken);
          if (dataAccount.deviceToken) {
            console.log(dataAccount.deviceToken);
            setAccountDeviceToken(dataAccount.deviceToken);
          } else {
            console.error("deviceToken not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data detail:", error);
        });
    }
  };
  const fetchRVO = (rovId) => {
    console.log(rovId);
    if (!fullnameRvo[rovId]) {
      dispatch(getRescueVehicleOwnerId({ id: rovId }))
        .then((response) => {
          const data = response.payload.data;
          const accountId = data.accountId;
          setAccountId(accountId);
          if (data && data.fullname) {
            console.log(data.fullname);
            setFullnameRvo((prevData) => ({
              ...prevData,
              [rovId]: data.fullname,
            }));
          } else {
            console.error("Fullname not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching customer data:", error);
        });
    }
  };
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
        if (vehicleData) {
          const activeManufacturers = vehicleData.filter(
            (item) => item.status === "ACTIVE"
          );

          setVehicleData(activeManufacturers);

          // Xác định selectedVehicle ban đầu
        } else {
          setVehicleData(false);
          toast.error("Vehicle response does not contain 'data'.");
        }
      } catch (error) {
        toast.error("Error while fetching vehicle data:", error);
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
            activeTechnicians.forEach((technician) => {
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
      setFilteredOrders(orders); 
    }
  }, [orders]);
  const handleSaveClick = () => {
    console.log("accountId" + accountId);
    if (!selectedEditOrder || !data) {
      toast.error("Không có thông tin khách hàng để cập nhật.");
      return;
    }
    const orderId = edit.id;
    const hasChanges =
      JSON.stringify(data) !== JSON.stringify(initialFormState);
    const message = {
      title: "Thông báo đơn hàng ",
      body: "Bạn có đơn hàng đã được điều phối tới bạn!!",
    };
    const messageCustomer = {
      title: "Thông báo đơn hàng!! ",
      body: "Hệ thống đã điều phối phương tiện cứu hộ phù hợp Bạn vui lòng đợi!!",
    };
   
    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      handleClose();
    } else {
      // Gửi yêu cầu cập nhật lên máy chủ, bao gồm vehicleId và orderId
      const requestData = {
        orderID: orderId,
        vehicleID: vehicleId,
        managerID: manager.id,fetchVehicle
      };
      dispatch(createAcceptOrder(requestData))
        .then(() => {
          if (vehicleData) {
            const updatedVehicleData = vehicleData.filter(
              (item) => item.id !== (selectedVehicle && selectedVehicle.id)
            );
            setVehicleData(updatedVehicleData);
          }
          toast.success("Điều phối nhân sự thành công.");
          setVehicleDetails(null);
          setSelectedVehicel(null);
          dispatch(fetchVehicle());
          console.log("accountDeviceToken: " + accountDeviceToken);
          const notificationData = {
            deviceId: accountDeviceToken,
            isAndroiodDevice: true,
            title: message.title,
            body: message.body,
            target: accountId,
            orderId: orderId,
          };
          dispatch(sendNotification(notificationData))
            .then(() => {
              toast.success("Gửi thông báo đến nhân sự thành công");
              const notificationData = {
                deviceId: accountDeviceTokenCustomer,
                isAndroiodDevice: true,
                title: messageCustomer.title,
                body: messageCustomer.body,
                target: accountIdCustomer, 
                orderId: orderId,
              };
         
              // Gửi thông báo bằng hàm sendNotification
              dispatch(sendNotification(notificationData))
                .then(() => {
                  toast.success("Gửi thông báo đến khách hàng thành công");
                })
                .catch((error) => {
                  toast.error("Lỗi khi gửi thông báo đến khách hàng!! vui lòng thử lại:", error);
                });
            })
            .catch((error) => {
              toast.error("Lỗi khi gửi thông báo đến nhân sự:", error);
            });
          handleClose();
          setIsSuccess(true);
          if (onDataUpdated) {
            onDataUpdated(); 
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
            fetchRVO(null);
            setAccountId(null);
            setAccountIdCustomer(null);
            setFilteredOrders(data);
            // Đặt loading thành false sau khi tải lại dữ liệu
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải lại danh sách đơn hàng:", error);
        });
    }
  };


  // When rescue type is changed, reset the state accordingly
  //get Full NameCustomer

  useEffect(() => {
    if (edit.carId && edit.carId !== carId) {
      setCarId(edit.carId);
      fetchCarOfCustomer(edit.carId);
    }
  }, [edit.carId, carId]);
  useEffect(() => {
    if (edit.customerId && edit.customerId !== customerId) {
      console.log(edit.customerId);
      setCustomerId(edit.customerId);
      fetchCustomerName(edit.customerId);
      fetchCarOfCustomer(edit.carId);
    }

    // Thêm điều kiện modelId vào useEffect
    if (
      dataCar[edit.carId]?.modelId &&
      dataCar[edit.carId]?.modelId !== modelId
    ) {
      setModelId(dataCar[edit.carId]?.modelId);
      fetchModelOfCar(dataCar[edit.carId]?.modelId); // Gọi hàm fetchModelOfCar với modelId mới
    }
  }, [edit.customerId, customerId, dataCar[edit.carId]?.modelId, modelId]);

  const fetchModelOfCar = (modelId) => {
    // Make sure you have a check to prevent unnecessary API calls
    if (modelId) {
      dispatch(getModelCarId({ id: modelId }))
        .then((response) => {
          const data = response.payload.data;

          setDataModel(data.model1);
          // if (data) {
          //   setDataModel((prevData) => ({
          //     ...prevData,
          //     [modelId]: data.model1,
          //   }));
          //   console.log("Data model1:", dataModel.model1);
          // } else {
          //   console.error("Service name not found in the API response.");
          // }
        })
        .catch((error) => {
          console.error("Error while fetching service data model:", error);
        });
    }
  };

  const fetchCustomerName = (customerId) => {
    console.log(customerId);
    // Make sure you have a check to prevent unnecessary API calls
    if (customerId) {
      dispatch(getCustomerId({ id: customerId }))
        .then((response) => {
          const data = response.payload.data;
          if (data) {
            console.log("data.accountId" + data.accountId);
              setAccountIdCustomer(data.accountId)
            setDataCustomer((prevData) => ({
              ...prevData,
              [customerId]: data,
            }));
            dispatch(getAccountId({ id: data.accountId }))
              .then((response) => {
                const data = response.payload.data;
                if (data) {
                  console.log("deviceToken off Customer" + data.deviceToken);

                  setAccountDeviceTokenCustomer(data.deviceToken);
                } else {
                  console.error("Account  not found in the API response.");
                }
              })
              .catch((error) => {
                console.error("Error while fetching account data:", error);
              });
          } else {
            console.error("Service name not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data:", error);
        });
    }
  };

  const fetchCarOfCustomer = (carId) => {
    // Make sure you have a check to prevent unnecessary API calls
    if (carId) {
      dispatch(getCarById({ id: carId }))
        .then((response) => {
          const data = response.payload.data;

          if (data) {
            setDataCar((prevData) => ({
              ...prevData,
              [carId]: data,
            }));
          } else {
            console.error("Service name not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data car:", error);
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

  // const fetchOrderDetail = (orderId) => {
  //   console.log(orderId);
  //   // Make sure you have a check to prevent unnecessary API calls
  //   if (orderId) {
  //     dispatch(getOrderDetailId({ id: orderId }))
  //       .then((response) => {
  //         const data = response.payload.data;
  //         if (data && Array.isArray(data)) {
  //           const serviceIds = data.map((item) => item.serviceId);

  //           // Tạo mảng promises để gọi API lấy thông tin từng serviceId
  //           const servicePromises = serviceIds.map((serviceId) => {
  //             return dispatch(getServiceId({ id: serviceId }))
  //               .then((serviceResponse) => {
  //                 const serviceName = serviceResponse.payload.data.name;
  //                 console.log(
  //                   `ServiceId: ${serviceId}, ServiceName: ${serviceName}`
  //                 );
  //                 return {
  //                   serviceId,
  //                   serviceName,
  //                 };
  //               })
  //               .catch((serviceError) => {
  //                 console.error(
  //                   `Error while fetching service data for serviceId ${serviceId}:`,
  //                   serviceError
  //                 );
  //                 return null;
  //               });
  //           });

  //           // Sử dụng Promise.all để chờ tất cả các promises hoàn thành
  //           Promise.all(servicePromises)
  //             .then((serviceData) => {
  //               // Truy cập serviceName đầu tiên trong danh sách dịch vụ
  //               const firstServiceName =
  //                 serviceData[0]?.serviceName || "Không có thông tin";

  //               // Cập nhật chỉ serviceName đầu tiên vào state
  //               setFirstServiceName(firstServiceName);
  //             })
  //             .catch((error) => {
  //               console.error(
  //                 "Error while processing service data promises:",
  //                 error
  //               );
  //             });
  //         } else {
  //           console.error(
  //             "Service data not found in the API response or data is not an array."
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error while fetching service data detail:", error);
  //       });
  //   }
  // };

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
            toast.error(
              "Không có dịch vụ"
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
  }/${date.getFullYear()} ${date.getHours() + 7}:${date.getMinutes()}`;

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
                          <Typography variant="h4" sx={{ marginBottom: 1 }}>
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
                                }}
                                InputProps={{
                                  readOnly: true, // If you don't want it to be editable, make it read-only
                                }}
                              />
                              <PersonRoundedIcon style={iconColor} />
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
                              marginTop: "4px",
                              marginRight: "2px",
                            }}
                          >
                            <CategoryIcon style={iconColor} />{" "}
                            <strong>Loại cứu hộ: </strong>{" "}
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
                              color={
                                edit.rescueType === "Towing"
                                  ? colors.redAccent[300]
                                  : colors.yellowAccent[700]
                              }
                            >
                              {edit.rescueType === "Towing" && <SupportIcon />}
                              {edit.rescueType === "Fixing" && <HandymanIcon />}
                              <Typography
                                color="black"
                                sx={{ fontWeight: "bold" }}
                              >
                                {edit.rescueType === "Towing"
                                  ? "Kéo Xe"
                                  : edit.rescueType === "Fixing"
                                  ? "Sữa Chữa Tại Chỗ"
                                  : edit.rescueType}
                              </Typography>
                            </Box>
                          </Typography>
                          <Typography
                            variant="body1"
                            component="p"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "4px", // Thêm khoảng cách dưới cùng của dòng
                              fontSize: "1rem",
                            }}
                          >
                            <WatchLaterRoundedIcon style={iconColor} />{" "}
                            <strong>Ngày tạo Đơn: </strong>
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
                            component="div"
                            sx={{
                              display: "flex",
                              marginBottom: "8px",
                              fontSize: "1rem",
                            }}
                          >
                            <PlaceIcon style={iconColor} />
                            <strong style={{ flexShrink: 0 }}>
                              Địa điểm xe hư:{" "}
                            </strong>{" "}
                            <Typography
                              variant="h5"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "22px",
                              }}
                            >
                              {formattedAddresses.departure || "Đang tải..."}
                            </Typography>
                          </Typography>

                          <Typography
                            variant="body1"
                            component="div"
                            sx={{
                              display: "flex",
                              fontSize: "1rem",
                            }}
                          >
                            <PlaceIcon style={iconColor} />{" "}
                            <strong
                              style={{
                                flexShrink: 0,
                              }}
                            >
                              Địa điểm kéo đến:
                            </strong>{" "}
                            <Tooltip title={edit.destination}>
                              <Typography
                                variant="h5"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: "4px",
                                }}
                              >
                                {formattedAddresses.destination ||
                                  "Đang tải..."}
                              </Typography>
                            </Tooltip>
                          </Typography>

                          <Typography
                            variant="h5"
                            sx={{
                              display: "none",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {" "}
                            {edit.carId}
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
                            <MapRoundedIcon style={iconColor} />{" "}
                            <strong>Khu vực: </strong>{" "}
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
                            <MarkChatUnreadRoundedIcon style={iconColor} />{" "}
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
                            <PaymentIcon style={iconColor} />{" "}
                            <strong>Phương Thức Thanh toán:</strong>{" "}
                            <Box
                              width="30%"
                              ml="4px"
                              p="2px"
                              display="flex"
                              justifyContent="center"
                              fontSize={10}
                              borderRadius={8}
                              backgroundColor={
                                dataOrder[edit.id]?.method === "Cash"
                                  ? colors.lightGreen[700]
                                  : colors.grey[800]
                                  ? colors.lightBlue[300]
                                  : dataOrder[edit.id]?.method === "Banking"
                              }
                              color={
                                dataOrder[edit.id]?.method === "Cash"
                                  ? colors.lightGreen[300]
                                  : colors.yellowAccent[700] &&
                                    dataOrder[edit.id]?.method === "Banking"
                                  ? colors.lightBlue[700]
                                  : colors.yellowAccent[700]
                              }
                            >
                              <Typography
                                color="white"
                                sx={{ fontWeight: "bold" }}
                              >
                                {dataOrder[edit.id]?.method === "Cash"
                                  ? "Tiền mặt"
                                  : dataOrder[edit.id]?.method === "Banking"
                                  ? "Chuyển khoản"
                                  : "Đang tải..."}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h5"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "10px",
                              }}
                            ></Typography>
                          </Typography>

                          {/* List all servicers choose */}

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
                        setTechnicianDetails(null);
                        setAccountId(null);
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
                            renderOption={(option) => (
                              <div key={option.id}>
                                <Avatar
                                  src={option.avatar}
                                  alt={option.fullname}
                                  sx={{ marginRight: "10px" }}
                                />
                                {option.fullname}
                                </div>
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
                                      <PersonRoundedIcon style={iconColor} />
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
                                      <PlaceIcon style={iconColor} />
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
                                      <PhoneRoundedIcon style={iconColor} />
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
                                    <CheckCircleRoundedIcon style={iconColor} />
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
                                      marginBottom: 1, // Thêm khoảng cách dưới cùng cho mỗi Box
                                    }}
                                  >
                                    <PersonRoundedIcon style={iconColor} />
                                    <Typography variant="body1">
                                      Tên Chủ Xe:{" "}
                                      {fullnameRvo[vehicleDetails.rvoid]}
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
                                    <SourceRoundedIcon style={iconColor} />
                                    <Typography variant="body1">
                                      Biển số xe: {vehicleDetails.vinNumber}
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
                                    <ReceiptRoundedIcon style={iconColor} />
                                    <Typography variant="body1">
                                      Mã xe:{vehicleDetails.licensePlate}
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
                                    <CategoryRounded style={iconColor} />
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
                                    <TimeToLeaveIcon style={iconColor} />
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
                                    <CalendarTodayIcon style={iconColor} />
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
              <CardActions className="card-action-dense">
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button onClick={handleClick}>Thông tin xe khách hàng</Button>
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
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      {" "}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <PersonRoundedIcon style={iconColor} />
                            <Typography variant="h6">
                              <strong> Tên Chủ Xe: </strong>
                              {dataCustomer[edit.customerId]?.fullname ||
                                "Đang tải..."}
                            </Typography>
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                            }}
                          >
                            {" "}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <ReceiptRoundedIcon style={iconColor} />
                            <Typography variant="h6">Biển Số: </Typography>
                            {dataCar[edit.carId]?.licensePlate || "Đang tải..."}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <TimeToLeaveIcon style={iconColor} />
                            <Typography variant="h6">Hãng Xe: </Typography>
                            {dataCar[edit.carId]?.manufacturer || "Đang tải..."}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CategoryRounded style={iconColor} />
                            <Typography variant="h6">Loại Xe: </Typography>
                            {dataModel || "Đang tải..."}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarTodayIcon style={iconColor} />
                            <Typography variant="h6">Năm: </Typography>
                            {dataCar[edit.carId]?.manufacturingYear ||
                              "Đang tải..."}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <ColorLensIcon style={iconColor} />
                            <Typography variant="h6">Màu: </Typography>
                            {dataCar[edit.carId]?.color || "Đang tải..."}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={8}>
                      {" "}
                      <Box sx={{ flex: 1 }}>
                        <img
                          src={
                            dataCar[edit.carId]?.image ||
                            "https://firebasestorage.googleapis.com/v0/b/car-rescue-399511.appspot.com/o/admin%2Fdefault-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.avif?alt=media&token=e03ee650-5571-430d-8e6b-5146638e8184"
                          }
                          alt="Hình Ảnh Của Xe"
                          style={{
                            width: "200px",
                            height: "200px",
                            border: "2px solid #000",
                            objectFit: "cover",
                          }}
                          onClick={() => setShowModal(true)}
                          title="Nhấp để xem ảnh rõ hơn"
                        />

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
                                dataCar[edit.carId]?.image ||
                                "https://firebasestorage.googleapis.com/v0/b/car-rescue-399511.appspot.com/o/admin%2Fdefault-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.avif?alt=media&token=e03ee650-5571-430d-8e6b-5146638e8184"
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
                      </Box>{" "}
                    </Grid>
                  </Grid>
                </CardContent>
              </Collapse>

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
