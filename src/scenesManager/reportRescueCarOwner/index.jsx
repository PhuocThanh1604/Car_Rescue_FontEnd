import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  TextField,
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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TimerIcon from "@mui/icons-material/Timer";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import {
  acceptReport,
  getReportAllNew,
  getReportById,
  getRescueVehicleOwnerId,
} from "../../redux/rescueVehicleOwnerSlice";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PlaceIcon from "@mui/icons-material/Place";
import CustomTablePagination from "../../components/TablePagination";
import { tokens } from "../../theme";
import { sendNotification } from "../../redux/orderSlice";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const Reports = (props) => {
  const dispatch = useDispatch();
  const rescueVehicleOwners = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const iconColor = { color: colors.blueAccent[500] };
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Type");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedEditVehicle, setSelectedEditVehicle] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
  //img
  const imageWidth = "400px";
  const imageHeight = "300px";

  const [activeStep, setActiveStep] = React.useState(0);
  // const maxSteps = images.length;
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
      console.log(orderId);
      dispatch(getReportById({ id: orderId }))
        .then((response) => {
          const data = response.payload.data;
          console.log(data);
          if (data) {
            setVehicleId(data.id);
            setVehicleDetail(data);
            // fetchRescueVehicleOwner(data.rvoid)
            setOpenConfirmModal(true);
            // reloadVehicle();
          } else {
            console.error("Service name not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data:", error);
        });
    }
  };

  //Hủy đăng kí xe
  const handleCancel = () => {
    // Đóng modal và đặt lại orderId
    setOpenConfirmModal(false);
    setVehicleId(null);
  };

  //Reload data after accept resgistration vehicle

  const reloadVehicle = () => {
    dispatch(getReportAllNew())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setFilteredVehicles(data);

          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
          console.log("Services reloaded:", data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách báo cáo:", error);
      });
  };
  //Chấp nhận order
  const handleAcceptOrderClick = (vehicleId, accept) => {
    console.log(vehicleId);
    setIsAccepted(accept);
    console.log(accept);
    const messageAccept = {
      title: "Hệ thống đã ghi nhận báo cáo đơn hàng của bạn!!",
      body: "Hệ thống sẽ phản hồi đến quí khách thời gian sớm nhất",
    };
    const messageRejected = {
      title: "Hệ thống Không chấp nhận đơn báo cáo đơn hàng của bạn!!",
      body: "Xin lỗi!! Bạn báo cáo của bạn không đủ điều kiện!!",
    };
    // Fetch the VehicleId details based on the selected Vehicle ID
    dispatch(acceptReport({ id: vehicleId, boolean: accept }))
      .then(() => {
        const updatedVehicles = filteredVehicles.filter(
          (vehicle) => vehicle.id !== vehicleId
        );
        setFilteredVehicles(updatedVehicles);
        setVehicleId(vehicleId);
        setOpenConfirmModal(false);
        setIsSuccess(true);
      
        if (accept) {
          toast.success("Chấp nhận đơn báo cáo thành công");
          const notificationData = {
            deviceId:
            "",
            isAndroiodDevice: true,
            title: messageAccept.title,
            body: messageAccept.body,
          };
  
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
          const notificationData = {
            deviceId:
            "",
            isAndroiodDevice: true,
            title: messageRejected.title,
            body: messageRejected.body,
          };
  
          // Gửi thông báo bằng hàm sendNotification
          dispatch(sendNotification(notificationData))
            .then((res) => {
              if (res.payload.message === "Notification sent successfully")
                toast.success("Gửi thông báo đến khách hàng thành công");
              console.log("Gửi thông báo thành công");
            })
            .catch((error) => {
              toast.error("Gửi thông báo đến khách hàng không thành công!!");
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

  const handleSearchChange = (event) => {
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "type") {
      // Hiển thị tất cả các trạng thái
      setFilteredVehicles(rescueVehicleOwners); // Sử dụng dữ liệu gốc khi không lọc
    } else {
      // Lọc dữ liệu gốc dựa trên giá trị trạng thái
      const filteredVehicles = rescueVehicleOwners.filter(
        (vehicle) => vehicle.type === selectedStatusOption
      );
      setFilteredVehicles(filteredVehicles);
    }
  };
  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      // Format startDate and endDate to the beginning of the day in the specified time zone
      const formattedStartDate = moment(startDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");
      const formattedEndDate = moment(endDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");

      const filteredOrders = rescueVehicleOwners.filter((order) => {
        // Adjust the order createdAt date to the same time zone
        const orderDate = moment(order.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .startOf("day");

        const isAfterStartDate = orderDate.isSameOrAfter(
          formattedStartDate,
          "day"
        );
        const isBeforeEndDate = orderDate.isSameOrBefore(
          formattedEndDate,
          "day"
        );

        return isAfterStartDate && isBeforeEndDate;
      });

      setFilteredVehicles(filteredOrders);
      setFilterOption("Date");
    } else {
      setFilteredVehicles(rescueVehicleOwners);
    }
  };
  useEffect(() => {
    if (Array.isArray(rescueVehicleOwners)) {
      const vehicleId = rescueVehicleOwners.id; // Xem xét lại điều này, có vẻ như vehicles.id không đúng
      const vehicleToEdit = rescueVehicleOwners.find(
        (vehicle) => vehicle.id === vehicleId
      );

      if (vehicleToEdit) {
        setEditStatus(vehicleToEdit);
        setInitialFormState(vehicleToEdit);
      }
    }
  }, [rescueVehicleOwners]);

  // Thay đổi hàm useEffect để lọc từ dữ liệu gốc
  useEffect(() => {
    if (Array.isArray(rescueVehicleOwners)) {
      const filteredVehicles = rescueVehicleOwners.filter((vehicle) => {
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
  }, [rescueVehicleOwners, searchText, filterOption]);

  useEffect(() => {
    dispatch(getReportAllNew())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          console.log(data);
          setData(data);
          setFilteredVehicles(data);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
    // Hiển thị hình ảnh đã chọn hoặc thực hiện một hành động khác ở đây
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVehiclePagination = filteredVehicles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    {
      field: "id",
      headerName: "id",
      width: 100,
      key: "id",
    },
    {
      field: "orderId",
      headerName: "orderId",
      width: 100,
      key: "orderId",
    },
    {
      field: "createdAt",
      headerName: "Ngày Tạo Đơn",
      width: 140,
      key: "createdAt",
      valueGetter: (params) =>
        moment(params.row.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .format("DD-MM-YYYY HH:mm:ss"),
    },
    { field: "content", headerName: "Nội Dung", width: 140, key: "content" },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 100,
      key: "status",
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="auto"
            p="4px"
            m="0 auto"
            display="flex"
            justifyContent="center"
            borderRadius={2}
            backgroundColor={
              status === "NEW"
                ? colors.greenAccent[700]
                : status === "ASSIGNED"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === "COMPLETED"
            }
            color={
              status === "NEW"
                ? colors.greenAccent[300]
                : colors.yellowAccent[700]
            }
          >
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
              {status}
            </Typography>
          </Box>
        );
      },
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
      headerName: "Chấp nhận xe ",
      width: 120,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => handleConfirm(params.row.id)}
        >
          <CheckCircleOutlineIcon
            variant="contained"
            style={{ color: "green" }} // Set the color to green
          />
        </IconButton>
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
        <Box display="flex" alignItems="center" className="startDate-box">
          <TextField
            label="Từ ngày"
            type="date"
            value={startDate || ""}
            onChange={(event) => {
              setStartDate(event.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleDateFilterChange}
            inputProps={{
              max: moment()
                .tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
                .add(7, "hours") // Adding 3 hours (you can adjust this number as needed)
                .format("DD-MM-YYYY"), // Set the maximum selectable date as today
            }}
            sx={{ ml: 4, mr: 2 }}
          />
        </Box>

        <Box display="flex" alignItems="center" className="endtDate-box">
          <TextField
            label="Đến ngày"
            type="date"
            value={endDate || ""}
            onChange={(event) => {
              setEndDate(event.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleDateFilterChange}
            inputProps={{
              max: moment()
                .tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
                .add(7, "hours") // Adding 3 hours (you can adjust this number as needed)
                .format("DD-MM-YYYY"), // Set the maximum selectable date as today
            }}
          />
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

      <ToastContainer />
      <Dialog
        open={openConfirmModal}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            width: "600px", // Set your desired maximum width
            height: "500px", // Set your desired maximum height
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: "indigo", fontSize: "24px", textAlign: "center" }}
        >
          Đơn Báo Cáo Từ Khách Hàng
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                        onClick={() => handleImageClick(vehicleDetail.image2)}
                      >
                        <img
                          src={vehicleDetail.image2}
                          alt="Car Back"
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
                          <ReceiptRoundedIcon style={iconColor} />
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
                              width: "150px",
                              borderRadius: "5px",
                            }}
                          >
                            {vehicleDetail.status || "Không có thông tin"}
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

export default Reports;
