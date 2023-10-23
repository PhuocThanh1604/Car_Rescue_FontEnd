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
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
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
  fetchRescueVehicleOwners,
  getRescueVehicleOwnerId,
  updateStatusRescueVehicleOwner,
} from "../../../redux/rescueVehicleOwnerSlice";
import { fetchOrders, fetchOrdersCompleted, fetchOrdersNew, getOderId } from "../../../redux/orderSlice";
import {
  getCustomerIdFullName,
} from "../../../redux/customerSlice";
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AddCardIcon from '@mui/icons-material/AddCard';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import BuildIcon from '@mui/icons-material/Build';
import SupportIcon from '@mui/icons-material/Support';
import HandymanIcon from '@mui/icons-material/Handyman';
const OrdersCompleted = (props) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const [orderStatus, setOrderStatus] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openEditModalRescuse, setOpenEditModalRescuse] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedEditRescueVehicleOwner, setSelectedEditRescueVehicleOwner] =
    useState(null);
  const [filteredOrders, setFilteredOrders] =
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
  const [fullnameData, setFullnameData] = useState({});


  const handleSearchChange = (event) => {
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };
  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredrescueVehicleOwners = orders.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredOrders(filteredrescueVehicleOwners);
      setFilterOption("Date");
    } else {
      setFilteredOrders(orders);
    }
  };
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredOrders(orders);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredrescueVehicleOwners = orders.filter(
        (rescueVehicleOwner) =>
          rescueVehicleOwner.status === selectedStatusOption
      );
      setFilteredOrders(filteredrescueVehicleOwners);
    }
  };

  useEffect(() => {
    if (orders) {
      if (orders.id) {
        const RescuseVehicleOwnerToEditToEdit = orders.find(
          (rescuseVehicleOwner) => rescuseVehicleOwner.id === orders.id
        );
        if (RescuseVehicleOwnerToEditToEdit) {
          console.log(RescuseVehicleOwnerToEditToEdit);
          setEditStatus(RescuseVehicleOwnerToEditToEdit);
          setInitialFormState(RescuseVehicleOwnerToEditToEdit);
        }
      }
    }
  }, [orders]);

  useEffect(() => {
    const filteredOrders = orders
      ? orders.filter((order) => {
          const nameMatch =
          order.fullname &&
          order.fullname
              .toLowerCase()
              .includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "NEW" && order.status === "NEW") ||
            (filterOption === "COMPLETED" &&order.status === "COMPLETED")||
            (filterOption === "ASSIGNED" &&order.status === "ASSIGNED");
          return nameMatch && filterMatch;
        })
      : [];
      setFilteredOrders(filteredOrders);
  }, [orders, searchText, filterOption]);

  if (orders) {
    orders.forEach((rescueVehicleOwner) => {
      // Đây bạn có thể truy cập và xử lý dữ liệu từng đối tượng khách hàng ở đây
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrdersCompleted())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredOrders(data);
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
    dispatch(getOderId({ id: rescueVehicleOwnerId }))
      .then((response) => {
        const rescueVehicleOwnerDetails = response.payload.data;
        setSelectedEditRescueVehicleOwner(rescueVehicleOwnerDetails);
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
  const reloadRescueVehicleOwners = () => {
    dispatch(fetchRescueVehicleOwners())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredOrders(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách đơn hàng:", error);
      });
  };
  const handleSaveClickStatus = (rescueVehicleOwnerId, fullname, newStatus) => {
    if (!rescueVehicleOwnerId || !fullname || !newStatus) {
      toast.error("Không có thông tin để cập nhật.");
      return;
    }
    console.log(fullname);
    console.log(rescueVehicleOwnerId);
    console.log(newStatus);
    // Create an object containing the necessary data
    const updateData = {
      id: rescueVehicleOwnerId,
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
    // Update the status of the matching RescueVehicleOwner and send the update to the server
    dispatch(updateStatusRescueVehicleOwner({ data: updateDataJson }))
      .then(() => {
        toast.success("Thay đổi trạng thái thành công.");
        reloadRescueVehicleOwners();
        setIsSuccess(true);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi cập nhật đơn hàng: ${error.response.data.message}`
          );
        } else if (error.message) {
          toast.error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
        } else {
          toast.error("Lỗi khi cập nhật đơn hàng");
        }
      });
  };
  
  const fetchFullname = (customerId) => {
    // You can use your existing code to fetch the fullname
    dispatch(getCustomerIdFullName({ id: customerId }))
      .then((response) => {
        const data = response.payload.data;
        if (data && data.fullname) {
          // Update the state with the fetched fullname
          setFullnameData((prevData) => ({
            ...prevData,
            [customerId]: data.fullname,
          }));
        } else {
          console.error("Fullname not found in the API response.");
        }
      })
      .catch((error) => {
        console.error("Error while fetching customer data:", error);
      });
  };

  // Use an effect to fetch the fullname when the component mounts or customerId changes
  useEffect(() => {
    // Assuming you have an array of data, iterate through it and fetch fullnames
    data.forEach((row) => {
      const customerId = row.customerId;
      // Check if you have already fetched the fullname to avoid duplicate requests
      if (!fullnameData[customerId]) {
        fetchFullname(customerId);
      }
    });
  }, [data, fullnameData]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredrescueVehicleOwnersPagination =
  filteredOrders.slice(
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
      field: "customerId",
      headerName: "Tên Khách Hàng",
      width: 160,
      valueGetter: (params) => {
        // Get the fullname from the state based on customerId
        return fullnameData[params.value] || "";
      },
    },
    { field: "departure", headerName: "Địa Chỉ", width: 140, key: "departure" },
    {
      field: "customerNote",
      headerName: "Ghi Chú của Customer",
      width: 120,
      key: "customerNote",
    },
    {
      field: "rescueType",
      headerName: "Hình Thức",
      width: 120,
      key: "rescueType",
      renderCell: ({ row: { rescueType } }) => {
        return (
          <Box
            width="80%"
            m="0 auto"
            p="4px"
            display="flex"
            justifyContent="center"
            fontSize={10}
            borderRadius={8} // Corrected prop name from "buserRadius" to "borderRadius"
            backgroundColor={
              rescueType === 'Fixing'
                ? colors.greenAccent[700]
                : rescueType === 'repair'
                ? colors.grey[800]
                : colors.grey[800]
                ? colors.redAccent[700]
                : rescueType === 'Towing'
            }>
            {rescueType === 'repair' && <BuildIcon />}
            {rescueType === 'Towing' && <SupportIcon />}
            {rescueType === 'Fixing' && <HandymanIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '8px' }}>
              {rescueType}
            </Typography>
          </Box>
        );
      },
    },
    { field: "area", headerName: "khu vực", width: 60, key: "area" },
      
    {
      field: 'status',
      headerName: 'Trạng Thái',
      width: 150,
      key: 'status',
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="80%"
            m="0 auto"
            p="2px"
            display="flex"
            justifyContent="center"
            fontSize={10}
            borderRadius={8} // Corrected prop name from "buserRadius" to "borderRadius"
            backgroundColor={
              status === 'NEW'
                ? colors.greenAccent[700]
                : status === 'ASSIGNED'
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === 'COMPLETED'
            }>
            {status === 'NEW' && <AddCardIcon />}
            {status === 'COMPLETED' && <CreditScoreIcon />}
            {status === 'ASSIGNED' && <RepeatOnIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '8px' }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
  
    {
      field: "update",
      headerName: "Cập Nhật",
      width: 60,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => handleUpdateClick(params.row.id)}
        >
          <Edit style={{ color: "red" }} />
        </IconButton>
      ),
      key: "update",
    },
  ];

  return (
    <Box m="5px">
      <Header title="Danh Sách Đơn Hàng" subtitle="Danh sách chi tiết đơn hàng" />
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
                Trạng Thái Đơn Hàng
              </MenuItem>
              <MenuItem key="status-active" value="NEW">
                Mới
              </MenuItem>
              <MenuItem key="status-unactive" value="ASSIGNED">
               Đã Phân Công
              </MenuItem>
              <MenuItem key="status-unactive" value="COMPLETED">
               Đã Hoàn Thành
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
          count={filteredOrders.length}
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
        selectedEditRescuseVehicleOwner={selectedEditRescueVehicleOwner}
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

export default OrdersCompleted;
