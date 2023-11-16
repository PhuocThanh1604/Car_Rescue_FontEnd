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
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
import CustomTablePagination from "./TablePagination";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";

import {
  fetchOrdersNew,
  getFormattedAddressGG,
  getFormattedAddressMapbox,
  getOrderId,
} from "../../../redux/orderSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCustomerIdFullName } from "../../../redux/customerSlice";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AddCardIcon from "@mui/icons-material/AddCard";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import { useLocation } from "react-router-dom";
const Orders = (props) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const location = useLocation();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("rescueType");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
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
  const [formattedAddresses, setFormattedAddresses] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [rescueVehicles, setRescueVehicles] = useState([]); // Tạo một state mới cho danh sách xe cứu hộ
  const [selectedOrderFormattedAddress, setSelectedOrderFormattedAddress] =
    useState("");

  //Reload data after assigning
  const handleDataUpdated = () => {
    reloadOrdersNew();
  };

  const reloadOrdersNew = () => {
    setLoading(true);
    dispatch(fetchOrdersNew())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredOrders(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách đơn hàng mới:", error);
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
    if (startDate && endDate) {
      const filteredOrders = orders.filter((user) => {
        const orderDate = moment(orders.createdAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredOrders(filteredOrders);
      setFilterOption("Date");
    } else {
      setFilteredOrders(orders);
    }
  };

  useEffect(() => {
    reloadOrdersNew(); // Gọi hàm mới này thay vì gọi đệ quy
  }, [dispatch, location.pathname]);

  useEffect(() => {
    setLoading(true); // Bắt đầu với trạng thái loading

    const timer = setTimeout(() => {
      setLoading(false); // Kết thúc trạng thái loading sau một khoảng thời gian
    }, 3000); // Thời gian loading là 3000ms (3 giây)

    return () => clearTimeout(timer); // Dọn dẹp khi component unmount
  }, []);

  const handleAssignClick = (orderId) => {
    console.log(orderId);
    // Đặt trạng thái của danh sách xe cứu hộ về một mảng trống
    setRescueVehicles(null);

    // Lấy địa chỉ đã được định dạng từ state 'formattedAddresses' dựa trên 'departure'
    const orderWithDeparture = data.find((order) => order.id === orderId);
    if (orderWithDeparture) {
      const formattedAddress = formattedAddresses[orderWithDeparture.departure];
      console.log("formattedAddress: " + formattedAddress);

      // Kiểm tra xem có formattedAddress hay không
      if (formattedAddress) {
        setSelectedOrderFormattedAddress(formattedAddress);
      } else {
        console.error("Không tìm thấy địa chỉ đã định dạng cho đơn hàng này.");
        // Xử lý lỗi nếu không tìm thấy formattedAddress
      }

      // Fetch the orderid details based on the selected order ID
      dispatch(getOrderId({ id: orderId }))
        .then((response) => {
          const orderDetails = response.payload.data;
          setSelectedEditOrder(orderDetails);
          setSelectedOrderFormattedAddress(formattedAddress);
          setOpenEditModal(true);
          setIsSuccess(true);
          reloadOrdersNew();
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin đơn hàng mới:", error);
        });
    }
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      fetchOrdersNew();
    }
  }, [data]); // Chỉ gọi API nếu 'data' rỗng hoặc chưa được tải

  // ...

  useEffect(() => {
    const uniqueCustomerIds = [...new Set(data.map((row) => row.customerId))];
    const uniqueDepartures = [...new Set(data.map((row) => row.departure))];

    const fetchFullNames = async (customerIds) => {
      const uniqueCustomerIdsToFetch = customerIds.filter(
        (customerId) => !fullnameData[customerId]
      );

      const fetchPromises = uniqueCustomerIdsToFetch.map((customerId) =>
        fetchFullname(customerId)
      );

      await Promise.all(fetchPromises);
    };

    // const debouncedFetchAddresses = debounce(async (departures) => {
    //   const uniqueDeparturesToFetch = departures.filter(
    //     (departure) => !formattedAddresses[departure]
    //   );

    //   const fetchPromises = uniqueDeparturesToFetch.map((departure) => {
    //     const order = data.find((order) => order.departure === departure);
    //     return fetchAddress(order);
    //   });

    //   await Promise.all(fetchPromises);
    // }, 500);

    fetchFullNames(uniqueCustomerIds);
    // debouncedFetchAddresses(uniqueDepartures);
  }, [data, formattedAddresses, fullnameData]);
  // function debounce(func, wait) {
  //   let timeout;
  //   return function () {
  //     const context = this;
  //     const args = arguments;
  //     const later = function () {
  //       timeout = null;
  //       func.apply(context, args);
  //     };
  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, wait);
  //   };
  // }
  // const fetchAddress = async (order) => {
  //   if (!order || formattedAddresses[order.departure]) {
  //     return; // Trả về nếu order không tồn tại hoặc địa chỉ đã được lưu trữ
  //   }

  //   const departure = order.departure;
  //   const matches = /lat:\s*([^,]+),\s*long:\s*([^,]+)/.exec(departure);

  //   if (matches && matches.length === 3) {
  //     const [, lat, lng] = matches;

  //     if (!isNaN(lat) && !isNaN(lng)) {
  //       try {
  //         const response = await dispatch(getFormattedAddressGG({ lat, lng }));
  //         const formattedAddress =
  //           response.payload.results[0].formatted_address;
  //         setFormattedAddresses((prevAddresses) => ({
  //           ...prevAddresses,
  //           [departure]: formattedAddress,
  //         }));
  //         setSelectedOrderFormattedAddress(formattedAddress);
  //       } catch (error) {
  //         console.error(
  //           "Error fetching address:",
  //           error.response ? error.response : error
  //         );
  //       } finally {
  //         setLoading(false); // Đảm bảo loading được đặt lại thành false dù có lỗi
  //       }
  //     }
  //   }
  // };

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
      width: 140,
      renderCell: (params) => {
        return fullnameData[params.value] ? (
          fullnameData[params.value]
        ) : (
          <CircularProgress size={20} />
        );
      },
    },
    // {
    //   field: "departure",
    //   headerName: "Địa Chỉ",
    //   width: 240,
    //   renderCell: (params) => {
    //     if (params.value) {
    //       return formattedAddresses[params.value]
    //         ? formattedAddresses[params.value]
    //         : <CircularProgress size={20} />;
    //     }
    //     return ""; // Trả về chuỗi rỗng nếu không có địa chỉ
    //   },
    // },
    {
      field: "customerNote",
      headerName: "Ghi Chú của Customer",
      width: 120,
      key: "customerNote",
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 100,
      key: "createdAt",
      valueGetter: (params) =>
        moment(params.row.createdAt).utcOffset(7).format("DD-MM-YYYY"),
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
                ? colors.yellowAccent[400]
                : colors.grey[800]
                ? colors.redAccent[600]
                : rescueType === "Towing"
            }
          >
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
      headerName: "Diều Phối",
      width: 60,
      renderCell: (params) => (
        <IconButton variant="contained" color="error">
          <AssignmentLateIcon
            variant="contained"
            color="error"
            style={{ color: "orange" }}
            onClick={() => handleAssignClick(params.row.id)}
          ></AssignmentLateIcon>
        </IconButton>
      ),
      key: "update",
    },
  ];

  return (
    <Box m="5px">
      {loading ? (
        <Typography>Loading...</Typography> // Hiển thị thông báo loading
      ) : (
        <>
          <Header
            title="Danh Sách Đơn Hàng Mới"
            subtitle="Danh sách chi tiết đơn hàng mới"
          />
          <Box display="flex" className="box" left={0}>
            <Box display="flex" borderRadius="5px" border={1} marginRight={2}>
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
                <MenuItem key="rescueType-fixing" value="Fixing">
                  Lái Xe Về
                </MenuItem>
                <MenuItem key="rescueType-fixing" value="Fixing">
                  Chở Xe
                </MenuItem>
              </Select>
            </FormControl>

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
            selectedEditOrder={selectedEditOrder}
            selectedOrderFormattedAddress={selectedOrderFormattedAddress}
            onDataUpdated={handleDataUpdated}
            // onClose={() => setOpenEditModal(false)}
            loading={loading}
          />
          <ToastContainer />
        </>
      )}
    </Box>
  );
};

export default Orders;
