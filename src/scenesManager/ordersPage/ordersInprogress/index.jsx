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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalDetail from "./ModalDetail";
import ModalEdit from "./ModalEdit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import { fetchOrdersInprogress, getOrderDetailId, getOrderId } from "../../../redux/orderSlice";
import { getCustomerIdFullName } from "../../../redux/customerSlice";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import { useLocation } from "react-router-dom";
import CustomTablePagination from "../../../components/TablePagination";
const OrdersInprogress = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const orders = useSelector((state) => state.order.orders);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("rescueType");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fullnameData, setFullnameData] = useState({});

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
      // Format startDate and endDate to the beginning of the day in the specified time zone
      const formattedStartDate = moment(startDate).tz("Asia/Ho_Chi_Minh").add(7, 'hours').startOf('day');
      const formattedEndDate = moment(endDate).tz("Asia/Ho_Chi_Minh").add(7, 'hours').startOf('day');
  
      const filteredOrders = orders.filter((order) => {
        // Adjust the order createdAt date to the same time zone
        const orderDate = moment(order.createdAt).tz("Asia/Ho_Chi_Minh").add(7, 'hours').startOf('day');
  
        const isAfterStartDate = orderDate.isSameOrAfter(formattedStartDate, "day");
        const isBeforeEndDate = orderDate.isSameOrBefore(formattedEndDate, "day");
        
        return isAfterStartDate && isBeforeEndDate;
      });
  
      setFilteredOrders(filteredOrders);
      setFilterOption("Date");
    } else {
      setFilteredOrders(orders);
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrdersInprogress())
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

  const handleAddServiceClick = (orderId) => {
    console.log(orderId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getOrderDetailId({ id: orderId }))
      .then((response) => {
        const orderDetails = response.payload.data;
        console.log("orderDetails"+orderDetails)
        setSelectedEditOrder(orderDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
        reloadOdersInprogress()
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng đang thực hiện:", error);
      });
  };
  const handleDetailClickDetail = (orderId) => {
    console.log(orderId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getOrderId({ id: orderId }))
      .then((response) => {
        const orderDetails = response.payload.data;
        setSelectedDetailOrder(orderDetails);
        setOpenModal(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng mới:", error);
      });
  };


  const reloadOdersInprogress = () => {
    dispatch(fetchOrdersInprogress())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredOrders(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách đơn hàng đang thực hiện:", error);
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
    // debouncedFetchAddresses(uniqueDepartures);
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
    filteredOrdersPagination =filteredOrders && filteredOrders.slice(
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
      width: 160,
      valueGetter: (params) => {
        // Get the fullname from the state based on customerId
        return fullnameData[params.value] || "";
      },
    },
    {
      field: "customerNote",
      headerName: "Ghi Chú của Customer",
      width: 160,
      key: "customerNote",
    },
    {
      field: "createdAt",
      headerName: "Ngày Tạo Đơn",
      width: 150,
      key: "createdAt",
      valueGetter: (params) =>
      moment(params.row.createdAt)
      .tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
      .add(7, 'hours') // Adding 3 hours (you can adjust this number as needed)
      .format("DD-MM-YYYY HH:mm:ss")
    },
    { field: "area", headerName: "khu vực", width: 60, key: "area" },
    {
      field: "rescueType",
      headerName: "Hình Thức",
      width: 120,
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
              {rescueType}
            </Typography>
          </Box>
        );
      },
    },
  

    {
      field: "status",
      headerName: "Trạng Thái",
      width: 100,
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
              status === "INPROGRESS"
                ? colors.green[100]
                : status === "ASSIGNED"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === "COMPLETED"
            }
            color={
              status === "INPROGRESS"
                ? colors.green[400]
                : colors.yellowAccent[700]
            }
          >
           
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
              {status}
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
        title="Danh Sách Đơn Hàng Đang Thực Hiện "
        subtitle="Danh sách chi tiết đơn hàng đang thực hiện"
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
             
              <MenuItem key="rescueType-towing" value="Towing">
                Kéo Xe
              </MenuItem>
              <MenuItem key="rescueType-fixing" value="Fixing">
                Sữa Chữa
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
                  max: moment().tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
                  .add(7, 'hours') // Adding 3 hours (you can adjust this number as needed)
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
                  max: moment().tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
                  .add(7, 'hours') // Adding 3 hours (you can adjust this number as needed)
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
        selectedDetailOrder={selectedDetailOrder}
        loading={loading}
      ></ModalDetail>


      <ModalEdit
      
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedEditOrder={selectedEditOrder}
        onClose={() => setOpenEditModal(false)}
        loading={loading}
      />
      <ToastContainer />
    </Box>
  );
};

export default OrdersInprogress;
