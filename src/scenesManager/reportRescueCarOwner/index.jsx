import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  TextField,
  IconButton,
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
  Avatar,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PlaceIcon from "@mui/icons-material/Place";
import CustomTablePagination from "../../components/TablePagination";
import { tokens } from "../../theme";
import { getOrderId, sendNotification } from "../../redux/orderSlice";
import DescriptionIcon from "@mui/icons-material/Description";
import { getCustomerId } from "../../redux/customerSlice";
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
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [orderId, setOrderId] = useState("");
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
  const [dataOrderDetail, setDataOrderDetail] = useState({});
  const [vehicleDetail, setVehicleDetail] = useState({});
  const [dataCustomer, setDataCustomer] = useState({});

  const [collapse, setCollapse] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataRescueVehicleOwner, setDataRescueVehicleOwner] = useState({});
  const CustomButton = styled(Box)({
    backgroundColor: colors.lightGreen[300],
    borderRadius: "10px",
    padding: "2px",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: colors.lightGreen[500], // Màu sẽ thay đổi khi hover
      cursor: "pointer",
      borderRadius: "10px",
    },
  });
  const imageWidth = "400px";
  const imageHeight = "300px";

  const [activeStep, setActiveStep] = React.useState(0);
  // const maxSteps = images.length;
  const handleStepChange = (step) => {
    setActiveStep(step);
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
  const handleConfirm = (reportId) => {
    console.log(reportId);
    // Make sure you have a check to prevent unnecessary API calls
    if (reportId) {
      console.log(reportId);
      dispatch(getReportById({ id: reportId }))
        .then((response) => {
          const dataReport = response.payload.data;
          console.log(dataReport);
          if (dataReport) {
            setVehicleId(dataReport.id);
            setVehicleDetail(dataReport);

            // Pass orderId to fetchOrderDetail function
            fetchOrderDetail(dataReport.orderId);

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

  const fetchOrderDetail = (orderId) => {
    console.log(orderId);
    // Make sure you have a check to prevent unnecessary API calls
    if (orderId) {
      // Change the condition to ensure orderId exists
      dispatch(getOrderId({ id: orderId }))
        .then((response) => {
          const dataOrder = response.payload.data;
          setDataOrderDetail(dataOrder);
          console.log(dataOrder);
          if (dataOrder.customerId) {
            dispatch(getCustomerId({ id: dataOrder.customerId }))
              .then((response) => {
                const dataCustomer = response.payload.data;
                setDataCustomer(dataCustomer);
              })
              .catch((error) => {
                console.error("Error while fetching service data:", error);
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

  //Hủy đăng kí xe
  const handleCancel = () => {
    // Đóng modal và đặt lại orderId
    setOpenConfirmModal(false);
    setVehicleId(null);
  };

  let formattedDateStart = "Không có thông tin";
  let formattedDateEnd = "Không có thông tin";
  let formattedDateCreated = "Không có thông tin";

  if (
    dataOrderDetail &&
    dataOrderDetail.startTime &&
    dataOrderDetail.endTime &&
    dataOrderDetail.createdAt
  ) {
    const dateStart = moment(dataOrderDetail.startTime)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .format("DD/MM/YYYY HH:mm");

    const dateEnd = moment(dataOrderDetail.endTime)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .format("DD/MM/YYYY HH:mm");

    const dateCreated = moment(dataOrderDetail.createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .format("DD/MM/YYYY HH:mm");

    formattedDateStart =
      dateStart !== "Invalid date" ? dateStart : "Không có thông tin";
    formattedDateEnd =
      dateEnd !== "Invalid date" ? dateEnd : "Không có thông tin";
    formattedDateCreated =
      dateCreated !== "Invalid date" ? dateCreated : "Không có thông tin";
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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
        } else {
          toast.error("Không đồng chấp nhận xe vào hệ thống ");
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
    const value = event.target.value || "";
    setSearchText(value);
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "type") {
      // Hiển thị tất cả các trạng thái
      setFilteredVehicles(rescueVehicleOwners);
    } else {
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
        // Kiểm tra xem 'response.payload' và 'response.payload.data' có tồn tại không
        if (response.payload && response.payload.data) {
          const data = response.payload.data;
          console.log(data);
          setData(data);
          console.log(data);
          setFilteredVehicles(data);
        } else {
          // Xử lý tình huống khi không có dữ liệu
          toast.dismiss("Không có dữ liệu từ phản hồi");
        }
      })
      .catch((error) => {
        // Xử lý lỗi ở đây
        toast.dismiss("Lỗi khi lấy dữ liệu báo cáo:", error);
      })
      .finally(() => {
        setLoading(false); // Đặt trạng thái loading thành false
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
      headerName: "reportId",
      width: 100,
      key: "id",
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
      headerName: "Chấp Nhận Đơn ",
      width: 120,
      renderCell: (params) => (
        <CustomButton onClick={() => handleConfirm(params.row.id)}>
          <Typography
            variant="body1"
            color="error"
            sx={{ fontWeight: "bold", color: "green" }}
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
        title="Danh Sách Đơn Báo Cáo"
        subtitle="Danh sách đơn báo cáo chờ duyệt"
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
                .tz("Asia/Ho_Chi_Minh")
                .add(7, "hours")
                .format("DD-MM-YYYY"),
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
            height: "700px", // Set your desired maximum height
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "indigo",
            fontSize: "24px",
            textAlign: "center",
            fontWeight: "bold",
          }}
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
                    <Grid item xs={4}>
                      <CardContent>
                        <Typography
                          variant="h5"
                          sx={{
                            marginBottom: "4px",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Thông tin chủ xe
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
                              dataCustomer.avatar || "URL mặc định của avatar"
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
                          <PersonRoundedIcon style={iconColor} />
                          <Typography variant="h6">
                            <strong>Tên chủ xe: </strong>{" "}
                            {dataCustomer.fullname || "Không có thông tin"}
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
                            <strong>SĐT: </strong>{" "}
                            {dataCustomer.phone || "Không có thông tin"}
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
                            {dataCustomer.sex || "Không có thông tin"}
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
                            {dataCustomer.address || "Không có thông tin"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Grid>

                    <Grid item xs={1}>
                      <Divider orientation="vertical" sx={{ height: "100%" }} />
                    </Grid>

                    <Grid item xs={7}>
                      <Typography
                        variant="h5"
                        sx={{
                          marginTop: "10px",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Thông tin đơn hàng
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1, // Khoảng cách giữa các phần tử
                        }}
                      >
                        <TimerIcon style={iconColor} />
                        <strong> Thời gian tạo đơn:</strong>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            padding: "4px",
                            borderRadius: "4px",
                            marginLeft: "4px",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                            flex: 1,
                          }}
                        >
                          {formattedDateCreated || "Đang cập nhật"}
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
                        <strong>Thời gian bắt đầu: </strong>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            padding: "4px",
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
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1, // Khoảng cách giữa các phần tử
                        }}
                      >
                        <TimerIcon style={iconColor} />
                        <strong>Thời gian kết thúc: </strong>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            padding: "4px",
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
                      </Box>
                    
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1, // Khoảng cách giữa các phần tử
                        }}
                      >
                        <CategoryRounded style={iconColor} />
                        <strong>Hình thức: </strong>

                        <Box
                          width="auto"
                        
                          p="2px"
                          display="flex"
                          justifyContent="center"
                          fontSize={10}
                          borderRadius={2}
                          backgroundColor={
                            dataOrderDetail.rescueType === "Fixing"
                              ? colors.yellowAccent[400]
                              : colors.grey[800]
                              ? colors.redAccent[600]
                              : dataOrderDetail.rescueType === "Towing"
                          }
                          color={
                            dataOrderDetail.rescueType === "Towing"
                              ? colors.redAccent[300]
                              : colors.yellowAccent[700]
                          }
                        >
                          {dataOrderDetail.rescueType === "Towing" && (
                            <SupportIcon />
                          )}
                          {dataOrderDetail.rescueType === "Fixing" && (
                            <HandymanIcon />
                          )}
                          <Typography
                            color="inherit"
                            sx={{ ml: "1px", fontWeight: "bold" }}
                          >
                            {dataOrderDetail.rescueType === "Towing"
                              ? "Kéo Xe"
                              : dataOrderDetail.rescueType === "Fixing"
                              ? "Sữa Chữa Tại Chỗ"
                              : dataOrderDetail.rescueType}
                          </Typography>
                        </Box>
                      </Box>
               
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1, 
                          marginTop:"6px"
                        }}
                      >
                        <CheckCircleIcon style={iconColor} />
                        <strong>Trạng Thái: </strong>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center", // Canh giữa theo chiều dọc
                            background: colors.green[200],
                            color: "black",
                            borderRadius: "5px",
                            fontWeight: "bold",
                          }}
                        >
                          {dataOrderDetail.status === "COMPLETED"
                            ? "Hoàn Thành"
                            : dataOrderDetail.status || "Không có thông tin"}
                        </Box>
                        
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1, // Khoảng cách giữa các phần tử
                        }}
                      >
                        <DescriptionIcon style={iconColor} />
                        <strong>Ghi chú kỹ thuật viên: </strong>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            padding: "4px",
                            borderRadius: "4px",
                            marginLeft: "4px",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                            flex: 1,
                          }}
                        >
                          {dataOrderDetail.staffNote || "Đang cập nhật"}
                        </Typography>
                      </Box>

                  
                      <DescriptionIcon  sx={{
                        marginRight:"5px",
                  
                        }}style={iconColor} />
                      <strong >Ghi chú khách hàng: </strong>
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            padding: "4px",
                            borderRadius: "4px",
                            marginLeft: "4px",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                            flex: 1,
                          }}
                        >
                          {dataOrderDetail.customerNote || "Đang cập nhật"}
                        </Typography>
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
