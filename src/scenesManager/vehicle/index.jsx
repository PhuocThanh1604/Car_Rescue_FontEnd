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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Edit} from "@mui/icons-material";
import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
import CustomTablePagination from "./TablePagination";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import {
  fetchRescueVehicleOwners,
  getRescueVehicleOwnerId,
} from "../../redux/rescueVehicleOwnerSlice";
import { createAcceptRegisterVehicle, fetchVehicleWatting } from "../../redux/vehicleSlice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
  const handleAcceptOrderClick = (vehicleId) => {
    console.log(vehicleId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(createAcceptRegisterVehicle({ id: vehicleId }))
      .then(() => {
        setVehicleId(vehicleId);
        setOpenConfirmModal(false);
        setIsSuccess(true);
        toast.success("Chấp nhận thành công.");
        reloadVehicle();
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
      const filteredrescueVehicleOwners = vehicles.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredVehicles(filteredrescueVehicleOwners);
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
      const filteredrescueVehicleOwners = vehicles.filter(
        (rescueVehicleOwner) =>
          rescueVehicleOwner.type === selectedStatusOption
      );
      setFilteredVehicles(filteredrescueVehicleOwners);
    }
  };

  useEffect(() => {
    if (vehicles) {
      if (vehicles.id) {
        const RescuseVehicleOwnerToEditToEdit = vehicles.find(
          (rescuseVehicleOwner) => rescuseVehicleOwner.id === vehicles.id
        );
        if (RescuseVehicleOwnerToEditToEdit) {
          setEditStatus(RescuseVehicleOwnerToEditToEdit);
          setInitialFormState(RescuseVehicleOwnerToEditToEdit);
        }
      }
    }
  }, [vehicles]);

  useEffect(() => {
    const filteredRescueVehicleOwners = vehicles
      ? vehicles.filter((rescueVehicleOwner) => {
          const nameMatch =
            rescueVehicleOwner.fullname &&
            rescueVehicleOwner.fullname
              .toLowerCase()
              .includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "type" ||
            (filterOption === "Crane" &&
              rescueVehicleOwner.type === "Crane") ||
            (filterOption === "Towing" &&
              rescueVehicleOwner.type === "Towing");
          return nameMatch && filterMatch;
        })
      : [];
    setFilteredVehicles(filteredRescueVehicleOwners);
  }, [vehicles, searchText, filterOption]);

  if (vehicles) {
    vehicles.forEach((rescueVehicleOwner) => {
      // Đây bạn có thể truy cập và xử lý dữ liệu từng đối tượng khách hàng ở đây
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVehicleWatting())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredVehicles(data);

          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleUpdateClick = (rescueVehicleOwnerId) => {
    console.log(rescueVehicleOwnerId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getRescueVehicleOwnerId({ id: rescueVehicleOwnerId }))
      .then((response) => {
        const rescueVehicleOwnerDetails = response.payload.data;
        setFilteredVehicles(rescueVehicleOwnerDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin xe cứu hộ:", error);
      });
  };

  const handleBookDetailClick = (book) => {
    setSelectedBook(book);
    setOpenModal(true);
  };
  const reloadRescueVehicleOwners = () => {
    dispatch(fetchRescueVehicleOwners())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredVehicles(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách chủ xe cứu hộ:", error);
      });
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredrescueVehicleOwnersPagination = filteredVehicles.slice(
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
        const containsSpecialChars =
          /[áàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]/.test(
            params.value
          );
        const isRandomChars = isAllCharactersSame(params.value);
        const avatarSrc =
          params.value && !containsSpecialChars && !isRandomChars
            ? params.value
            : "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"; // Đặt URL của hình mặc định ở đây
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
        <CheckCircleOutlineIcon
          variant="contained"
          style={{ color: "green" }} // Set the color to green
          onClick={() => handleConfirm(params.row.id)}
        />
      ),
      key: "acceptOrder",
    }
    
  ];

  return (
    <Box m="5px">
      <Header title="Danh Sách Xe Cứu Hộ" subtitle="Danh sách xe cứu hộ chờ duyệt" />
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
          rows={filteredrescueVehicleOwnersPagination} // Thêm id nếu không có
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
      >
        <DialogTitle id="alert-dialog-title">Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn chấp nhận xe cứu hộ vào hệ thống?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Hủy
          </Button>
          <Button
            onClick={() => handleAcceptOrderClick(vehicleId)}
            color="primary"
            autoFocus
          >
            Đồng Ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicles;
