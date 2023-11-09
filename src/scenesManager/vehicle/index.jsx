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
  CardActions,
  Divider,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
import CustomTablePagination from "./TablePagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";

import {
  createAcceptRegisterVehicle,
  fetchVehicle,
  fetchVehicleWatting,
} from "../../redux/vehicleSlice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Collapse from "@mui/material/Collapse";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import TimerIcon from "@mui/icons-material/Timer";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import { Carousel } from "react-responsive-carousel";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
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
    dispatch(createAcceptRegisterVehicle({ id: vehicleId,boolean: accept }))
      .then(() => {
        setVehicleId(vehicleId);
        setOpenConfirmModal(false);
        setIsSuccess(true);
        reloadVehicle();
        toast.success("Chấp nhận thành công.");
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
    if (vehicles) {
      if (vehicles.id) {
        const vehicleToEdit = vehicles.find(
          (vehicle) => vehicle.id === vehicles.id
        );
        if (vehicleToEdit) {
          setEditStatus(vehicleToEdit);
          setInitialFormState(vehicleToEdit);
        }
      }
    }
  }, [vehicles]);

  useEffect(() => {
    const filteredVehicles = vehicles
      ? vehicles.filter((vehicle) => {
          const nameMatch =
            vehicle.fullname &&
            vehicle.fullname.toLowerCase().includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "type" ||
            (filterOption === "Crane" && vehicle.type === "Crane") ||
            (filterOption === "Towing" && vehicle.type === "Towing");
          return nameMatch && filterMatch;
        })
      : [];
    setFilteredVehicles(filteredVehicles);
  }, [vehicles, searchText, filterOption]);

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
        <Box
          display="flex"
          borderRadius="5px"
          className="search-box"
          border={1}
          marginRight={2}
        >
          <InputBase
            sx={{ ml: 4, flex: 1, padding: 1.3 }}
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
            width: "500px", // Set your desired maximum width
            height: "500px", // Set your desired maximum height
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: 'indigo' , fontSize: '24px'}}>Xác nhận đăng kí vào hệ hống</DialogTitle>
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
                     <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img
                          src={detailedData[0].carRegistrationBack}
                          alt="Car Back"
                          style={{
                            width: imageWidth,
                            height: imageHeight,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img
                          src={detailedData[0].carRegistrationFont}
                          alt="Car Front"
                          style={{
                            width: imageWidth,
                            height: imageHeight,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img
                          src={detailedData[0].image}
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
                  <Grid container spacing={4} sx={{ marginTop: 2 }}>
                    <Grid item xs={6}>
                      <CardContent>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                          Chủ Xe: {detailedData[0].rvoid}
                        </Typography>
                      </CardContent>
                    </Grid>
                    <Grid item xs={6}>
                      <CardContent>
                        <Typography variant="h6">
                          <span>Biển số xe:</span>{" "}
                          {detailedData[0].licensePlate}
                        </Typography>
                        <Typography variant="h6">
                          <span>Loại xe:</span> {detailedData[0].type}
                        </Typography>
                        <Typography variant="h6">
                          <span>Đời xe:</span>{" "}
                          {detailedData[0].manufacturingYear}
                        </Typography>
                        <Typography variant="h6">
                          <span>Mã xe:</span> {detailedData[0].manufacturer}
                        </Typography>
                        <Typography variant="h6">
                          <span>Số khung xe:</span> {detailedData[0].vinNumber}
                        </Typography>
                        <Typography variant="h6">
                          <span>Trạng Thái:</span>
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center", // Center vertically
                              background: "yellow",
                              color: "black",
                              width: "150px",
                              borderRadius: "5px",
                            }}
                          >
                            <TimerIcon />
                            {detailedData[0].status}
                          </Box>
                        </Typography>
                      </CardContent>
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
                      <Button onClick={handleClick}>Thông Tin Chủ Xe</Button>
                      <IconButton size="small" onClick={handleClick}>
                        {collapse ? (
                          <ArrowDropDownIcon sx={{ fontSize: "1.875rem" }} />
                        ) : (
                          <ArrowDropUpIcon sx={{ fontSize: "1.875rem" }} />
                        )}
                      </IconButton>
                    </Box>
                  </CardActions>
                  <Collapse in={collapse}>
                    <Divider sx={{ margin: 0 }} />
                    <CardContent>
                      <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Chủ Xe: {detailedData[0].rvoid}
                      </Typography>

                      <Typography variant="body2">
                        Status: {detailedData[0].status}
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              </div>
            ) : (
              "Loading..."
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} color="primary"variant="contained">
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
