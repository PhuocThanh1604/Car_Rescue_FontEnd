import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { tokens } from '../../theme';
import { mockTransactions } from '../../data/mockData';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrafficIcon from '@mui/icons-material/Traffic';
import Header from '../../components/Header';
import LineChart from '../../components/LineChart';
import GeographyChart from '../../components/GeographyChart';
import BarChart from '../../components/BarChart';
// import ProgressCircle from "../../components/ProgressCircle";
import MainChart from '../../components/MainChart';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchusers } from '../../redux/userSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { fetchOrders } from '../../redux/orderSlice';
import { fetchProducts } from '../../redux/productSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const orders = useSelector((state) => state.order.orders);
  const products = useSelector((state) => state.product.products);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrders())
      .then(() => {
        // Không cần setFilteredusersStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
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
    dispatch(fetchProducts())
      .then(() => {
        // Không cần setFilteredusersStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
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
    dispatch(fetchusers())
      .then(() => {
        // Không cần setFilteredusersStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
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

  const increasedUsers = calculateIncrease(users.length, 5);
  const increasedOrders = calculateIncrease(orders.length, 5);
  const increasedProducts = calculateIncrease(products.length, 5);
  const total = orders.reduce(
    (accumulator, order) => accumulator + order.price,
    0
  );

  useEffect(() => {
    // Lặp qua danh sách đơn hàng và gán userName dựa trên userId
    const ordersWithUserNames = orders.map((order) => {
      const user = users.find((user) => user.userId === order.userId);
      const userName = user ? user.userName : 'Unknown User';
      return { ...order, userName };
    });

    // Cập nhật danh sách đơn hàng đã được gán userName
    setFilteredOrders(ordersWithUserNames);
  }, [orders, users]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Dashboard Book Store 2hand"
          subtitle="Welcome to this dashboard made with 2Hand Book Store"
        />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '10px 20px',
            }}>
            <DownloadOutlinedIcon sx={{ mr: '10px' }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px">
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <EmailIcon
                  sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}>
                  123
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
                sx={{ color: colors.greenAccent[600] }}>
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
          justifyContent="center">
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <PointOfSaleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}>
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
                sx={{ color: colors.greenAccent[600] }}>
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
          justifyContent="center">
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <PersonAddIcon
                  sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}>
                  {users.length}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={users.length}
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
                sx={{ color: colors.greenAccent[600] }}>
                {increasedUsers}%
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <TrafficIcon
                  sx={{ color: colors.greenAccent[600], fontSize: '26px' }}
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.grey[100] }}>
                  {products.length}
                </Typography>
              </Box>
              <Box>
                <CircularProgress
                  variant="determinate"
                  value={products.length}
                  sx={{ color: colors.greenAccent[500] }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                Products increased
              </Typography>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: colors.greenAccent[600] }}>
                {increasedProducts}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ROW 2 */}

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}>
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center">
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}>
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}>
                {total.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: '26px', color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="230px" m="-20px 0 0 0">
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px">
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
              p="15px">
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600">
                  {order.orderId}
                </Typography>

                {order.userId && (
                  <Typography color={colors.grey[100]} key={order.orderId}>
                    {users
                      .filter((user) => user.userId === order.userId)
                      .map((user) => user.userName)
                      .join(', ')}
                  </Typography>
                )}
              </Box>

              <Box color={colors.grey[100]}>
                {new Date(order.createAt).toLocaleDateString()}
              </Box>

              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(order.price)}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        {/* <Box
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
           <CircularProgress
                variant="determinate"
                value={125}
                sx={{ color: colors.greenAccent[500] }}
              />
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
            sx={{ padding: "20px 20px 10px 20px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="280px" mt="-20px">
            <LineChart isDashboard={true} />
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
            Users by Geography
          </Typography>
          <Box height="250px" mt="-20px">
            <GeographyChart />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
