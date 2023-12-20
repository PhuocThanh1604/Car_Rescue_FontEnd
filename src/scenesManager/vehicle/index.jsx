import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Grid,
  styled,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import ModalEdit from "./ModalEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { CategoryRounded } from "@mui/icons-material";
import {
  createAcceptRegisterVehicle,
  fetchVehicleWatting,
  getVehicleId,
} from "../../redux/vehicleSlice";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TimerIcon from "@mui/icons-material/Timer";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { getRescueVehicleOwnerId } from "../../redux/rescueVehicleOwnerSlice";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PlaceIcon from "@mui/icons-material/Place";
import CustomTablePagination from "../../components/TablePagination";
import { tokens } from "../../theme";
import { sendNotification } from "../../redux/orderSlice";
import { getAccountId } from "../../redux/accountSlice";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Vehicles = (props) => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const iconColor = { color: colors.blueAccent[500] };
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Type");
  const [selectedEditVehicle, setSelectedEditVehicle] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fullnameDataRvo, setFullnameDataRvo] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [initialFormState, setInitialFormState] = useState({});
  const [editStatus, setEditStatus] = useState({});
  const [vehicleId, setVehicleId] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [detailedData, setDetailedData] = useState(null);
  const [vehicleDetail, setVehicleDetail] = useState({});
  const [collapse, setCollapse] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataRescueVehicleOwner, setDataRescueVehicleOwner] = useState({});
  const [accountId, setAccountId] = useState("");
  const [accountDeviceToken, setAccountDeviceToken] = useState("");
  const imageWidth = "400px";
  const imageHeight = "300px";
  const CustomButton = styled(Box)({
    backgroundColor: colors.lightGreen[300],
    borderRadius:"10px",
    padding:"2px",
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: colors.lightGreen[500], // Màu sẽ thay đổi khi hover
      cursor: 'pointer',
      borderRadius:"10px"
    },
  });
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
  const fetchRescueVehicleOwner = (vehicleRvoidId) => {
    console.log(vehicleRvoidId);
    // Make sure you have a check to prevent unnecessary API calls
    if (vehicleRvoidId) {
      dispatch(getRescueVehicleOwnerId({ id: vehicleRvoidId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          const accountId = data.accountId;
          setAccountId(accountId);
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

  const [activeStep, setActiveStep] = React.useState(0);
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const handleClick = () => {
    setCollapse(!collapse);
  };

  const handleConfirm = (orderId) => {
    console.log(orderId);
    // Make sure you have a check to prevent unnecessary API calls
    if (orderId) {
      dispatch(getVehicleId({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data) {
            setVehicleId(data.id);
            setVehicleDetail(data);
            fetchRescueVehicleOwner(data.rvoid);
            setOpenConfirmModal(true);
            reloadVehicle();
          } else {
            console.error("Service name not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data:", error);
        });
    }
  };

  const handleCancel = () => {
    setOpenConfirmModal(false);
    setVehicleId(null);
  };


  const reloadVehicle = () => {
    dispatch(fetchVehicleWatting())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setFilteredVehicles(data);
          setLoading(false);
          console.log("Services reloaded:", data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách xe cứu hộ:", error);
      });
  };
  //Chấp nhận order
  const handleAcceptOrderClick = (vehicleId, accept) => {
    console.log(vehicleId);
    setIsAccepted(accept);
    console.log(accept);
    const messageAccept = {
      title: "Chấp nhận đơn đăng kí",
      body: "Chúc mừng xe của bạn đã đủ điều kiện vào hệ thống",
    };
    const messageRejected = {
      title: "Không chấp nhận đơn đăng kí ",
      body: "Xin lỗi!! xe của bạn không đủ điều kiện vào hệ thống!!",
    };
    dispatch(createAcceptRegisterVehicle({ id: vehicleId, boolean: accept }))
      .then(() => {
        const updatedFilteredVehicles = filteredVehicles.filter(
          (vehicle) => vehicle.id !== vehicleId
        );
        setFilteredVehicles(updatedFilteredVehicles);
        setVehicleId(vehicleId);
        setOpenConfirmModal(false);
        setIsSuccess(true);
        reloadVehicle();
        if (accept) {
          toast.success("Chấp nhận xe thành công.");
          const notificationData = {
            deviceId: accountDeviceToken,
            isAndroiodDevice: true,
            title: messageAccept.title,
            body: messageAccept.body,
            target:vehicleId
          };
            console.log("notificationData Test Accept : "+notificationData)
          // Gửi thông báo bằng hàm sendNotification
          dispatch(sendNotification(notificationData))
            .then((res) => {
              if (res.payload.message === "Notification sent successfully")
                toast.success("Gửi thông báo thành công");
              console.log("Gửi thông báo thành công");
            })
            .catch((error) => {
              toast.error("Gửi thông không thành công vui lòng thử lại!!");
              console.error("Lỗi khi gửi thông báo:", error);
            });
        } else {
          toast.error("Không đồng chấp nhận xe vào hệ thống ");
          setVehicleId(vehicleId);
          setOpenConfirmModal(false);
          setIsSuccess(true);
          reloadVehicle();
          const notificationData = {
            deviceId: accountDeviceToken,
            isAndroiodDevice: true,
            title: messageRejected.title,
            body: messageRejected.body,
            target:vehicleId
          };
         console.log(notificationData)
          dispatch(sendNotification(notificationData))
            .then((res) => {
              if (res.payload.message === "Notification sent successfully")
                toast.success("Gửi thông báo thành công");
              console.log("Gửi thông báo thành công");
            })
            .catch((error) => {
              toast.error("Gửi thông không thành công vui lòng thử lại!!");
              console.error("Lỗi khi gửi thông báo:", error);
            });
        }
      })
      .catch((error) => {
        console.error(
          "Lỗi khi lấy thông tin đơn hàng mới:",
          error.status || error.message
        );
      });
  };

  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);
  const handleSearchChange = (event) => {
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "type") {
      // Hiển thị tất cả các trạng thái
      setFilteredVehicles(vehicles); // Sử dụng dữ liệu gốc khi không lọc
    } else {
      // Lọc dữ liệu gốc dựa trên giá trị trạng thái
      const filteredVehicles = vehicles.filter(
        (vehicle) => vehicle.type === selectedStatusOption
      );
      setFilteredVehicles(filteredVehicles);
    }
  };

  useEffect(() => {
    if (Array.isArray(vehicles)) {
      const vehicleId = vehicles.id; // Xem xét lại điều này, có vẻ như vehicles.id không đúng
      const vehicleToEdit = vehicles.find(
        (vehicle) => vehicle.id === vehicleId
      );

      if (vehicleToEdit) {
        setEditStatus(vehicleToEdit);
        setInitialFormState(vehicleToEdit);
      }
    }
  }, [vehicles]);

  // Thay đổi hàm useEffect để lọc từ dữ liệu gốc
  useEffect(() => {
    if (Array.isArray(vehicles)) {
      const filteredVehicles = vehicles.filter((vehicle) => {
        const nameMatch =
          vehicle.vinNumber &&
          vehicle.vinNumber.toLowerCase().includes(searchText.toLowerCase());
        const filterMatch =
          filterOption === "Type" ||
          (filterOption === "Xe cẩu" && vehicle.type === "Xe cẩu") ||
          (filterOption === "Xe chở" && vehicle.type === "Xe chở") ||
          (filterOption === "Xe kéo" && vehicle.type === "Xe kéo");
        return nameMatch && filterMatch;
      });
      setFilteredVehicles(filteredVehicles);
    } else {
      setFilteredVehicles([]);
    }
  }, [vehicles, searchText, filterOption]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVehicleWatting())
      .then((response) => {
        try {
          if (!response.payload || !response.payload.data) {
            setLoading(false);
            return;
          }
  
          const data = response.payload.data;
          setData(data);
          setFilteredVehicles(data);
          setDetailedData(data);
          setLoading(false); 
          
          data.forEach((item) => {
            fetchFullnameRvo(item.rvoid);
          });
        } catch (error) {
          console.error("Error while processing data:", error);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error while fetching vehicle data:", error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, [dispatch]);
  
  const fetchFullnameRvo = (rvoId) => {
    if (rvoId) {
      dispatch(getRescueVehicleOwnerId({ id: rvoId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data.fullname)
          
          if (data && data.fullname) {
           
            setFullnameDataRvo((prevData) => ({
              ...prevData,
              [rvoId]: data.fullname,
            }));
            
     
          } else {
            console.error("Fullname not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching customer data:", error);
        });
    }
    // You can use your existing code to fetch the fullname
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVehiclePagination = filteredVehicles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    {
      field: "fullname",
      headerName: "Tên chủ xe",
      width: 120,
      valueGetter: (params) => fullnameDataRvo[params.row.rvoid] || 'Loading...', // Get fullname from fullnameDataRvo based on rvoId
      key: "fullname",
    },
    {
      field: "manufacturer",
      headerName: "Hiệu xe",
      width: 100,
      key: "manufacturer",
    },
    {
      field: "vinNumber",
      headerName: "Số khung",
      width: 100,
      key: "vinNumber",
    },
    {
      field: "licensePlate",
      headerName: "Biển số xe",
      width: 100,
      key: "licensePlate",
    },

    { field: "type", headerName: "Loại Xe", width: 140, key: "type" },
    {
      field: "manufacturingYear",
      headerName: "Năm sản xuất",
      width: 120,
      key: "manufacturingYear",
    },
    {
      field: "image",
      headerName: "Hình ảnh",
      width: 120,
      renderCell: (params) => {
        const avatarSrc =
          params.value ||
          "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"; // Đặt URL của hình mặc định ở đây
        return (
          <img
            src={avatarSrc}
            alt="Hình ảnh"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%", // Tạo hình tròn
            }}
          />
        );
      },
    },

    {
      field: "acceptOrder",
      headerName: "Chấp nhận",
      width: 140,
      renderCell: (params) => (
        <CustomButton
          onClick={() => handleConfirm(params.row.id)}
        >
            <Typography
              variant="body1"
              color="error"
              sx={{ fontWeight: "bold",  color: "green" }}
              onClick={() => handleConfirm(params.row.id)}
            >
              {"Chấp Nhận Đơn"}
            </Typography>
        </CustomButton>
      ),
      key: "acceptOrder",
    },
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header
        title="Danh Sách Xe Cứu Hộ"
        subtitle="Danh sách xe cứu hộ chờ duyệt"
      />
      <Box display="flex" className="box" left={0}>
        <Box
          display="flex"
          borderRadius="6px"
          border={1}
          marginRight={2}
          marginLeft={2}
          width={500}
        >
          <InputBase
            sx={{ ml: 4, flex: 1 }}
            placeholder="Tìm kiếm"
            onChange={handleSearchChange}
            className="search-input"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <ToastContainer />
        <Box display="flex" alignItems="center" className="filter-box">
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOption}
              onChange={handleFilterChange}
              variant="outlined"
              className="filter-select"
            >
              <MenuItem key="type-all" value="Type">
                Loại Xe
              </MenuItem>
              <MenuItem key="type-crane" value="Xe kéo">
                Xe Kéo
              </MenuItem>
              <MenuItem key="type-towing" value="Xe chở">
                Xe chở
              </MenuItem>
              <MenuItem key="type-towing" value="Xe cẩu">
                Xe Cẩu
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box
        m="10px 0 0 0"
        height="auto"
        sx={{
          fontSize: "20px",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.orange[50],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.white[50],
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-row": {
            borderBottom: "none",
          },
        }}
      >
        <DataGrid
          rows={filteredVehiclePagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />

        <CustomTablePagination
          count={filteredVehicles.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
        />
      </Box>

      <ModalEdit
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedEditRescuseVehicleOwner={selectedEditVehicle}
        onClose={() => setOpenEditModal(false)}
        loading={loading}
      />
      <ToastContainer />
      <Dialog
        open={openConfirmModal}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            width: "600px", // Set your desired maximum width
            height: "700px", // Set your desired maximum height
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: "indigo", fontSize: "24px", textAlign: "center" }}
        >
          Xác nhận đăng kí vào hệ hống
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {vehicleDetail ? (
              <div>
                <Card>
                  <CardMedia>
                    <AutoPlaySwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={activeStep}
                      onChangeIndex={handleStepChange}
                      enableMouseEvents
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                        onClick={() =>
                          handleImageClick(vehicleDetail.carRegistrationBack)
                        }
                      >
                        <img
                          src={vehicleDetail.carRegistrationBack}
                          alt="Car Back"
                          style={{
                            width: imageWidth,
                            height: imageHeight,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={vehicleDetail.carRegistrationFont}
                          alt="Car Front"
                          style={{
                            width: imageWidth,
                            height: imageHeight,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={vehicleDetail.image}
                          alt="Car Front"
                          style={{
                            width: imageWidth,
                            height: imageHeight,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </AutoPlaySwipeableViews>
                  </CardMedia>

                  <Divider light />
                  <Grid container spacing={2} alignItems="stretch">
                    <Grid item xs={5} alignItems="center">
                      <CardContent>
                        <Typography
                          variant="h5"
                          sx={{ marginBottom: "4px", textAlign: "center" }}
                        >
                          Thông tin chủ xe
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1, // Khoảng cách giữa icon và văn bản
                          }}
                        >
                          <PersonRoundedIcon style={iconColor} />
                          <Typography variant="h6">
                            <strong>Chủ xe: </strong>{" "}
                            {dataRescueVehicleOwner[vehicleDetail.rvoid]
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
                          <PhoneRoundedIcon style={iconColor} />
                          <Typography variant="h6">
                            <strong>SĐT: </strong>{" "}
                            {dataRescueVehicleOwner[vehicleDetail?.rvoid]
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
                          <PeopleAltRoundedIcon style={iconColor} />
                          <Typography variant="h6">
                            <strong>Giới tính: </strong>{" "}
                            {dataRescueVehicleOwner[vehicleDetail?.rvoid]
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
                          <PlaceIcon style={iconColor} />
                          <Typography variant="h6">
                            <strong>Địa chỉ: </strong>{" "}
                            {dataRescueVehicleOwner[vehicleDetail?.rvoid]
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
                            <strong>Khu vực: </strong>{" "}
                            {dataRescueVehicleOwner[vehicleDetail?.rvoid]
                              ?.area || "Chưa cập nhật"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider orientation="vertical" sx={{ height: "100%" }} />
                    </Grid>
                    <Grid item xs={5} alignItems="center">
                      <CardContent>
                        <Typography
                          variant="h5"
                          sx={{ marginBottom: "4px", textAlign: "center" }}
                        >
                          Thông tin xe
                        </Typography>

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
                            {vehicleDetail.licensePlate || "Không có thông tin"}
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
                            {vehicleDetail.type || "Không có thông tin"}
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
                            Đời xe:{" "}
                            {vehicleDetail.manufacturingYear ||
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
                            Hãng xe:{" "}
                            {vehicleDetail.manufacturer || "Không có thông tin"}
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
                            {vehicleDetail.vinNumber || "Không có thông tin"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1, // Khoảng cách giữa các phần tử
                          }}
                        >
                          <TimerIcon style={iconColor} />
                          <Typography variant="h6">Trạng Thái: </Typography>
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center", // Canh giữa theo chiều dọc
                              background: "yellow",
                              color: "black",
                              borderRadius: "5px",
                              fontWeight: "bold",
                            }}
                          >
                            {vehicleDetail.status === "WAITING_APPROVAL"
                              ? "Chờ Xét Duyệt"
                              : vehicleDetail.status || "Không có thông tin"}
                          </Box>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </div>
            ) : (
              "Loading..."
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} color="primary" variant="contained">
            Hủy
          </Button>
          <Button
            onClick={() => handleAcceptOrderClick(vehicleId, true)} // Pass true for "Đồng Ý"
            color="secondary"
            variant="contained"
          >
            Đồng Ý
          </Button>
          <Button
            onClick={() => handleAcceptOrderClick(vehicleId, false)} // Pass false for "Không Đồng Ý"
            color="primary"
            variant="contained"
          >
            Không Đồng Ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicles;
