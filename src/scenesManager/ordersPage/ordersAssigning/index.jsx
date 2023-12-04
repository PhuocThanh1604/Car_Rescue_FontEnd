import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  Grid,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Edit } from "@mui/icons-material";
import ModalDetail from "./ModalDetail";
import ModalEdit from "./ModalEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import { fetchOrdersAssigning, getOrderId } from "../../../redux/orderSlice";
import { getCustomerIdFullName } from "../../../redux/customerSlice";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AddCardIcon from "@mui/icons-material/AddCard";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import { useLocation } from "react-router-dom";
import CustomTablePagination from "../../../components/TablePagination";
import ModalCancel from "./ModalCanncel";
const OrdersAssigning = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const orders = useSelector((state) => state.order.orders);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("rescueType");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fullnameData, setFullnameData] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const handleDataUpdated = () => {
    reloadOrdersAssigning();
  };

  const reloadOrdersAssigning = () => {
    dispatch(fetchOrdersAssigning())
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

  const handleDetailClickDetail = (orderId) => {
    console.log(orderId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getOrderId({ id: orderId }))
      .then((response) => {
        const orderDetails = response.payload.data;
        setSelectedEditOrder(orderDetails);
        setOpenModal(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng mới:", error);
      });
  };
  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
 // Kiểm tra nếu không có dữ liệu orders hoặc fullnameData
 if (!Array.isArray(orders) || !Object.keys(fullnameData).length) {
  // Thực hiện xử lý khi không có dữ liệu
  return;
}
    // Filter the orders based on the entered search query
    const filteredOrders = orders.filter((order) => {
      const nameMatch =
        fullnameData[order.customerId] && // Check if fullname data is available
        fullnameData[order.customerId].toLowerCase().includes(value);
      const filterMatch =
        filterOption === "rescueType" ||
        (filterOption === "Fixing" && order.rescueType === "Fixing") ||
        (filterOption === "Towing" && order.rescueType === "Towing");
      return nameMatch && filterMatch;
    });

    setFilteredOrders(filteredOrders);
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "rescueType") {
      // Hiển thị tất cả các trạng thái
      setFilteredOrders(orders);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredOrders = orders.filter(
        (order) => order.rescueType === selectedStatusOption
      );
      setFilteredOrders(filteredOrders);
    }
  };
  const handleDateFilterChange = () => {
    if (!Array.isArray(orders) || orders.length === 0) {
      // Xử lý trường hợp không tìm thấy mảng orders, ví dụ: hiển thị thông báo hoặc không thực hiện thay đổi nào
    toast.warning('Không tìm thấy dữ liệu orders.');
      return; // Dừng hàm nếu không tìm thấy mảng orders
    }
  
    if (startDate && endDate && moment(startDate).isValid() && moment(endDate).isValid()) {
      const formattedStartDate = moment(startDate).tz("Asia/Ho_Chi_Minh").add(7, 'hours').startOf('day');
      const formattedEndDate = moment(endDate).tz("Asia/Ho_Chi_Minh").add(7, 'hours').startOf('day');
  
      const filteredOrders = orders.filter((order) => {
        const orderDate = moment(order.createdAt).tz("Asia/Ho_Chi_Minh").add(7, 'hours').startOf('day');
  
        const isAfterStartDate = orderDate.isSameOrAfter(formattedStartDate, "day");
        const isBeforeEndDate = orderDate.isSameOrBefore(formattedEndDate, "day");
  
        return isAfterStartDate && isBeforeEndDate;
      });
  
      setFilteredOrders(filteredOrders);
      setFilterOption("Date");
    } else {
      toast.warning('Nhập ngày kết thúc');
      // Xử lý khi startDate hoặc endDate không hợp lệ, ví dụ: hiển thị thông báo lỗi hoặc không thực hiện bất kỳ thay đổi nào
      // Ở đây có thể hiển thị thông báo lỗi hoặc không thực hiện bất kỳ thay đổi nào tùy theo yêu cầu cụ thể của bạn.
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrdersAssigning())
      .then((response) => {
        if ( !response || !response.payload || !response.payload.data) {
          setLoading(false);
          return; // Kết thúc sớm hàm useEffect() nếu không có dữ liệu
        }
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredOrders(data);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      }).catch((error) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, location.pathname]);
 

  const handleUpdateClick = (orderId) => {
    console.log(orderId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getOrderId({ id: orderId }))
      .then((response) => {
        const orderDetails = response.payload.data;
        setSelectedEditOrder(orderDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng mới:", error);
      });
  };
  const handleCancelOrder = (orderId) => {
    console.log(orderId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getOrderId({ id: orderId }))
      .then((response) => {
        const orderDetails = response.payload.data;
        setSelectedCancelOrder(orderDetails);
        setOpenCancelModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng mới:", error);
      });
  };

  const reloadOders = () => {
    dispatch(fetchOrdersAssigning())
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

  // Use an effect to fetch the fullname when the component mounts or customerId changes
  useEffect(() => {
    const uniqueCustomerIds = [...new Set(data.map((row) => row.customerId))];
    const fetchFullNames = async (customerIds) => {
      const uniqueCustomerIdsToFetch = customerIds.filter(
        (customerId) => !fullnameData[customerId]
      );
      const fetchPromises = uniqueCustomerIdsToFetch.map((customerId) =>
        fetchFullname(customerId)
      );
      await Promise.all(fetchPromises);
    };

    fetchFullNames(uniqueCustomerIds);
  }, [data, fullnameData]);
  const fetchFullname = (customerId) => {
    if (!fullnameData[customerId]) {
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
    }
    // You can use your existing code to fetch the fullname
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let filteredOrdersPagination = [];

  if (Array.isArray(filteredOrders)) {
    filteredOrdersPagination =
      filteredOrders &&
      filteredOrders.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    {
      field: "customerId",
      headerName: "Tên Khách Hàng",
      width: 140,
      renderCell: (params) => {
        return fullnameData[params.value] ? (
          fullnameData[params.value]
        ) : (
          <CircularProgress size={20} />
        );
      },
    },
    {
      field: "customerNote",
      headerName: "Ghi Chú của Customer",
      width: 200,
      key: "customerNote",
    },

    {
      field: "createdAt",
      headerName: "Ngày Tạo Đơn",
      width: 140,
      key: "createdAt",
      valueGetter: (params) =>
        moment(params.row.createdAt)
          .tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
          .add(7, "hours") // Adding 3 hours (you can adjust this number as needed)
          .format("DD-MM-YYYY HH:mm:ss"),
    },
    { field: "area", headerName: "khu vực", width: 60, key: "area" },
    {
      field: "rescueType",
      headerName: "Hình Thức",
      width: 140,
      key: "rescueType",
      renderCell: ({ row: { rescueType } }) => {
        return (
          <Box
            width="auto"
            m="0 auto"
            p="2px"
            display="flex"
            justifyContent="center"
            fontSize={10}
            borderRadius={2}
            backgroundColor={
              rescueType === "Fixing"
                ? colors.yellowAccent[400]
                : colors.grey[800]
                ? colors.redAccent[600]
                : rescueType === "Towing"
            }
            color={
              rescueType === "Towing"
                ? colors.redAccent[300]
                : colors.yellowAccent[700]
            }
          >
            {rescueType === "Towing" && <SupportIcon />}
            {rescueType === "Fixing" && <HandymanIcon />}
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
            {rescueType === "Towing" ? "Kéo Xe" : rescueType==="Fixing" ? "Sữa Chữa Tại Chỗ":rescueType}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "status",
      headerName: "Trạng Thái",
      width: 120,
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
              status === "ASSIGNED"
                ? colors.greenAccent[300]
                : colors.yellowAccent[700]
            }
          >
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
            {status === "NEW"
                ? "Mới"
                : status === "ASSIGNED"
                ? " Đã điều phối"
                : status === "COMPLETED"
                ? "Hoàn thành"
                : status === "Canneclled"
                ? "Đã Hủy"
                : status === "ASSIGNING"
                ? "Đang Điều Phối" 
                : status ==="INPROGRESS"
                ? "Đang thực hiện":status}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "update",
      headerName: "Cập Nhật",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
              // Thay đổi màu sắc hoặc hiệu ứng khác khi hover vào Box
              backgroundColor:"lightgray",

              borderRadius: "4px",
            },
          }}
        >
          <IconButton
            onClick={() => handleUpdateClick(params.row.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Edit style={{ color: "indigo" }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginLeft: "5px" }}
              onClick={() => handleUpdateClick(params.row.id)}
            >
              {"Cập Nhật"}
            </Typography>
          </IconButton>
        </Box>
      ),
      key: "update",
    },
    {
      field: "orderDetails",
      headerName: "Chi Tiết Đơn Hàng",
      width: 120,
      renderCell: (params) => (
        <Grid container justifyContent="center" alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": {
                cursor: "pointer",
                // Thay đổi màu sắc hoặc hiệu ứng khác khi hover vào Box
                backgroundColor: "lightgray",
                padding: "4px",
                borderRadius: "4px",
              },
            }}
            onClick={() => handleDetailClickDetail(params.row.id)}
          >
            <VisibilityIcon
              color="indigo"
              onClick={() => handleDetailClickDetail(params.row.id)}
              aria-label="Chi Tiết Đơn Hàng"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginLeft: "5px" }}
              onClick={() => handleDetailClickDetail(params.row.id)}
            >
              {"Xem Chi Tiết"}
            </Typography>
          </Box>
        </Grid>
      ),
      key: "orderDetails",
    },
    {
      field: "cancel",
      headerName: "Hủy Đơn",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
              // Thay đổi màu sắc hoặc hiệu ứng khác khi hover vào Box
              backgroundColor: colors.redAccent[800],

              borderRadius: "4px",
            },
          }}
        >
          <IconButton
            variant="contained"
            color="error"
            onClick={() => handleCancelOrder(params.row.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CancelIcon style={{ color: "red" }} />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginLeft: "5px" }}
              onClick={() => handleCancelOrder(params.row.id)}
            >
              {"Hủy Đơn"}
            </Typography>
          </IconButton>
        </Box>
      ),
      key: "update",
    },
  
  
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header
        title="Danh Sách Đơn Hàng Đang Được Điều Phối"
        subtitle="Danh sách chi tiết đơn hàng"
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
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterOption}
            onChange={handleFilterChange}
            variant="outlined"
            className="filter-select"
            style={{ width: "150px" }}
          >
            <MenuItem key="rescueType-all" value="rescueType">
              Hình Thức
            </MenuItem>
            <MenuItem key="rescueType-towing" value="Towing">
              Kéo Xe
            </MenuItem>
            <MenuItem key="rescueType-fixing" value="Fixing">
              Sửa Chữa Tại Chỗ
            </MenuItem>
          </Select>
        </FormControl>

        {/*Fillter date*/}
        <Box display="flex" alignItems="center" className="startDate-box">
          <TextField
            label="Từ ngày"
            type="date"
            value={startDate || ""}
            onChange={(event) => {
              setStartDate(event.target.value);
              // handleDateFilterChange(); // Gọi hàm lọc ngay khi ngày tháng thay đổi
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
          rows={filteredOrdersPagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
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
        selectedEditOrder={selectedEditOrder}
        loading={loading}
      ></ModalDetail>

      <ModalEdit
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedEditOrder={selectedEditOrder}
        selectedCancelOrder={selectedCancelOrder}
        onDataUpdated={handleDataUpdated}
        loading={loading}
      />
      <ModalCancel
        openCancelModal={openCancelModal}
        setOpenCancelModal={setOpenCancelModal}
        selectedCancelOrder={selectedCancelOrder}
        onDataUpdated={handleDataUpdated}
        loading={loading}
      />
      <ToastContainer />
    </Box>
  );
};

export default OrdersAssigning;
