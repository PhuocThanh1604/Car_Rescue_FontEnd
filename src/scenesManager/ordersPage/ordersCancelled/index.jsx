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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Edit} from "@mui/icons-material";
import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";

import { fetchOrdersCancelled, fetchOrdersNew, getOrderId } from "../../../redux/orderSlice";
import { getCustomerIdFullName } from "../../../redux/customerSlice";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AddCardIcon from "@mui/icons-material/AddCard";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import BuildIcon from "@mui/icons-material/Build";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import InfoIcon from "@mui/icons-material/Info";
import { useLocation } from "react-router-dom";
import CustomTablePagination from "../../../components/TablePagination";
const OrdersCancelled = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const orders = useSelector((state) => state.order.orders);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("rescueType");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fullnameData, setFullnameData] = useState({});

//hàm detail 
const handleDetailClick = (orderId) => {
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
    // Filter the orders based on the entered search query
    const filteredOrders = orders.filter((order) => {
      const nameMatch =
        fullnameData[order.customerId] && // Check if fullname data is available
        fullnameData[order.customerId].toLowerCase().includes(value);
      const filterMatch =
        filterOption === "rescueType" ||
        (filterOption === "Fixing" && order.rescueType === "Fixing") ||
        (filterOption === "repair" && order.rescueType === "repair") ||
        (filterOption === "Towing" && order.rescueType === "Towing");
      return nameMatch && filterMatch;
    });

    setFilteredOrders(filteredOrders);
  };
  
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === 'rescueType') {
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

  if (orders) {
    orders.forEach((rescueVehicleOwner) => {
      // Đây bạn có thể truy cập và xử lý dữ liệu từng đối tượng khách hàng ở đây
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrdersCancelled())
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
  }, [dispatch,location.pathname]);

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


  const reloadOders = () => {
    dispatch(fetchOrdersNew())
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

  const filteredOrdersPagination = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    {
      field: "customerId",
      headerName: "Tên Khách Hàng",
      width: 100,
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
      field: "createdAt",
      headerName: "Ngày Tạo Đơn",
      width: 140,
      key: "createdAt",
      valueGetter: (params) =>
      moment(params.row.createdAt)
        .tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
        .add(7, 'hours') // Adding 3 hours (you can adjust this number as needed)
        .format("DD-MM-YYYY HH:mm:ss")
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
              rescueType === "Fixing"
                ? colors.greenAccent[700]
                : rescueType === "repair"
                ? colors.grey[800]
                : colors.grey[800]
                ? colors.redAccent[700]
                : rescueType === "Towing"
            }
          >
            {rescueType === "repair" && <BuildIcon />}
            {rescueType === "Towing" && <SupportIcon />}
            {rescueType === "Fixing" && <HandymanIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "8px" }}>
              {rescueType}
            </Typography>
          </Box>
        );
      },
    },
    { field: "area", headerName: "khu vực", width: 60, key: "area" },

    {
      field: "status",
      headerName: "Trạng Thái",
      width: 150,
      key: "status",
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
              status === "NEW"
                ? colors.greenAccent[700]
                : status === "ASSIGNED"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === "COMPLETED"
            }
          >
            {status === "NEW" && <AddCardIcon />}
            {status === "COMPLETED" && <CreditScoreIcon />}
            {status === "ASSIGNED" && <RepeatOnIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "8px" }}>
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
    {
      field: "orderDetails",
      headerName: "Chi Tiết Đơn Hàng",
      width: 120,
      renderCell: (params) => (
        <Grid container justifyContent="center" alignItems="center">
          <IconButton
            color="indigo"
            onClick={() => handleDetailClick(params.row.id)}
            aria-label="Chi Tiết Đơn Hàng"
          >
            <InfoIcon />
          </IconButton>
        </Grid>
      ),
      key: "bookDetail",
    }
  ];

  return (
    <Box m="5px">
      <Header
        title="Danh Sách Đơn Hàng Đã Bị Hủy"
        subtitle="Danh sách chi tiết đơn hàng đã bị hủy"
      />
      <Box display="flex" className="box" left={0}>
      <Box
          display="flex"
          borderRadius="5px"
          border={1}
          marginRight={2} 
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
          <FormControl >
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOption}
              onChange={handleFilterChange} // Use a different handler for this action
              variant="outlined"
              className="filter-select"
              style={{ width: '150px' }}
            >
              <MenuItem key="rescueType-all" value="rescueType">
                Hình Thức
              </MenuItem>
              <MenuItem key="rescueType-repair" value="repair">
                Sửa Chữa Tại Chỗ
              </MenuItem>
              <MenuItem key="rescueType-towing" value="Towing">
                Kéo Xe
              </MenuItem>
              <MenuItem key="rescueType-fixing" value="Fixing">
                Sữa Chữa
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
        selectedEditRescuseVehicleOwner={selectedEditOrder}
        onClose={() => setOpenEditModal(false)}
        loading={loading}
      />
      <ToastContainer />
    </Box>
  );
};

export default OrdersCancelled;
