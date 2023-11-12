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
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
// import ProgressCircle from "../../components/ProgressCircle";
// import MainChart from '../../components/MainChart';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAccounts } from "../../redux/accountSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { fetchOrders, fetchOrdersCompleted } from "../../redux/orderSlice";
import ProgressCircle from "../../components/ProgressCircle";
import { fetchServices } from "../../redux/serviceSlice";
import { fetchCustomers } from "../../redux/customerSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer.customers);
  const orders = useSelector((state) => state.order.orders);
  const services = useSelector((state) => state.service.services);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrdersCompleted())
      .then(() => {
        // Không cần setFilteredaccountsStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
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
    dispatch(fetchServices())
      .then(() => {
        // Không cần setFilteredaccountsStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
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
      .then(() => {
        // Không cần setFilteredaccountsStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const calculateIncrease = (currentValue, percentIncrease) => {
    return currentValue + Math.round((percentIncrease / 100) * currentValue);
  };

  const increasedCustomer = calculateIncrease(customer.length, 5);
  const increasedOrders = calculateIncrease(orders.length, 5);
  const increasedServices = calculateIncrease(services.length, 5);
  const total = orders.reduce(
    (accumulator, order) => accumulator + order.price,
    0
  );

  useEffect(() => {
    // Lặp qua danh sách đơn hàng và gán accountName dựa trên accountId
    const ordersWithaccountNames = orders.map((order) => {
      const account = customer.find(
        (account) => account.accountId === order.accountId
      );
      const accountName = account ? account.accountName : "Unknown account";
      return { ...order, accountName };
    });

    // Cập nhật danh sách đơn hàng đã được gán accountName
    setFilteredOrders(ordersWithaccountNames);
  }, [orders, customer]);

  return (
    <Box marginLeft={2} marginRight={1}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Dasboard Của Hệ Thống Cứu Hộ Ô Tô"
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
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <EmailIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}
                >
                  {orders.length}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={75}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                Emails Sent
              </Typography>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: colors.greenAccent[600] }}
              >
                +14%
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <PointOfSaleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}
                >
                  {orders.length}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={orders.length}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                Sales Obtained
              </Typography>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: colors.greenAccent[600] }}
              >
                {increasedOrders}%
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
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
                  {customer.length}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={customer.length}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                New Clients
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
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <TrafficIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}
                >
                  {services.length}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={services.length}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                Service increased
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
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
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
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
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
          backgroundColor={colors.primary[400]}
          overflow="auto"
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
          {orders.map((order, i) => (
            <Box
              key={`${order.orderId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {order.id}
                </Typography>

                {order.customerId && (
                  <Typography color={colors.grey[100]} key={order.id}>
                    {customer
                      .filter(
                        (account) => account.customerId === order.customerId
                      )
                      .map((account) => account.fullname)
                      .join(", ")}
                  </Typography>
                )}
              </Box>

              <Box color={colors.grey[100]}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Box>

              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.price)}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
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
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
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

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ paddingBottom: "10px" }}
          >
            accounts by Geography
          </Typography>
          <Box height="250px" mt="-20px">
            <GeographyChart />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
