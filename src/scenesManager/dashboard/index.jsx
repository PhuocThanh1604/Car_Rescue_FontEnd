import React from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import InventoryIcon from "@mui/icons-material/Inventory";
import HandshakeIcon from "@mui/icons-material/Handshake";
import BarChart from "../../components/BarChart";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  fetchDashboard,
  fetchOrders,
  getOrderDetailId,
} from "../../redux/orderSlice";
import ProgressCircle from "../../components/ProgressCircle";
import { fetchPayments } from "../../redux/paymentSlice";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { fetchCustomers } from "../../redux/customerSlice";
const Dashboard = () => {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer.customers || []);
  const orders = useSelector((state) => state.order.orders || []);
  const services = useSelector((state) => state.service.services || []);
  const [maxRevenue, setMaxRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orderIds, setOrderIds] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [dataPayment, setDataPayment] = useState([]);
  const [dataCustomer, setDataCustomer] = useState([]);

  const calculateIncrease = (currentValue, percentIncrease) => {
    return currentValue + Math.round((percentIncrease / 100) * currentValue);
  };
  const totalPossibleOrders = 500; // This should be your comparison figure
  const currentOrders = data.orders || 0; // Assuming data.orders is the current total number of orders

  const ordersPercentage = (currentOrders / totalPossibleOrders) * 100;

  const increasedCustomer = calculateIncrease(dataCustomer.length, 5);
  const increasedOrders = calculateIncrease(data.orders, 5);
  const increasedServices = calculateIncrease(data.services, 5);
  const increasedRescueCarOwner = calculateIncrease(data.partners, 5);
  const addOrderId = (newOrderId) => {
    setOrderIds([...orderIds, newOrderId]);
    console.log(orderIds);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchDashboard())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload;
        if (data && data.revenue && data.revenue.length > 0) {
          setData(data);
          // Find the maximum revenue value
          const maxRevenue = Math.max(...data.revenue);
          setMaxRevenue(maxRevenue);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  // useEffect(() => {
  //   setLoading(true);
  //   const processedOrderIds = new Set();
  //   dispatch(fetchOrders())
  //     .then((response) => {
  //       const data = response.payload.data;
  //       if (data) {
  //         setDataOrder(data);
  //         data.forEach(order => {
  //           if (!processedOrderIds.has(order.id)) {
  //             fectOrderDetail(order.id);
  //             processedOrderIds.add(order.id); // Add the order.id to the Set
  //           }
  //         });
  //         // setFilteredPayment(data);
  //         console.log(data[0].id);
  //         setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [dispatch]);
  useEffect(() => {
    setLoading(true);
    dispatch(fetchPayments())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setDataPayment(data);

          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  useEffect(() => {
    setLoading(true);
    dispatch(fetchCustomers())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setDataCustomer(data);

          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  const fectOrderDetail = (orderId) => {
    console.log(orderId);
    if (!orderId) {
      console.error("No orderId provided for reloading order details.");
      return;
    }
    dispatch(getOrderDetailId({ id: orderId }))
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          console.log(data.quantity);
          setOrderDetailData(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại chi tiết đơn:", error);
      });
  };
  // useEffect(() => {
  //   // Lặp qua danh sách đơn hàng và gán accountName dựa trên accountId
  //   const ordersWithaccountNames = orders.map((order) => {
  //     const account = customer.find(
  //       (account) => account.accountId === order.accountId
  //     );
  //     const accountName = account ? account.accountName : "Unknown account";
  //     return { ...order, accountName };
  //   });

  //   // Cập nhật danh sách đơn hàng đã được gán accountName
  //   setFilteredOrders(ordersWithaccountNames);
  // }, [orders, customer]);

  return (
    <Box marginLeft={6} marginRight={6}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Dashboard Của Hệ Thống Cứu Hộ Ô Tô"
          subtitle="Chào mừng bạn đến với Dasboard của hệ thống cứu hộ ô tô này"
        />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={colors.white[50]} 
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
          
        >
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <InventoryIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}
                >
                  {data.orders}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={data.orders}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                Tổng Đơn Hàng
              </Typography>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: colors.greenAccent[600] }}
              >
                {ordersPercentage}% {/* Display the calculated percentage */}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={colors.white[50]} 
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
        >
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <HandshakeIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}
                >
                  {data.partners}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={data.partners}
                  sx={{ color: colors.greenAccent[500] }}
                  
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px" >
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                Đối Tác
              </Typography>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: colors.greenAccent[600] }}
              >
                {increasedRescueCarOwner}%
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={colors.white[50]} 
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
        >
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <PersonAddIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}
                >
                  {dataCustomer.length}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={dataCustomer.length}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                Khách Hàng
              </Typography>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: colors.greenAccent[600] }}
              >
                {increasedCustomer}%
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={colors.white[50]} 
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
          
        >
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <DisplaySettingsIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}
                >
                  {data.services}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={data.services}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                Dịch Vụ
              </Typography>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: colors.greenAccent[600] }}
              >
                {increasedServices}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ROW 2 */}

        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.white[50]} 
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"

        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="500"
                color={colors.grey[100]}
              >
                Doanh Thu Cao Nhất
              </Typography>
              <Box display="flex" alignItems="center">
                <EmojiEventsIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                  sx={{ marginLeft: 1 }} // Optional, adds a little space between the icon and text
                >
                  {maxRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="230px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          overflow="auto"
          backgroundColor={colors.white[50]} 
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Giao dịch gần đây
            </Typography>
          </Box>
          {dataPayment.map((payment, i) => (
            <Box
              key={`${payment.orderId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="10px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {payment.id} {/* Sử dụng order.id thay vì dataOrder.id */}
                </Typography>
              </Box>

              <Box color={colors.grey[100]}>
                {new Date(payment.createdAt).toLocaleDateString()}{" "}
                {/* Sử dụng order.createdAt thay vì dataOrder.createdAt */}
              </Box>

              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(payment.amount)}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          p="30px"
          backgroundColor={colors.white[50]} 
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
        >
          <Typography variant="h5" fontWeight="600">
            Giao dịch
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {data.cash + data.banking} Tổng lần giao dịch
            </Typography>
            <Typography>
              Bao gồm các tiền mặt và chuyển khoản ngân hàng
            </Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
               p="30px"
          backgroundColor={colors.white[50]} 
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
