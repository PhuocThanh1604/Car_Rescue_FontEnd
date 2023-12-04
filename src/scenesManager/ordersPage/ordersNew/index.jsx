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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import ModalEdit from "./ModalEdit";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import "moment-timezone";

import {
  fetchOrdersNew,
  getFormattedAddressGG,
  getOrderId,
} from "../../../redux/orderSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCustomerIdFullName } from "../../../redux/customerSlice";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import { useLocation } from "react-router-dom";
import CustomTablePagination from "../../../components/TablePagination";
const Orders = (props) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const location = useLocation();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("rescueType");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fullnameData, setFullnameData] = useState({});
  const [formattedAddresses, setFormattedAddresses] = useState({});
  const [rescueVehicles, setRescueVehicles] = useState([]); // Tạo một state mới cho danh sách xe cứu hộ
  const [selectedOrderFormattedAddress, setSelectedOrderFormattedAddress] =
    useState("");
  const handleDataUpdated = () => {
    reloadOrdersNew();
  };
  useEffect(() => {
    reloadOrdersNew(); // Gọi hàm mới này thay vì gọi đệ quy
  }, [dispatch, location.pathname]);
  const reloadOrdersNew = () => {
    // setLoading(true);
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

    // Kiểm tra nếu orders không phải là một mảng hoặc nó không được thiết lập
    if (!Array.isArray(orders) || !orders.length) {
      // Thực hiện xử lý khi orders không tồn tại hoặc không phải là một mảng
      return;
    }

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
      toast.warning("Không tìm thấy dữ liệu orders.");
      return; // Dừng hàm nếu không tìm thấy mảng orders
    }

    if (
      startDate &&
      endDate &&
      moment(startDate).isValid() &&
      moment(endDate).isValid()
    ) {
      const formattedStartDate = moment(startDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");
      const formattedEndDate = moment(endDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");

      const filteredOrders = orders.filter((order) => {
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

      setFilteredOrders(filteredOrders);
      setFilterOption("Date");
    } else {
      toast.error("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.");
      // Xử lý khi startDate hoặc endDate không hợp lệ, ví dụ: hiển thị thông báo lỗi hoặc không thực hiện bất kỳ thay đổi nào
      // Ở đây có thể hiển thị thông báo lỗi hoặc không thực hiện bất kỳ thay đổi nào tùy theo yêu cầu cụ thể của bạn.
    }
  };

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
    setSelectedEditOrder(null);
    setRescueVehicles(null);
    // Lấy địa chỉ đã được định dạng từ state 'formattedAddresses' dựa trên 'departure'
    const orderWithDeparture = data.find((order) => order.id === orderId);
    if (orderWithDeparture) {
      // const formattedAddress = formattedAddresses[orderWithDeparture.departure];
      // console.log("formattedAddress: " + formattedAddress);

      // Kiểm tra xem có formattedAddress hay không
      // if (formattedAddress) {
      //   setSelectedOrderFormattedAddress(formattedAddress);
      // } else {
      //   console.error("Không tìm thấy địa chỉ đã định dạng cho đơn hàng này.");
      //   // Xử lý lỗi nếu không tìm thấy formattedAddress
      // }

      // Fetch the orderid details based on the selected order ID
      dispatch(getOrderId({ id: orderId }))
        .then((response) => {
          const orderDetails = response.payload.data;
          setSelectedEditOrder(orderDetails);
          // setSelectedOrderFormattedAddress(formattedAddress);
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
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  const fetchAddress = async (order) => {
    if (!order || formattedAddresses[order.departure]) {
      return; // Trả về nếu order không tồn tại hoặc địa chỉ đã được lưu trữ
    }

    const departure = order.departure;
    const matches = /lat:\s*([^,]+),\s*long:\s*([^,]+)/.exec(departure);

    if (matches && matches.length === 3) {
      const [, lat, lng] = matches;

      if (!isNaN(lat) && !isNaN(lng)) {
        try {
          const response = await dispatch(getFormattedAddressGG({ lat, lng }));
          const formattedAddress =
            response.payload.results[0].formatted_address;
          setFormattedAddresses((prevAddresses) => ({
            ...prevAddresses,
            [departure]: formattedAddress,
          }));
          setSelectedOrderFormattedAddress(formattedAddress);
        } catch (error) {
          console.error(
            "Error fetching address:",
            error.response ? error.response : error
          );
        } finally {
          setLoading(false); // Đảm bảo loading được đặt lại thành false dù có lỗi
        }
      }
    }
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
  const columns = [
    {
      field: "id",
      headerName: "Order",
      width: 100,
      key: "id",
    },
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
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
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
              status === "NEW"
                ? colors.greenAccent[700]
                : status === "ASSIGNED"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === "COMPLETED"
            }
            color={
              status === "NEW"
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
      headerName: "Diều Phối",
      width: 120,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          backgroundColor={colors.blueAccent[500]}
          onClick={() => handleAssignClick(params.row.id)}
        >
          <AssignmentLateIcon
            style={{ color: "orange" }}
            onClick={() => handleAssignClick(params.row.id)}
          />
          <Typography
            variant="body1"
            sx={{ ml: "1px", color: "inherit", fontWeight: "bold" }}
          >
            Điều phối
          </Typography>
        </IconButton>
      ),
      key: "update",
    },
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <>
        <Header
          title="Danh Sách Đơn Hàng Mới"
          subtitle="Danh sách chi tiết đơn hàng mới"
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
              sx={{ ml: 2, flex: 1 }}
              placeholder="Tìm kiếm..."
              onChange={handleSearchChange}
              className="search-input"
            />
            <IconButton type="button">
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

        <ModalEdit
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          selectedEditOrder={selectedEditOrder}
          selectedOrderFormattedAddress={selectedOrderFormattedAddress}
          onDataUpdated={handleDataUpdated}
          loading={loading}
        />

        <ToastContainer />
      </>
    </Box>
  );
};

export default Orders;
