import React from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  CircularProgress,
  Avatar,
  Card,
  CardHeader,
  CardContent,
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
  getOrderId,
} from "../../redux/orderSlice";
import ProgressCircle from "../../components/ProgressCircle";
import { fetchPayments } from "../../redux/paymentSlice";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { fetchCustomers, getCustomerId } from "../../redux/customerSlice";
import {
  fetchTransactionsAll,
  getRVOOfWallet,
} from "../../redux/transactionsSlice";
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
  const [dataCustomerDetail, setDataCustomerDetail] = useState([]);
  const [dataTransaction, setDataTransaction] = useState([]);
  const [fullNameRvo, setFullNameRvo] = useState({});

  const calculateIncrease = (currentValue, percentIncrease) => {
    return currentValue + Math.round((percentIncrease / 100) * currentValue);
  };
  const totalPossibleOrders = 500;
  const currentOrders = data.orders || 0;

  const ordersPercentage = calculateIncrease(data.orders, 5);

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

  useEffect(() => {
    setLoading(true);
    dispatch(fetchPayments())
      .then((response) => {
        const dataPayment = response.payload.data;
        if (dataPayment) {
          setDataPayment(dataPayment);

          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error);
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

  useEffect(() => {
    setLoading(true);
    dispatch(fetchTransactionsAll())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          // Lọc ra những giao dịch có type là "Withdraw" và lấy danh sách ID
          const withdrawTransactions = data.filter(
            (transaction) => transaction.type === "Withdraw"
          );

          const withdrawTransactionIds = withdrawTransactions.map(
            (transaction) => transaction.walletId
          );

          // Tạo một mảng chứa các promise từ việc gọi getRVOOfWallet cho từng ID
          const promises = withdrawTransactionIds.map((walletId) => {
            return dispatch(getRVOOfWallet({ id: walletId }))
              .then((response) => {
                const data = response.payload.data;
                if (data) {
                  setFullNameRvo((prevFullNameRvo) => ({
                    ...prevFullNameRvo,
                    [walletId]: data.rvo.fullname,
                  }));
                }
              })
              .catch((error) => {
                toast.error(error);
              });
          });

          // Sử dụng Promise.all để chờ tất cả các promise hoàn thành
          Promise.all(promises)
            .then(() => {
              // Tất cả các promise đã hoàn thành
              setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
            })
            .catch((error) => {
              toast.error(error);
            });

          setDataTransaction(withdrawTransactions);

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
            <Box display="flex" justifyContent="space-between" mt="2px">
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
          p="30px"
          backgroundColor={colors.white[50]}
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
        >
          <Typography variant="h5" fontWeight="600">
            Giao Dịch
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
          overflow="auto"
          backgroundColor={colors.white[50]}
          borderRadius="12px"
          boxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.1)"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`1px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Khách Hàng Gần Đây
            </Typography>
          </Box>
          {dataCustomer.map((dataCustomer, i) => (
            <Box
              key={`${dataCustomer.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              p="10px"
            >
              <Box style={{ minWidth: "200px", maxWidth: "200px" }}>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                  style={{ wordWrap: "break-word" }}
                >
                  {dataCustomer.fullname}
                </Typography>
              </Box>

              <Box color={colors.grey[100]} style={{ minWidth: "100px" }}>
                {new Date(dataCustomer.birthdate).toLocaleDateString()}{" "}
              </Box>

              <Avatar src={dataCustomer.avatar} />
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}

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
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Đối Tác Rút Ví Gần Đây
            </Typography>
          </Box>
          {dataTransaction.map((dataTransaction, i) => (
            <Box
              key={`${dataTransaction.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p="10px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {fullNameRvo[dataTransaction.walletId]}
                </Typography>
              </Box>

              <Box color={colors.grey[100]}>
                {new Date(dataTransaction.createdAt).toLocaleDateString()}{" "}
              </Box>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "error.main" }}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(dataTransaction.transactionAmount)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
