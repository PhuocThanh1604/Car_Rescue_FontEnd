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
  Button,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import ModalDetail from "./ModalDetail";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";

import {
  fetchOrdersCompleted,
  getOrderDetailId,
  getOrderId,
} from "../../../redux/orderSlice";
import { getCustomerIdFullName } from "../../../redux/customerSlice";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import { useLocation } from "react-router-dom";
import CustomTablePagination from "../../../components/TablePagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalEdit from "./ModalEdit";
import areaData from "../../../data.json";
import InfoIcon from "@mui/icons-material/Info";
const Orders = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const orders = useSelector((state) => state.order.orders);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("rescueType");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fullnameData, setFullnameData] = useState({});
  const [dataJson, setDataJson] = useState([]);
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu");
    }
    setDataJson(areaData);
  }, [dataJson]);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
     // Kiểm tra nếu không có dữ liệu orders hoặc fullnameData
  if (!Array.isArray(orders) || !Object.keys(fullnameData).length) {
    // Thực hiện xử lý khi không có dữ liệu
    return;
  }
    const filteredOrders = (orders || []).filter((order) => {
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
  
    if (Array.isArray(orders)) { // Kiểm tra nếu orders là một mảng
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
    } else {
      // Xử lý khi orders không phải là mảng (ví dụ: không được khởi tạo)
      console.error('Orders is not an array');
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
      toast.error('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.');
      // Xử lý khi startDate hoặc endDate không hợp lệ, ví dụ: hiển thị thông báo lỗi hoặc không thực hiện bất kỳ thay đổi nào
      // Ở đây có thể hiển thị thông báo lỗi hoặc không thực hiện bất kỳ thay đổi nào tùy theo yêu cầu cụ thể của bạn.
    }
  };
 

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrdersCompleted())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredOrders(data);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }else{
          toast.dismiss("Lỗi khi lấy dữ liệu đơn hoàn thành:");
        }
      })
      .catch(error => {
      
        toast.dismiss("Lỗi khi lấy dữ liệu hoàn thành:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch,location.pathname]);



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

  const handleServiceClickDetail = (orderId) => {
    console.log(orderId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getOrderDetailId({ id: orderId }))
      .then((response) => {
        const orderDetails = response.payload.data;
        console.log("orderDetails"+orderDetails)
      
        setSelectedOrder(orderDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đơn hàng đang thực hiện:", error);
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
      width: 260,
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
        .add(7, 'hours') 
        .format("DD-MM-YYYY HH:mm:ss")
    },
    {
      field: "area",
      headerName: "Khu Vực",
      width: 120,
      key: "area",
      renderCell: ({ row }) => {
        const { area } = row;

        let displayedArea = "Không có dữ liệu";
        let areaDescription = ""; // Mô tả khu vực

        if (dataJson.area && dataJson.area.length > 0) {
          switch (area) {
            case 1:
              displayedArea = dataJson.area[0]?.name || "Không có";
              areaDescription =
                dataJson.area[0]?.description || "Không có mô tả";
              break;
            case 2:
              displayedArea = dataJson.area[1]?.name || "Không có";
              areaDescription =
                dataJson.area[1]?.description || "Không có mô tả";
              break;
            case 3:
              displayedArea = dataJson.area[2]?.name || "Không có";
              areaDescription =
                dataJson.area[2]?.description || "Không có mô tả";
              break;
            default:
              displayedArea = "Không có dữ liệu";
          }
        }

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="inherit">{displayedArea}</Typography>
            <Tooltip
              title={areaDescription.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            >
              <InfoIcon style={{ marginLeft: "5px", fontSize: "16px" }} />
            </Tooltip>
          </Box>
        );
      },
    },
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
                ? colors.cyan[300]
                : status === "COMPLETED"
            }
            color={
              status === "COMPLETED"
                ? colors.cyan[700]
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
      headerName: "Dịch Vụ",
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
            onClick={() => handleServiceClickDetail(params.row.id)}
          >
            <AssignmentIcon
              sx={{color:colors.grey[700]}}
              onClick={() => handleServiceClickDetail(params.row.id)}
              aria-label="Chi Tiết Đơn Hàng"
         
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginLeft: "5px" }}
              onClick={() => handleServiceClickDetail(params.row.id)}
            >
              {"Dịch Vụ"}
            </Typography>
          </Box>
        </Grid>
      ),
      key: "orderDetails",
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
        title="Danh Sách Đơn Hàng Đã Hoàn Thành"
        subtitle="Danh sách chi tiết đơn hàng đã hoàn thành"
      />
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
                  max: moment().tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
                  .add(7, 'hours') // Adding 3 hours (you can adjust this number as needed)
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
                  max: moment().tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
                  .add(7, 'hours') // Adding 3 hours (you can adjust this number as needed)
                  .format("DD-MM-YYYY"), // Set the maximum selectable date as today
                }}
                sx={{  mr: 1 }}
              />
            </Box>

            <Box       display="flex"
            borderRadius="6px"
            sx={{
              height: "auto",
              width: "auto",
              alignItems: "center", // Các nút được căn giữa theo chiều dọc
            }}>
            <a href="add/orderOffline" style={{ textDecoration: "none" }}>
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
                  Tạo Đơn Hàng
                </Typography>
              </Button>
            </a>
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
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <ModalEdit
      
      openEditModal={openEditModal}
      setOpenEditModal={setOpenEditModal}
      selectedEditOrder={selectedOrder}
      onClose={() => setOpenEditModal(false)}
      loading={loading}
    />
      <ModalDetail
        openModal={openModal}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal(false)}
        selectedEditOrder={selectedEditOrder}
        loading={loading}
      ></ModalDetail>
      <ToastContainer />
    </Box>
  );
};

export default Orders;
