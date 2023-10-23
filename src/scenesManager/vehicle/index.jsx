import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Modal,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  CircularProgress,
  Switch,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Edit, FilterList, Search } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
import CustomTablePagination from "./TablePagination";
import ToggleButton from "./ToggleButton";
import { DeleteOutline } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import {
  fetchvehicles,
  getvehicleId,
  updateStatusvehicle,
} from "../../redux/vehicleSlice";
import { fetchVehicle } from "../../redux/vehicleSlice";
import { getRescueVehicleOwnerId, updateStatusRescueVehicleOwner } from "../../redux/rescueVehicleOwnerSlice";
const Vehicles = (props) => {
  const dispatch = useDispatch();
  const  vehicles = useSelector(
    (state) => state.vehicle?.vehicles
  );
  const [vehicleStatus, setvehicleStatus] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openEditModalRescuse, setOpenEditModalRescuse] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedEditvehicle, setSelectedEditvehicle] =
    useState(null);
  const [filteredvehicles, setFilteredvehicles] =
    useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [initialFormState, setInitialFormState] = useState({});
  const [editStatus, setEditStatus] = useState({});
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
      const filteredvehicles = vehicles.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredvehicles(filteredvehicles);
      setFilterOption("Date");
    } else {
      setFilteredvehicles(vehicles);
    }
  };
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredvehicles(vehicles);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredvehicles = vehicles.filter(
        (vehicle) =>
          vehicle.status === selectedStatusOption
      );
      setFilteredvehicles(filteredvehicles);
    }
  };

  useEffect(() => {
    if (vehicles) {
      if (vehicles.id) {
        const RescuseVehicleOwnerToEditToEdit = vehicles.find(
          (rescuseVehicleOwner) =>
            rescuseVehicleOwner.id === vehicles.id
        );
        if (RescuseVehicleOwnerToEditToEdit) {
          console.log(RescuseVehicleOwnerToEditToEdit);
          setEditStatus(RescuseVehicleOwnerToEditToEdit);
          setInitialFormState(RescuseVehicleOwnerToEditToEdit);
        }
      }
    }
  }, [vehicles]);

  useEffect(() => {
    const filteredvehicles = vehicles
      ? vehicles.filter((vehicle) => {
          const nameMatch =
            vehicle.fullname &&
            vehicle.fullname
              .toLowerCase()
              .includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" &&
              vehicle.status === "ACTIVE") ||
            (filterOption === "Unactive" &&
              vehicle.status === "Unactive");
          return nameMatch && filterMatch;
        })
      : [];
    setFilteredvehicles(filteredvehicles);
  }, [vehicles, searchText, filterOption]);

  if (vehicles) {
    vehicles.forEach((vehicle) => {
      // Đây bạn có thể truy cập và xử lý dữ liệu từng đối tượng khách hàng ở đây
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVehicle())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredvehicles(data);

          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleUpdateClick = (vehicleId) => {
    console.log(vehicleId);
    // Fetch the vehicleId details based on the selected vehicleId ID
    dispatch(getRescueVehicleOwnerId({ id: vehicleId }))
      .then((response) => {
        const vehicleDetails = response.payload.data;
        setSelectedEditvehicle(vehicleDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin chủ xe cứu hộ:", error);
      });
  };

  const handleBookDetailClick = (book) => {
    setSelectedBook(book);
    setOpenModal(true);
  };
  const reloadvehicles = () => {
    dispatch(fetchVehicle())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredvehicles(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách xe cứu hộ:", error);
      });
  };
  const handleSaveClickStatus = (vehicleId, fullname, newStatus) => {
    if (!vehicleId || !fullname || !newStatus) {
      toast.error("Không có thông tin để cập nhật.");
      return;
    }
    console.log(fullname);
    console.log(vehicleId);
    console.log(newStatus);
    // Create an object containing the necessary data
    const updateData = {
      id: vehicleId,
      fullname: fullname,
      sex: "",
      phone: "",
      avatar: "",
      address: "",
      createAt: "",
      updateAt: "",
      area: "",
      status: newStatus,
    };
    const updateDataJson = JSON.stringify(updateData);
    console.log("dã update" + updateData);
    // Update the status of the matching vehicle and send the update to the server
    dispatch(updateStatusRescueVehicleOwner({ data: updateDataJson }))
      .then(() => {
        toast.success("Thay đổi trạng thái thành công.");
        reloadvehicles();
        setIsSuccess(true);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi cập nhật xe cứu hộ: ${error.response.data.message}`
          );
        } else if (error.message) {
          toast.error(`Lỗi khi cập nhật xe cứu hộ: ${error.message}`);
        } else {
          toast.error("Lỗi khi cập nhật xe cứu hộ");
        }
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredvehiclesPagination =
    filteredvehicles.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

  function isAllCharactersSame(value) {
    if (!value) {
      return false;
    }

    const firstChar = value[0];
    return value.split("").every((char) => char === firstChar);
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    { field: "id", headerName: "ID", width: 60, key: "id" },
    { field: "rvoid", headerName: "vroid", width: 60, key: "rvoid" },
    { field: "vinNumber", headerName: "Mã Xe", width: 160, key: "vinNumber" },
    {
      field: "licensePlate",
      headerName: "Biển Số",
      width: 100,
      key: "licensePlate",
    },
    { field: "type", headerName: "Loại Xe", width: 100, key: "type" },
    { field: "color", headerName: " Màu Xe", width: 40, key: "color" },
    {
      field: "manufacturingYear",
      headerName: " Năm sản xuất",
      width: 40,
      key: "color",
    },
    { field: "manufacturer", headerName: "Hãng xe", width: 70, key: "color" },
  ];

  return (
    <Box m="5px">
      <Header
        title="Danh Sách Xe Cứu Hộ"
        subtitle="Danh Sách Chi Tiết Xe Cứu Hộ"
      />
      <Box display="flex" alignItems="center" className="search-box">
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
              <MenuItem key="status-all" value="Status">
                Trạng Thái
              </MenuItem>
              <MenuItem key="status-active" value="ACTIVE">
                Hoạt động
              </MenuItem>
              <MenuItem key="status-unactive" value="Unactive">
                Không hoạt động
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
          rows={filteredvehiclesPagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
        />

        <CustomTablePagination
          count={filteredvehicles.length}
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
        selectedEditRescuseVehicleOwner={selectedEditvehicle}
        onClose={() => setOpenEditModal(false)}
        loading={loading}
      />
      <ToastContainer />
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        className="centered-modal" // Thêm className cho modal
      >
        <Fade in={openDeleteModal}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              boxShadow: 24,
              borderRadius: 16,
            }}
          >
            {/* <Card>
              <CardContent>
                <Typography variant="h3">Confirm Delete</Typography>
                <Typography>
                  Are you sure you want to delete this book?
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setOpenDeleteModal(false)}
                  variant="contained"
                >
                  Cancel
                </Button>
              </CardActions>
            </Card> */}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Vehicles;
