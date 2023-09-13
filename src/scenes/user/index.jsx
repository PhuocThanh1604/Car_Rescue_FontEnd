import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Pagination,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { fetchusers } from '../../redux/userSlice';
import { FilterList, Search } from '@mui/icons-material';
import CustomTablePagination from '../products/TablePagination';
import ToggleButton from '../products/ToggleButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import moment from 'moment';
const User = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selecteduser, setSelecteduser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterOption, setFilterOption] = useState('Status');
  const [openModal, setOpenModal] = useState(false);
  // const [selecteduser, setSelecteduser] = useState(null);
  // const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const nameMatch = users.name && users.name.toLowerCase().includes(searchText.toLowerCase());
  const [loading, setLoading] = useState(false);
  const handleEditClick = (user) => {
    setSelecteduser(user);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelecteduser(user);
    setOpenDeleteModal(true);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value || '');
  };

  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredUsers = users.filter((user) => {
        const orderDate = moment(user.createAt).format('YYYY-MM-DD');
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredUsers(filteredUsers);
      setFilterOption('Date');
    } else {
      setFilteredUsers(users);
    }
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === 'Status') {
      // Hiển thị tất cả các trạng thái
      setFilteredUsers(users);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredUsers = users.filter(
        (user) => user.status === selectedStatusOption
      );
      setFilteredUsers(filteredUsers);
    }
  };

  const handleuserDetailClick = (user) => {
    selecteduser(user);
    setOpenModal(true);
  };

  useEffect(() => {
    const filteredUsers = users.filter((user) => {
      const nameMatch = user.userName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const filterMatch =
        filterOption === 'Status' ||
        (filterOption === 'Active' && user.status === 'Active');
      return nameMatch && filterMatch;
    });
    setFilteredUsers(filteredUsers);
  }, [users, searchText, filterOption]);

  const filteredUsersPagination = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    setLoading(true);
    dispatch(fetchusers())
      .then(() => {
        // Không cần setFilteredusersStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: 'userId', headerName: 'ID', key: 'userId' },
    {
      field: 'userName',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell',
      key: 'userName',
    },
    {
      field: 'dob',
      headerName: 'Dob',
      flex: 1,
      with: 100,
      type: 'date',
      headerAlign: 'left',
      align: 'left',
      key: 'dob',
      valueGetter: (params) =>
        moment(params.row.createAt).utcOffset(7).format('DD-MM-YYYY'),
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      flex: 1,
      with: 80,
      key: 'phone',
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {params.value ? params.value : 'null'}
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      key: 'email',
    },
    {
      field: 'avatar',
      headerName: 'Image',
      width: 120,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <img
            src={params.value}
            alt="User Avatar"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        </Box>
      ),
      key: 'image',
    },
    {
      field: 'role',
      headerName: 'Access Level',
      flex: 1,
      key: 'role',
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="50%"
            m="0 auto"
            p="5px"
            l="0px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === 'User'
                ? colors.greenAccent[600]
                : role === 'Admin'
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"> {/* Fix the typo here */}
            {role === 'Admin' && <AdminPanelSettingsOutlinedIcon />}
            {role === 'Manager' && <SecurityOutlinedIcon />}
            {role === 'User' && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '10px' }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
    
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" className="filter-box">
          <ToggleButton
            initialValue={params.value === 'Active'}
            onChange={(value) => {
              const updatedUsers = users.map((user) => {
                if (user.userId === params.row.userId) {
                  return {
                    ...user,
                    status: value ? 'Active' : 'Unavailable',
                  };
                }
                return user;
              });
              setFilteredUsers(updatedUsers);
            }}
          />
        </Box>
      ),
      key: 'status',
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box display="flex" alignItems="center">
        <Box
          display="flex"
          borderRadius="5px"
          className="search-box"
          border={1}
          marginRight={2}>
          <InputBase
            sx={{ ml: 4, flex: 1, padding: 1.3 }}
            placeholder="Search"
            value={
              searchText !== null && searchText !== undefined ? searchText : ''
            }
            onChange={handleSearchChange}
            className="search-input"
            type="text"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <ToastContainer />
        <Box display="flex" alignItems="center" className="filter-box">
          <Select
            value={filterOption}
            onChange={handleFilterChange}
            variant="outlined"
            className="filter-select">
            <MenuItem key="status-all" value="Status">
              Status
            </MenuItem>
            <MenuItem key="status-active" value="Active">
              Active
            </MenuItem>

            <MenuItem key="status-unavailable" value="Unavailable">
              Unavailable
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
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            display: 'none',
          },
          '& .MuiDataGrid-row': {
            borderBottom: 'none !important',
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-row': {
            borderBottom: 'none',
          },
        }}>
        <DataGrid
          rows={filteredUsersPagination}
          columns={columns}
          getRowId={(row) => row.userId}
          autoHeight
          checkboxSelection
          loading={loading}
        />

        <CustomTablePagination
          count={filteredUsers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filteredUsers.length / rowsPerPage)}
            page={page-1}
            onChange={(event, newPage) => setPage(newPage+1)}
            showFirstButton
            showLastButton
            siblingCount={1}
          />
        </Box> */}
      </Box>
    </Box>
  );
};

export default User;
