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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers, getCustomerId } from "../../redux/customerSlice";
import ModalDetail from "./ModalDetail";
import ModalEdit from "./ModalEdit";
import ToggleButton from "./ToggleButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import AddIcon from "@mui/icons-material/Add";
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
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const customersForCurrentPage = filteredCustomers.slice(startIndex, endIndex);
  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);
  // Lấy đối tượng manager từ localStorage
  const managerString = localStorage.getItem("manager");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  let manager = null;

  if (managerString) {
    try {
      manager = JSON.parse(managerString); // Thử phân tích chuỗi JSON
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }

  const handleSearchChange = (event) => {
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };
  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      // Format startDate and endDate to the beginning of the day in the specified time zone
      const formattedStartDate = moment(startDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");
      const formattedEndDate = moment(endDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");

      const filteredCustomers = customers.filter((customer) => {
        // Adjust the order createdAt date to the same time zone
        const orderDate = moment(customer.createAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .startOf("day");

        const isAfterStartDate = orderDate.isSameOrAfter(
          formattedStartDate,
          "day"
        );
        const isBeforeEndDate = orderDate.isSameOrBefore(
          formattedEndDate,
          "day"
        );

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
    console.log(customerId);
    // Fetch the customer details based on the selected customer ID
    dispatch(getCustomerId({ id: customerId }))
      .then((response) => {
        const customerDetails = response.payload.data; // No need for .data here
        setSelectedEditCustomer(customerDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
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
            (filterOption === "INACTIVE" && customer.status === "INACTIVE");
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
          setCustomersData(data);
          // Truy xuất và xử lý từng đối tượng khách hàng ở đây
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .catch((error) => {
        // Xử lý lỗi ở đây
        setLoading(false);
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

  const filteredCustomersPagination = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "fullname",
      headerName: "Tên Khách Hàng",
      width: 160,
      key: "fullname",
    },
    {
      field: "phone",
      headerName: "SĐT",
      width: 100,
      key: "phone",
    },
    {
      field: "address",
      headerName: "Địa Chỉ",
      width: 160,
      key: "address",
    },
    {
      field: "birthdate",
      headerName: "Ngày Sinh",
      width: 120,
      key: "birthdate",
      valueGetter: (params) =>
        moment(params.row.birthdate || "Không có thông tin")
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .format("DD-MM-YYYY"),
    },
    {
      field: "createAt",
      headerName: "Ngày Tạo",
      width: 140,
      key: "createAt",
      valueGetter: (params) =>
        moment(params.row.createAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      field: "avatar",
      headerName: "Hình ảnh",
      width: 100,
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
    // {
    //   field: "status",
    //   headerName: "Trạng Thái",
    //   width: 80,
    //   renderCell: (params) => (
    //     <Box display="flex" alignItems="center" className="filter-box">
    //       <ToggleButton
    //         initialValue={params.value === "ACTIVE"}
    //         onChange={(value) => {
    //           const updatedcustomers = customers.map((customer) => {
    //             if (customer.CustomerId === params.row.CustomerId) {
    //               return {
    //                 ...customer,
    //                 status: value ? "ACTIVE" : "INACTIVE",
    //               };
    //             }
    //             return customer;
    //           });
    //           // setFilteredcustomers(updatedcustomers);
    //         }}
    //       />
    //     </Box>
    //   ),
    //   key: "status",
    // },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 140,
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
              status === "ACTIVE"
                ? colors.green[300]
                : status === "ASSIGNED"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === "COMPLETED"
            }
            color={
              status === "ACTIVE" ? colors.green[800] : colors.yellowAccent[700]
            }
          >
            {status === "ACTIVE"}
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
              {status === "ACTIVE"
                ? "Đang Hoạt Động"
                : status === "INACTIVE"
                ? "Không Hoạt Động"
                : status === "ASSIGNED"
                ? "Đang Làm Việc"
                : status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "update",
      headerName: "Update",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
              // Thay đổi màu sắc hoặc hiệu ứng khác khi hover vào Box
              backgroundColor: "lightgray",

              borderRadius: "4px",
            },
          }}
        >
          {" "}
          <IconButton
            variant="contained"
            color="error"
            onClick={() => handleUpdateClick(params.row.id)}
          >
            <Typography
              variant="body1"
              sx={{ ml: "1px", color: "indigo", fontWeight: "bold" }}
              onClick={() => handleUpdateClick(params.row.id)}
            >
              Chỉnh Sửa
            </Typography>
          </IconButton>{" "}
        </Box>
      ),
      key: "update",
    },
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header title="Khách hàng" subtitle="Danh sách khách hàng" />

      <Box display="flex" className="box" left={0}>
        <Box
          display="flex"
          borderRadius="6px"
          border={1}
          marginRight={1}
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
            onChange={(event) => {
              setStartDate(event.target.value);
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
            sx={{ ml: 1, mr: 1 }}
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
            sx={{ mr: 1 }}
          />
        </Box>

        <Box
          display="flex"
          borderRadius="6px"
          sx={{
            height: "auto",
            width: "auto",
            alignItems: "center",
          }}
        >
          {manager && ( // Kiểm tra xem manager đã được đặt
            <a href="add/customer" style={{ textDecoration: "none" }}>
              {" "}
              {/* Thêm đường dẫn ở đây */}
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disableElevation
                sx={{
                  width: "136px",
                  height: "50px",
                }}
              >
                <AddIcon sx={{ color: "white", fontWeight: "bold" }} />
                <Typography sx={{ color: "white", fontWeight: "bold" }}>
                  Tạo Khách Hàng
                </Typography>
              </Button>
            </a>
          )}
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
          rows={customersForCurrentPage}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
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
