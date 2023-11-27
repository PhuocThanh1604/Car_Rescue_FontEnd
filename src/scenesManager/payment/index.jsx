import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import AddCardIcon from "@mui/icons-material/AddCard";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import InfoIcon from "@mui/icons-material/Info";
import CustomTablePagination from "../../components/TablePagination";
import { fetchPayments } from "../../redux/paymentSlice";
import { getOrderDetailId, getPaymentId } from "../../redux/orderSlice";
import GradingIcon from "@mui/icons-material/Grading";
import TodayIcon from "@mui/icons-material/Today";
import PaidIcon from "@mui/icons-material/Paid";
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [paymentId, setPaymentId] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleClickPaymentDetail = (paymentId) => {
    console.log(paymentId);
    dispatch(getPaymentId({ id: paymentId }))
      .then((response) => {
        const transactionDetails = response.payload.data;
        setOpenConfirmModal(true);
        setDetailedData(transactionDetails);
        setIsSuccess(true);
        console.log(transactionDetails);
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
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };

  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredTransaction = payments
        ? payments.filter((user) => {
            const orderDate = moment(user.createAt).format("YYYY-MM-DD");
            const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
            const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
            return isAfterStartDate && isBeforeEndDate;
          })
        : [];
      setFilteredPayment(filteredTransaction);
      setFilterOption("Date");
    } else {
      setFilteredPayment(payments);
    }
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredPayment(payments);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredTransaction = payments.filter(
        (transaction) => transaction.status === selectedStatusOption
      );
      setFilteredPayment(filteredTransaction);
    }
  };

  useEffect(() => {
    const filteredTransaction = payments
      ? payments.filter((payment) => {
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" && payment.status === "ACTIVE") ||
            (filterOption === "INACTIVE" && payment.status === "INACTIVE");
          return filterMatch;
        })
      : [];
    setFilteredPayment(filteredTransaction);
  }, [payments, searchText, filterOption]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchPayments())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredPayment(data);
          console.log(data);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
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
  const handleSelectWallet = (id) => {
    setSelectedWalletId(id);
  };

  const reloadPayment = () => {
    dispatch(fetchPayments())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setFilteredPayment(data);

          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
          console.log("Services reloaded:", data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách giao dịch:", error);
      });
  };

  useEffect(() => {
    if (detailedData && detailedData.orderId) {
      setOrderId(detailedData.orderId);
    }
  }, [detailedData]);
  
  useEffect(() => {
    if (orderId) {
      console.log(orderId)
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
          console.log(data.quantity)
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
  const filteredPaymentsPagination = filteredPayment.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    {
      field: "id",
      headerName: "id",
      width: 100,
      cellClassName: "name-column--cell",
    },
    {
      field: "orderId",
      headerName: "orderId",
      width: 100,
      cellClassName: "name-column--cell",
      onCellClick: (params) => {
        setSelectedWalletId(params.row.orderId);
        // Các hành động khác sau khi chọn orderId
      },
    },

    {
      field: "method",
      headerName: "Hình thức",
      width: 120,
      key: "type",
      // renderCell: ({ row: { type } }) => {
      //   return (
      //     <Box
      //       width="86%"
      //       m="0 auto"
      //       p="4px"
      //       display="flex"
      //       justifyContent="center"
      //       fontSize={8}
      //       borderRadius={2} // Corrected prop name from "buserRadius" to "borderRadius"
      //       backgroundColor={
      //         type === "Withdraw"
      //           ? colors.greenAccent[700]
      //           : type === "Deposit"
      //           ? colors.purpleAccent[200]
      //           : colors.purpleAccent[200]
      //       }
      //     >
      //       {type === "Withdraw" && <CurrencyExchangeIcon />}
      //       {type === "Deposit" && <AssuredWorkloadIcon />}
      //       <Typography color={colors.grey[100]} sx={{ ml: "2px" }}>
      //         {type}
      //       </Typography>
      //     </Box>
      //   );
      // },
    },
    {
      field: "createdAt",
      headerName: "Ngày giao dịch",
      width: 160,
      valueGetter: (params) =>
        moment(params.row.createdAt).tz("Asia/Ho_Chi_Minh").add(7, 'hours') .format("DD-MM-YYYY HH:mm"),
     
    },
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
      field: "orderDetails",
      headerName: "Chi Tiết Đơn Hàng",
      width: 120,
      renderCell: (params) => (
        <Grid container justifyContent="center" alignItems="center">
          <IconButton
            color="indigo"
            onClick={() => handleClickPaymentDetail(params.row.orderId)}
            aria-label="Chi Tiết Đơn Hàng"
          >
            <InfoIcon />
          </IconButton>
        </Grid>
      ),
      key: "bookDetail",
    },
  ];

  return (
    <Box m="20px">
      <Header title="Payment" subtitle="Danh sách chi tiết payment " />
      <Box
        m="40px 0 0 0"
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
        count={filteredPayment.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        loading={loading}
      />

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
          sx={{  color: colors.greenAccent[500], fontSize: "24px", textAlign: "center" }}
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
                        <strong>createdAt: </strong>{" "}
                        {detailedData.createdAt || "Không có thông tin"}
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
                      <Typography >
                        <strong >Tổng Tiền: </strong>{" "}
                        {detailedData.amount
                          ? `${detailedData.amount.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}`
                          : "Không có thông tin"}
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
