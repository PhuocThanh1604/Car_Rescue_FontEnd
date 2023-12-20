import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CustomTablePagination from "../../components/TablePagination";
import { fetchPayments } from "../../redux/paymentSlice";
import {
  getOrderDetailId,
  getOrderId,
  getPaymentId,
} from "../../redux/orderSlice";
import GradingIcon from "@mui/icons-material/Grading";
import TodayIcon from "@mui/icons-material/Today";
import PaidIcon from "@mui/icons-material/Paid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import { getCustomerId } from "../../redux/customerSlice";
import MyModal from "./ModalDetail";

const Payment = () => {
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payment.payments);
  const [loading, setLoading] = useState(false);
  const [filteredPayment, setFilteredPayment] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [detailedData, setDetailedData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [filterOptionDate, setFilterOptionDate] = useState("Date");
  const [filterOptionMethod, setFilterOptionMethod] = useState("method");
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [paymentId, setPaymentId] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [dataFullnameOfCustomer, setDataFullnameOfCustomer] = useState({});
  const [orderIds, setOrderIds] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const handleClickPaymentDetail = (paymentId) => {
    console.log(paymentId);
    dispatch(getPaymentId({ id: paymentId }))
      .then((response) => {
        const transactionDetails = response.payload.data;
        // setOpenConfirmModal(true);
        setDetailedData(transactionDetails);
        console.log("transactionDetails"+transactionDetails)
      
        console.log(transactionDetails.orderId);

        dispatch(getOrderId({ id: transactionDetails.orderId }))
          .then((response) => {
            const orderDetails = response.payload.data;
            setSelectedEditOrder(orderDetails);
            setOpenModal(true);
            setIsSuccess(true);
          })
          .catch((error) => {
            console.error("Lỗi khi lấy thông tin đơn hàng mới:", error);
          });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin payment:", error);
      });
  };

  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);

  const handleSearchChange = (event) => {
    const value = event.target.value || ""; 
    setSearchText(value);
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;

    if (selectedStatusOption === "Status") {
      setFilteredPayment(data);
    } else {
      const filteredTransaction = data.filter(
        (transaction) => transaction.status === selectedStatusOption
      );
      setFilteredPayment(filteredTransaction);
    }
    setFilterOption(selectedStatusOption);
  };

  const handleFilterRescueMethod = (event) => {
    const selectedMethodOption = event.target.value;

    if (selectedMethodOption === "method") {
      setFilteredPayment(data); // Show all payments if "Hình Thức" is selected
    } else {
      const filteredTransaction = data.filter(
        (transaction) => transaction.method === selectedMethodOption
      );
      setFilteredPayment(filteredTransaction);
    }
    setFilterOptionMethod(selectedMethodOption);
  };

  const handleDateFilterChange = () => {
    let filteredOrders = [...data]; // Initialize with all data

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

      filteredOrders = filteredOrders.filter((order) => {
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

      setFilterOptionDate("Date");
    }

    setFilteredPayment(filteredOrders);
  };

  useEffect(() => {
    let filtered = data;

    if (filterOption !== "Status") {
      filtered = filtered.filter((item) => item.status === filterOption);
    }

    if (filterOptionMethod !== "method") {
      filtered = filtered.filter((item) => item.method === filterOptionMethod);
    }

    if (startDate && endDate) {
      const formattedStartDate = moment(startDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");
      const formattedEndDate = moment(endDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");

      filtered = filtered.filter((order) => {
        const orderDate = moment(order.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .startOf("day");
        return (
          orderDate.isSameOrAfter(formattedStartDate, "day") &&
          orderDate.isSameOrBefore(formattedEndDate, "day")
        );
      });
    }

    setFilteredPayment(filtered);
  }, [data, filterOption, filterOptionMethod, startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchPayments())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredPayment(data);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        } else {
          toast.dismiss("Không có dữ liệu từ phản hồi data");
        }
      })
      .catch((error) => {
        toast.dismiss("Không có dữ liệu từ phản hồi data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  //Không đồng ý cho rút tiền
  const handleCancel = () => {
    // Đóng modal và đặt lại orderId
    setOpenConfirmModal(false);
    setPaymentId(null);
  };

  // useEffect(() => {
  //   try {
  //     // Extract unique orderIds from the data
  //     const extractedOrderIds = [...new Set(data.map((row) => row.orderId))];
  //     setOrderIds(extractedOrderIds);
  //   } catch (error) {
  //     toast.error("Error in extracting orderIds:", error);
  //     // Handle errors here if needed
  //   }
  // }, [data]);

  // // Create a Set to keep track of unique customerIds
  // const uniqueCustomerIds = new Set();

  // const fetchOrder = (orderId) => {
  //   if (orderId) {
  //     return dispatch(getOrderId({ id: orderId }))
  //       .then((response) => {
  //         const data = response.payload.data;
  //         if (data) {
  //           const customerId = data.customerId;
  //           if (!uniqueCustomerIds.has(customerId)) {
  //             uniqueCustomerIds.add(customerId);
  //             console.log(customerId);
  //             // Gọi sendToAPI với customerId và orderId
  //             sendToAPI(customerId, orderId);
  //           } else {
  //             console.log(`Duplicate customerId: ${customerId}`);
  //           }
  //         } else {
  //           toast.error("Fullname not found in the API response.");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error while fetching customer data:", error);
  //       });
  //   }
  // };

  // // Function to send data to the API based on customerId
  // const sendToAPI = (customerId, orderId) => {
  //   if (customerId && orderId) {
  //     dispatch(getCustomerId({ id: customerId }))
  //       .then((response) => {
  //         const dataCustomer = response.payload.data;
  //         console.log(dataCustomer.fullname);
  //         setDataFullnameOfCustomer((prevData) => ({
  //           ...prevData,
  //           [orderId]: dataCustomer.fullname, // Sử dụng orderId làm key
  //         }));
  //       })
  //       .catch((error) => {
  //         toast.error("Error while fetching customer data:", error);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   // Create an array of promises for fetching data for each unique orderId
  //   const fetchPromises = orderIds.map((orderId) => fetchOrder(orderId));

  //   // Execute all promises concurrently using Promise.all
  //   Promise.all(fetchPromises)
  //     .then((results) => {
  //       // Handle the results if needed
  //       console.log("All fetchOrder promises completed:", results);
  //     })
  //     .catch((error) => {
  //       console.error("Error while fetching orders:", error);
  //     });
  // }, [orderIds]);

  useEffect(() => {
    if (detailedData && detailedData.orderId) {
      setOrderId(detailedData.orderId);
    }
  }, [detailedData]);

  useEffect(() => {
    if (orderId) {
      console.log(orderId);
      fectOrderDetail(orderId);
    }
  }, [orderId]); // Thêm orderId vào danh sách phụ thuộc

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
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let filteredPaymentsPagination = [];
  if (Array.isArray(filteredPayment)) {
    filteredPaymentsPagination =
      filteredPayment &&
      filteredPayment.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
  }
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "Đang cập nhật";
    return moment(dateTime)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .format("DD/MM/YYYY HH:mm:ss");
    // Set the time zone to Vietnam's ICT
  };
  const columns = [
    {
      field: "id",
      headerName: "paymentId",
      width: 260,
    },
    // {
    //   field: "orderId", // Make sure this matches the field in your data
    //   headerName: "Tên Khách Hàng",
    //   width: 140,
    //   renderCell: (params) => {
    //     return dataFullnameOfCustomer[params.value] ? (
    //       dataFullnameOfCustomer[params.value]
    //     ) : (
    //       <CircularProgress size={20} />
    //     );
    //   },
    // },

    {
      field: "createdAt",
      headerName: "Ngày giao dịch",
      width: 160,
      valueGetter: (params) =>
        moment(params.row.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .format("DD-MM-YYYY HH:mm"),
    },
    {
      field: "method",
      headerName: "Hình thức",
      width: 120,
      key: "type",
      renderCell: ({ row: { method } }) => {
        return (
          <Box
            width="auto"
            p="4px"
            m="0 auto"
            display="flex"
            justifyContent="center"
            borderRadius={2}
            backgroundColor={
              method === "Cash"
                ? colors.lightGreen[700]
                : method === "Cash"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.lightBlue[300]
                : method === "Banking"
            }
            color={
              method === "Cash"
                ? colors.white[50]
                : colors.yellowAccent[700] && method === "Banking"
                ? colors.white[50]
                : colors.yellowAccent[700]
            }
          >
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
              {method === "Cash"
                ? "Tiền Mặt"
                : method === "Banking"
                ? "Chuyển Khoản"
                : method}
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
                ? colors.lime[300]
                : status === "COMPLETED"
            }
            color={
              status === "NEW"
                ? colors.greenAccent[300]
                : colors.yellowAccent[700] && status === "COMPLETED"
                ? colors.lime[700]
                : colors.yellowAccent[700]
            }
          >
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
              {status === "NEW"
                ? "Mới"
                : status === "COMPLETED"
                ? "Hoàn Thành"
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
            onClick={() => handleClickPaymentDetail(params.row.orderId)}
          >
            <VisibilityIcon
              color="indigo"
              onClick={() => handleClickPaymentDetail(params.row.orderId)}
              aria-label="Chi Tiết Đơn Hàng"
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginLeft: "5px" }}
              onClick={() => handleClickPaymentDetail(params.row.orderId)}
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
      <Header title="Payment" subtitle="Danh sách chi tiết payment " />
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

        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterOptionMethod}
            onChange={handleFilterRescueMethod}
            variant="outlined"
            className="filter-select"
            style={{ width: "150px", marginRight: "20px" }}
          >
            <MenuItem key="method-all" value="method">
              Hình Thức
            </MenuItem>
            <MenuItem key="method-Cash" value="Cash">
              Tiền Mặt
            </MenuItem>
            <MenuItem key="method-Banking" value="Banking">
              Chuyển Khoản
            </MenuItem>
          </Select>
        </FormControl>
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
              <MenuItem key="status-new" value="NEW">
                Mới
              </MenuItem>
              <MenuItem key="status-completed" value="COMPLETED">
                Hoàn Thành
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
          rows={filteredPaymentsPagination}
          columns={columns}
          getRowId={(row) => row.id} // Sử dụng thuộc tính `id` của mỗi hàng
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <CustomTablePagination
        count={filteredPayment ? filteredPayment.length : 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        loading={loading}
      />
      <MyModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal(false)}
        selectedEditOrder={selectedEditOrder}
        detailedData={detailedData}
        loading={loading}
      ></MyModal>

      <Dialog
        open={openConfirmModal}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            width: "600px", // Set your desired maximum width
            height: "auto", // Set your desired maximum height
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: colors.greenAccent[500],
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          Thông tin chi tiết payment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {detailedData !== null ? (
              <div>
                <Card>
                  <Divider light />
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <PhoneRoundedIcon
                        sx={{ color: colors.blueAccent[400] }}
                      />
                      <Typography variant="h6">
                        <strong>ID : </strong>{" "}
                        {detailedData.id || "Không có thông tin"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <GradingIcon sx={{ color: colors.blueAccent[400] }} />
                      <Typography variant="h6">
                        <strong>orderId : </strong>{" "}
                        {detailedData.orderId || "Không có thông tin"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <GradingIcon sx={{ color: colors.blueAccent[400] }} />
                      <Typography variant="h6">
                        <strong>serviceId : </strong>{" "}
                        {orderDetailData.serviceId || "Không có thông tin"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <AccountBalanceWalletIcon
                        sx={{ color: colors.blueAccent[400] }}
                      />
                      <Typography variant="h6">
                        <strong>hình thức: </strong>{" "}
                        {detailedData.method || "Không có thông tin"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <TodayIcon sx={{ color: colors.blueAccent[400] }} />
                      <Typography variant="h6">
                        <strong>Ngày Giao Dịch: </strong>{" "}
                        {formatDateTime(detailedData.createdAt) ||
                          "Không có thông tin"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <PaidIcon sx={{ color: colors.blueAccent[400] }} />
                      <Typography>
                        <strong>Tổng Tiền Đã Thanh Toán: </strong>{" "}
                        <span
                          style={{
                            color: colors.redAccent[500],
                            fontWeight: "bold",
                          }}
                        >
                          {detailedData.amount
                            ? `${detailedData.amount.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}`
                            : "Không có thông tin"}
                        </span>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ) : (
              "Loading..."
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Payment;
