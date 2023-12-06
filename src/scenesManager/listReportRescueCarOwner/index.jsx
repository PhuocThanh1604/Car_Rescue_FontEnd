import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  TextField,
  IconButton,
  Typography,
  Grid,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import ModalDetail from "./ModalDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import {
  getReportAll,
  getReportAllNew,
  getReportById,
} from "../../redux/rescueVehicleOwnerSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomTablePagination from "../../components/TablePagination";
import { getOrderId } from "../../redux/orderSlice";
import { tokens } from "../../theme";
import { getCustomerId } from "../../redux/customerSlice";

const ListReports = (props) => {
  const dispatch = useDispatch();
  const rescueVehicleOwners = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const iconColor = { color: colors.blueAccent[500] };
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status"); 
  const [openModal, setOpenModal] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataReport, setDataReport] = useState(null);
  const [initialFormState, setInitialFormState] = useState({});
  const [editStatus, setEditStatus] = useState({});
  const [orderIds, setOrderIds] = useState([]);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [dataFullnameOfCustomer, setDataFullnameOfCustomer] = useState({});
  

  //Chấp nhận order

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

      const filteredOrders = rescueVehicleOwners.filter((order) => {
        // Adjust the order createdAt date to the same time zone
        const orderDate = moment(order.createdAt)
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

      setFilteredVehicles(filteredOrders);
      setFilterOption("Date");
    } else {
      setFilteredVehicles(rescueVehicleOwners);
    }
  };
  useEffect(() => {
    if (Array.isArray(rescueVehicleOwners)) {
      const vehicleId = rescueVehicleOwners.id; // Xem xét lại điều này, có vẻ như vehicles.id không đúng
      const vehicleToEdit = rescueVehicleOwners.find(
        (vehicle) => vehicle.id === vehicleId
      );

      if (vehicleToEdit) {
        setEditStatus(vehicleToEdit);
        setInitialFormState(vehicleToEdit);
      }
    }
  }, [rescueVehicleOwners]);

  const handleDetailClickDetail = (orderId) => {
    console.log(orderId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getReportById({ id: orderId }))
      .then((response) => {
        const dataReport = response.payload.data;
        setDataReport(dataReport)
        dispatch(getOrderId({ id: dataReport.orderId }))
          .then((response) => {
            const orderDetail = response.payload.data;
            setSelectedEditOrder(orderDetail);
            setOpenModal(true);
          })
          .catch((error) => {
            toast.error("Lỗi khi lấy thông tin báo cáo:", error);
          });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng mới:", error);
      });
  };
  // Thay đổi hàm useEffect để lọc từ dữ liệu gốc
// Inside handleFilterChange function
const handleFilterChange = (event) => {
  const selectedStatusOption = event.target.value;
  setFilterOption(selectedStatusOption);
  setPage(0); // Reset to the first page when changing filters
};

// Inside useEffect
useEffect(() => {
  let updatedFilteredVehicles = [];

  if (Array.isArray(rescueVehicleOwners)) {
    updatedFilteredVehicles = rescueVehicleOwners.filter((vehicle) => {
      const nameMatch =
        vehicle.vinNumber &&
        vehicle.vinNumber.toLowerCase().includes(searchText.toLowerCase());
      const filterMatch =
        filterOption === 'Status' || vehicle.status === 'FINISHED';

      return nameMatch && filterMatch;
    });
  }

  setFilteredVehicles(updatedFilteredVehicles);
}, [rescueVehicleOwners, searchText, filterOption]);


useEffect(() => {
  setLoading(true);
  try {
    dispatch(getReportAll())
      .then((response) => {
        if (!response || !response.payload || !response.payload.data) {
          setLoading(false);
          return;
        } 
        const data = response.payload.data;
        console.log(data);
        setData(data);
        setFilteredVehicles(data);
      })
      .catch((error) => {
        console.error("Error while fetching report data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  } catch (error) {
    console.error("Error in useEffect:", error);
    setLoading(false);
  }
}, [dispatch]);


useEffect(() => {
  try {
    // Extract orderIds from the data and store them in the state with unique keys
    const extractedOrderIds = data.map((row, index) => ({
      orderId: row.orderId,
      uniqueKey: `${row.orderId}_${index}`, // Create a unique key by appending index
    }));
    setOrderIds(extractedOrderIds);
  } catch (error) {
    toast.error("Error in extracting orderIds:", error);
    // Handle errors here if needed
  }
}, [data]);

useEffect(() => {
  // Fetch individual orders based on the orderIds
  orderIds.forEach((order) => {
    fetchOrder(order.orderId, order.uniqueKey);
  });
}, [orderIds]);

const fetchOrder = (orderId, uniqueKey) => {
  if (orderId) {
    dispatch(getOrderId({ id: orderId }))
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          const customerId = data.customerId;
          dispatch(getCustomerId({ id: customerId }))
            .then((response) => {
              const dataCustomer = response.payload.data;
              console.log(dataCustomer.fullname);
              setDataFullnameOfCustomer((prevData) => ({
                ...prevData,
                [orderId]: dataCustomer.fullname, // Use uniqueKey as the key
              }));
            })
            .catch((error) => {
              toast.error("Error while fetching customer data:", error);
            });
        } else {
          toast.error("Fullname not found in the API response.");
        }
      })
      .catch((error) => {
        console.error("Error while fetching customer data:", error);
      });
  }
};

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

  
  const columns = [
    {
      field: "id",
      headerName: "id",
      width: 100,
      key: "id",
    },
  
    {
      field: "orderId",
      headerName: "Tên Khách Hàng",
      width: 140,
      renderCell: (params) => {
        return dataFullnameOfCustomer[params.value] ? (
          dataFullnameOfCustomer[params.value]
        ) : (
          <CircularProgress size={20} />
        );
      },
    },
    
    
    {
      field: "createdAt",
      headerName: "Ngày Tạo Đơn",
      width: 140,
      key: "createdAt",
      valueGetter: (params) =>
        moment(params.row.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .format("DD-MM-YYYY HH:mm:ss"),
    },
    { field: "content", headerName: "Nội Dung", width: 240, key: "content" },
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
              status === "FINISHED"
                ? colors.greenAccent[700]
                : status === "INACTIVE"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === "COMPLETED"
            }
            color={
              status === "FINISHED"
                ? colors.greenAccent[300]
                : colors.yellowAccent[700]
            }
          >
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
            {status === "INACTIVE"
                ? "Không Thành Công"
                : status === "FINISHED"
                ? "Hoành Thành"
                : status}
            </Typography>
          </Box>
        );
      },
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
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header
        title="Danh Sách Đơn Báo Cáo"
        subtitle="Danh sách đơn báo cáo"
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
              <MenuItem key="status-FINISHED" value="FINISHED">
                Hoành thành
              </MenuItem>
            
              <MenuItem key="status-INACTIVE" value="INACTIVE">
                Không thành công
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
          rows={filteredVehiclePagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
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
        selectedEditOrder={selectedEditOrder}
        dataReport={dataReport}
        loading={loading}
      ></ModalDetail>
    </Box>
  );
};

export default ListReports;
