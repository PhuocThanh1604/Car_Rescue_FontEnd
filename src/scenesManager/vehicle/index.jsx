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

import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
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
} from "../../redux/vehicleSlice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Collapse from "@mui/material/Collapse";
import TimerIcon from "@mui/icons-material/Timer";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { getRescueVehicleOwnerId } from "../../redux/rescueVehicleOwnerSlice";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PlaceIcon from "@mui/icons-material/Place";
import CustomTablePagination from "../../components/TablePagination";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const Vehicles = (props) => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
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

  const [collapse, setCollapse] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataRescueVehicleOwner, setDataRescueVehicleOwner] = useState({});
  const [rescueVehicleOwnerId, setRescueVehicleOwnerId] = useState({});

  //GetdadaRescueVehicleOwner

  useEffect(() => {
    // Kiểm tra xem detailedData có phải là mảng và có phần tử đầu tiên hay không
    if (
      Array.isArray(detailedData) &&
      detailedData.length > 0 &&
      detailedData[0].rvoid
    ) {
      fetchRescueVehicleOwner(detailedData[0].rvoid);
    }
  }, [detailedData]);

  //GetdadaCustomer
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

  //hàm chấp nhận đaăn kí xe gọi modal
  const handleConfirm = (orderId) => {
    try {
      // Gửi orderId về máy chủ ở đây
      console.log("Sending vehicleID to server: ", orderId);

      // Thực hiện tải lại dữ liệu sau khi hoàn thành xử lý
      // Tùy thuộc vào cách bạn tải lại dữ liệu
      setVehicleId(orderId);
      // Đóng modal và đặt lại orderId
      setOpenConfirmModal(true);
    } catch (error) {
      // Xử lý lỗi (nếu có)
      console.error("Lỗi khi xử lý:", error);
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
    dispatch(fetchVehicleWatting())
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
        console.error("Lỗi khi tải lại danh sách xe cứu hộ:", error);
      });
  };
  //Chấp nhận order
  const handleAcceptOrderClick = (vehicleId, accept) => {
    console.log(vehicleId);
    setIsAccepted(accept);
    console.log(accept);
    // Fetch the VehicleId details based on the selected Vehicle ID
    dispatch(createAcceptRegisterVehicle({ id: vehicleId, boolean: accept }))
      .then(() => {
        setVehicleId(vehicleId);
        setOpenConfirmModal(false);
        setIsSuccess(true);
        reloadVehicle();
            // Check if accept is true or false
            if (accept) {
              toast.success("Chấp nhận xe thành công.");
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

  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);
  const handleSearchChange = (event) => {
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };
  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredVehicles = vehicles.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredVehicles(filteredVehicles);
      setFilterOption("Date");
    } else {
      setFilteredVehicles(vehicles);
    }
  };
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "type") {
      // Hiển thị tất cả các trạng thái
      setFilteredVehicles(vehicles);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredVehicles = vehicles.filter(
        (vehicle) => vehicle.type === selectedStatusOption
      );
      setFilteredVehicles(filteredVehicles);
    }
  };

  useEffect(() => {
    if (Array.isArray(vehicles)) {
      const vehicleId = vehicles.id; // Xem xét lại điều này, có vẻ như vehicles.id không đúng
      const vehicleToEdit = vehicles.find(vehicle => vehicle.id === vehicleId);
  
      if (vehicleToEdit) {
        setEditStatus(vehicleToEdit);
        setInitialFormState(vehicleToEdit);
      }
    }
  }, [vehicles]);
  

  useEffect(() => {
    if (Array.isArray(vehicles)) {
      const filteredVehicles = vehicles.filter(vehicle => {
        const nameMatch = vehicle.fullname && vehicle.fullname.toLowerCase().includes(searchText.toLowerCase());
        const filterMatch = filterOption === "type" ||
          (filterOption === "Crane" && vehicle.type === "Crane") ||
          (filterOption === "Towing" && vehicle.type === "Towing");
        return nameMatch && filterMatch;
      });
      setFilteredVehicles(filteredVehicles);
    } else {
      setFilteredVehicles([]);
    }
  }, [vehicles, searchText, filterOption])
  

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVehicleWatting())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredVehicles(data);
          setDetailedData(data);
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

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    {
      field: "vinNumber",
      headerName: "vinNumber",
      width: 100,
      key: "vinNumber",
    },
    {
      field: "licensePlate",
      headerName: "licensePlate",
      width: 100,
      key: "licensePlate",
    },
    { field: "type", headerName: "Loại Xe ", width: 140, key: "type" },
    {
      field: "manufacturer",
      headerName: "Hiệu xe  ",
      width: 100,
      key: "manufacturer",
    },
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
      headerName: "Trạng Thái Đơn",
      width: 60,
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
    <Box m="5px">
      <Header
        title="Danh Sách Xe Cứu Hộ"
        subtitle="Danh sách xe cứu hộ chờ duyệt"
      />
      <Box display="flex" className="box" left={0}>
        <Box display="flex" borderRadius="5px" border={1} marginRight={2}>
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
              <MenuItem key="type-all" value="type">
                Loại Xe
              </MenuItem>
              <MenuItem key="type-crane" value="Crane">
                Xe Cẩu
              </MenuItem>
              <MenuItem key="type-towing" value="Towing">
                Xe Kéo
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center" className="startDate-box">
          <TextField
            label="Từ ngày"
            type="date"
            value={startDate || ""}
            onChange={(event) => setStartDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleDateFilterChange}
            inputProps={{
              max: moment().format("YYYY-MM-DD"), // Set the maximum selectable date as today
            }}
            sx={{ ml: 4, mr: 2 }}
          />
        </Box>

        <Box display="flex" alignItems="center" className="endtDate-box">
          <TextField
            label="Đến ngày"
            type="date"
            value={endDate || ""}
            onChange={(event) => setEndDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleDateFilterChange}
            inputProps={{
              max: moment().format("YYYY-MM-DD"), // Set the maximum selectable date as today
            }}
          />
        </Box>
      </Box>

      <Box
        m="10px 0 0 0"
        height="75vh"
        sx={{
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
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
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
      <ModalDetail
        openModal={openModal}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal(false)}
        selectedBook={selectedBook}
        loading={loading}
      ></ModalDetail>

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
            height: "500px", // Set your desired maximum height
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: "indigo", fontSize: "24px" }}
        >
          Xác nhận đăng kí vào hệ hống
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {detailedData !== null ? (
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
                        onClick={() => handleImageClick(data.carRegistrationBack)}
                      >
                        <img
                          src={detailedData.carRegistrationBack}
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
                          src={detailedData.carRegistrationFont}
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
                          src={detailedData.image}
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
                           <PersonRoundedIcon />
                          <Typography variant="h6">
                          <strong>Chủ xe: </strong>{" "}
                            {dataRescueVehicleOwner[detailedData[0]?.rvoid]
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
                           <PhoneRoundedIcon />
                          <Typography variant="h6">
                          <strong>SĐT: </strong>{" "}
                          {dataRescueVehicleOwner[detailedData[0]?.rvoid]
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
                           <PeopleAltRoundedIcon />
                          <Typography variant="h6">
                          <strong>Giới tính: </strong>{" "}
                          {dataRescueVehicleOwner[detailedData[0]?.rvoid]
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
                           <PlaceIcon />
                          <Typography variant="h6">
                          <strong>Địa chỉ: </strong>{" "}
                         
                          {dataRescueVehicleOwner[detailedData[0]?.rvoid]
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
                          <strong>Khu vực: </strong>{" "}
                         
                          {dataRescueVehicleOwner[detailedData[0]?.rvoid]
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
                          <ReceiptRoundedIcon />
                          <Typography variant="h6">
                            Biển Số:{" "}
                            {detailedData[0].licensePlate ||
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
                          <CategoryRounded />
                          <Typography variant="h6">
                            Loại Xe:{" "}
                            {detailedData[0].type || "Không có thông tin"}
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
                            Đời xe:{" "}
                            {detailedData[0].manufacturingYear ||
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
                          <ReceiptRoundedIcon />
                          <Typography variant="h6">
                            Hãng xe:{" "}
                            {detailedData[0].manufacturer ||
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
                          <ReceiptRoundedIcon />
                          <Typography variant="h6">
                            Số khung xe:{" "}
                            {detailedData[0].vinNumber || "Không có thông tin"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1, // Khoảng cách giữa các phần tử
                          }}
                        >
                          <TimerIcon />
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
                            {detailedData[0].status || "Không có thông tin"}
                          </Box>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                  {/* <CardActions className="card-action-dense">
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button onClick={handleClick}>Thông Tin Chủ Xe</Button>
                      <IconButton size="small" onClick={handleClick}>
                        {collapse ? (
                          <ArrowDropDownIcon sx={{ fontSize: "1.875rem" }} />
                        ) : (
                          <ArrowDropUpIcon sx={{ fontSize: "1.875rem" }} />
                        )}
                      </IconButton>
                    </Box>
                  </CardActions> */}
                  {/* <Collapse in={collapse}>
                    <Divider sx={{ margin: 0 }} />
                    <CardContent>
                      <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Chủ Xe: {detailedData[0].rvoid}
                      </Typography>

                      <Typography variant="body2">
                        Status: {detailedData[0].status}
                      </Typography>
                    </CardContent>
                  </Collapse> */}
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
