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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers, deleteCustomer, getCustomerId } from "../../redux/customerSlice";
import { Edit, FilterList, Search } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
import ToggleButton from "./ToggleButton";
import { DeleteOutline } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import CustomTablePagination from "../../components/TablePagination";
const Customers = (props) => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.customers);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedEditCustomer, setSelectedEditCustomer] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
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
      const filteredCustomers = customers.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredCustomers(filteredCustomers);
      setFilterOption("Date");
    } else {
      setFilteredCustomers(customers);
    }
  };
  
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredCustomers(customers);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredcustomers = customers.filter(
        (customer) => customer.status === selectedStatusOption
      );
      setFilteredCustomers(filteredcustomers);
    }
  };
// Trong thành phần Customers.js
const handleUpdateClick = (customerId) => {
  console.log(customerId)
  // Fetch the customer details based on the selected customer ID
  dispatch(getCustomerId({ id: customerId }))
    .then((response) => {
      const customerDetails = response.payload.data; // No need for .data here
      setSelectedEditCustomer(customerDetails);
      setOpenEditModal(true);
      setIsSuccess(true);
    })
    .catch((error) => {
      console.error('Lỗi khi lấy thông tin khách hàng:', error);
    });
};
  



  useEffect(() => {
    const filteredCustomers = customers
      ? customers.filter((customer) => {
          const nameMatch = customer.fullname
            .toLowerCase()
            .includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" && customer.status === "ACTIVE") ||
            (filterOption === "INACTIVE" &&
              customer.status === "INACTIVE");
          return nameMatch && filterMatch;
        })
      : [];
    setFilteredCustomers(filteredCustomers);
  }, [customers, searchText, filterOption]);


  if (customers) {
    customers.forEach((customer) => {
      // Đây bạn có thể truy cập và xử lý dữ liệu từng đối tượng khách hàng ở đây
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchCustomers())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;

        if (data) {
          setData(data);
          setFilteredCustomers(data);
          // Truy xuất và xử lý từng đối tượng khách hàng ở đây
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

  const filteredcustomersPagination = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "fullname",
      headerName: "Tên Khách Hàng",
      width: 200,
      key: "fullname",
      cellClassName: "name-column--cell",
    },

    {
      field: "createAt",
      headerName: "Ngày Khởi Tạo",
      width: 150,
      key: "status",
      valueGetter: (params) =>
        moment(params.row.createAt).utcOffset(7).format("DD-MM-YYYY"),
    },
    {
      field: "avatar",
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
      field: "status",
      headerName: "Trạng Thái",
      width: 80,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" className="filter-box">
          <ToggleButton
            initialValue={params.value === "ACTIVE"}
            onChange={(value) => {
              const updatedcustomers = customers.map((customer) => {
                if (customer.CustomerId === params.row.CustomerId) {
                  return {
                    ...customer,
                    status: value ? "ACTIVE" : "INACTIVE",
                  };
                }
                return customer;
              });
              // setFilteredcustomers(updatedcustomers);
            }}
          />
        </Box>
      ),
      key: "status",
    },
    {
      field: "update",
      headerName: "Update",
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
    <Box m="10px">
      <Header title="Khách hàng" subtitle="Danh sách khách hàng" />

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
                Hoạt Động
              </MenuItem>
              <MenuItem key="status-unavailable" value="INACTIVE">
                Không Hoạt Động
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
        m="40px 0 0 0"
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
          rows={filteredcustomersPagination}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
        />

        <CustomTablePagination
          count={filteredCustomers.length}
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
        selectedCustomer={selectedCustomer}
        loading={loading}
      ></ModalDetail>
      <ModalEdit
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedEditCustomer={selectedEditCustomer}
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
            <Card>
              <CardContent>
                <Typography variant="h3">Confirm Delete</Typography>
                <Typography>
                  Are you sure you want to delete this Customer?
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  // onClick={handleConfirmDelete}
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
            </Card>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Customers;
