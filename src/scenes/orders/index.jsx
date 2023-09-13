import React, { useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridPagination } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { FilterList, Search } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getError } from '../../utils/utils';
import MyModal from '../orders/ModalComponent';
import ToggleButton from '../products/ToggleButton';
import CustomTablePagination from '../products/TablePagination';
import { fetchOrders, fetchOrdersDetail } from '../../redux/orderSlice';
import { fetchusers, getUserId } from '../../redux/userSlice';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import moment from 'moment';
const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const users = useSelector((state) => state.user.users);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterOption, setFilterOption] = useState('Status');
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  // const nameMatch = orders.name && orders.name.toLowerCase().includes(searchText.toLowerCase());
  const [ordersDetailId, setOrdersDetailId] = useState(null);

  const [isFiltering, setIsFiltering] = useState(false);
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setOpenDeleteModal(true);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value || ''; // Use an empty string if the value is null
    setSearchText(value);
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);
    setIsFiltering(true);
    if (selectedStatusOption === 'Status') {
      // Hiển thị tất cả các trạng thái
      setFilteredOrders(orders);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredorders = orders.filter(
        (order) => order.status === selectedStatusOption
      );
      setFilteredOrders(filteredorders);
    }
  };

  const handleOrderDetailClick = (order) => {
    if (order.ordersDetails) {
      dispatch(fetchOrders(order.ordersDetails.ordersDetailId))
        .then(() => {
          setSelectedOrderDetail(order.ordersDetails);
          setOpenModal(true);
          console.log(order.ordersDetails.ordersDetailId);
        })
        .catch((error) => {
          console.error('Failed to fetch order details:', error);
          // Xử lý lỗi
        });
    }
  };
  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredOrders = orders.filter((order) => {
        const orderDate = moment(order.createAt).format('YYYY-MM-DD');
        const isAfterStartDate = startDate
          ? moment(orderDate).isSameOrAfter(startDate)
          : true;
        const isBeforeEndDate = endDate
          ? moment(orderDate).isSameOrBefore(endDate)
          : true;
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredOrders(filteredOrders);
      setFilterOption('Date');
    } else {
      // Nếu startDate và endDate đều là null, đặt danh sách đã lọc thành danh sách gốc
      setFilteredOrders(orders);
      setFilterOption('Status');
    }
  };

  useEffect(() => {
    const filteredOrders = orders.filter((order) => {
      const nameMatch = order.createAt
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const filterMatch =
        filterOption === 'Status' ||
        (filterOption === 'Paid' && order.status === 'Paid') ||
        (filterOption === 'Unpaid' && order.status === 'Unpaid');
      const dateMatch = selectedDate
        ? moment(order.createAt).utcOffset(7).format('DD-MM-YYYY') ===
          selectedDate
        : true;
      return nameMatch && filterMatch && dateMatch;
    });
    setFilteredOrders(filteredOrders);
  }, [orders, searchText, filterOption, selectedDate]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrders())
      .then(() => {
        // Lặp qua mảng orders và truy xuất mảng ordersDetails
        const details = orders.map((order) => order.ordersDetails);
        setOrdersDetails(details);
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  useEffect(() => {
    // Lặp qua danh sách đơn hàng và gán userName dựa trên userId
    const ordersWithUserNames = orders.map((order) => {
      const user = users.find((user) => user.userId === order.userId);
      const userName = user ? user.userName : 'Unknown User';
      return { ...order, userName };
    });

    // Cập nhật danh sách đơn hàng đã được gán userName
    setFilteredOrders(ordersWithUserNames);
  }, [orders, users]);
  useEffect(() => {
    dispatch(fetchusers())
      .then(() => {
        // Không cần setFilteredordersStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
        // Xử lý lỗi
      });
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredordersPagination = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: 'orderId', headerName: 'ID', width: 50, key: 'orderId' },
    {
      field: 'userId',
      headerName: 'User',
      width: 200,
      key: 'userId',
      valueGetter: (params) => params.row.userName,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      key: 'price',
      valueFormatter: (params) => params.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
    {
      field: 'status',
      headerName: 'Trạng Thái',
      width: 160,
      key: 'status',
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="70%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            borderRadius={10} // Corrected prop name from "buserRadius" to "borderRadius"
            backgroundColor={
              status === 'Paid'
                ? colors.greenAccent[700]
                : status === 'Unpaid'
                ? colors.redAccent[700]
                : colors.redAccent[700]
            }>
            {status === 'Unpaid' && <CreditCardOffIcon />}
            {status === 'Paid' && <CreditScoreIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '8px' }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'createAt',
      headerName: 'Ngày tạo',
      width: 150,
      valueGetter: (params) =>
        moment(params.row.createAt).utcOffset(7).format('DD-MM-YYYY'),
    },
    {
      field: 'ordersDetails',
      headerName: 'Order Detail',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOrderDetailClick(params.row)}>
          Order Detail
        </Button>
      ),
      key: 'ordersDetails',
    },
  ];

  return (
    <Box m="10px">
      <Header title="order" subtitle="List of Order" />
      <Box display="flex" alignItems="center" className="search-box">
        <Box
          display="flex"
          borderRadius="5px"
          className="search-box"
          border={1}
          marginRight={2}>
          <InputBase
            sx={{ ml: 4, flex: 1, padding: 1.3 }}
            placeholder="Search"
            onChange={handleSearchChange}
            className="search-input"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" className="filter-box">
          <Select
            value={filterOption}
            onChange={handleFilterChange}
            variant="outlined"
            className="filter-select">
            <MenuItem key="status-all" value="Status">
              Trạng Thái
            </MenuItem>
            <MenuItem key="status-Paid" value="Paid">
              Paid
            </MenuItem>
            <MenuItem key="status-Unpaid" value="Unpaid">
              Unpaid
            </MenuItem>
          </Select>
        </Box>
        <Box display="flex" alignItems="center" className="startDate-box">
          <TextField
            label="Từ ngày"
            type="date"
            value={startDate || ''}
            onChange={(event) => setStartDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleDateFilterChange}
            inputProps={{
              max: moment().format('YYYY-MM-DD'), // Set the maximum selectable date as today
            }}
            sx={{ ml: 4, mr: 2 }}
          />
        </Box>

        <Box display="flex" alignItems="center" className="endtDate-box">
          <TextField
            label="Đến ngày"
            type="date"
            value={endDate || ''}
            onChange={(event) => setEndDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleDateFilterChange}
            inputProps={{
              max: moment().format('YYYY-MM-DD'), // Set the maximum selectable date as today
            }}
          />
        </Box>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            display: 'none',
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-row': {
            borderBottom: 'none',
          },
        }}>
        <DataGrid
          rows={filteredordersPagination}
          columns={columns}
          getRowId={(row) => row.orderId}
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
      <MyModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedOrderDetail={selectedOrderDetail}
        loading={loading}
      />
    </Box>
  );
};

export default Orders;
