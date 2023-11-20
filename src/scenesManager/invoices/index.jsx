import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
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
import { ToastContainer, toast } from "react-toastify";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  createAcceptWithdrawRequest,
  fetchTransactionsNew,
  getTransactionById,
  getTransactionOfWalletId,
} from "../../redux/transactionsSlice";
import moment from "moment";
import AddCardIcon from "@mui/icons-material/AddCard";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PlaceIcon from "@mui/icons-material/Place";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import { CategoryRounded } from "@mui/icons-material";
import TimerIcon from "@mui/icons-material/Timer";
import ModalDetail from "./transactionDetail";
import InfoIcon from "@mui/icons-material/Info";
import { autoPlay } from "react-swipeable-views-utils";
import { useNavigate } from "react-router-dom";
import Sidebar from "../geographyManager/global/Sidebar";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import CustomTablePagination from "../../components/TablePagination";

const Invoices = ({ onSelectWallet = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactions = useSelector((state) => state.transaction.transactions);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [detailedData, setDetailedData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [transactionId, setTransactionId] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleDetailClickDetail = (selectedWalletId) => {
    console.log(selectedWalletId);
    console.log("Invoices: Selected Wallet ID", selectedWalletId);
    setSelectedWalletId(selectedWalletId);
    onSelectWallet(selectedWalletId);
    setSelectedItemId(selectedWalletId);
    if (typeof onSelectWallet === "function") {
      onSelectWallet(selectedWalletId);
    } else {
      console.error("onSelectWallet is not a function or not defined");
    }
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getTransactionOfWalletId({ id: selectedWalletId }))
      .then((response) => {
        const orderDetails = response.payload.data;
        setSelectedEditOrder(orderDetails);
        navigate(`/manager/invoices/${selectedWalletId}`);
        setOpenModal(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin giao dịch:", error);
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
      const filteredTransaction = transactions
        ? transactions.filter((user) => {
            const orderDate = moment(user.createAt).format("YYYY-MM-DD");
            const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
            const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
            return isAfterStartDate && isBeforeEndDate;
          })
        : [];
      setFilteredTransaction(filteredTransaction);
      setFilterOption("Date");
    } else {
      setFilteredTransaction(transactions);
    }
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredTransaction(transactions);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredTransaction = transactions.filter(
        (transaction) => transaction.status === selectedStatusOption
      );
      setFilteredTransaction(filteredTransaction);
    }
  };

  useEffect(() => {
    const filteredTransaction = transactions
      ? transactions.filter((technician) => {
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" && technician.status === "ACTIVE") ||
            (filterOption === "INACTIVE" && technician.status === "INACTIVE");
          return filterMatch;
        })
      : [];
    setFilteredTransaction(filteredTransaction);
  }, [transactions, searchText, filterOption]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchTransactionsNew())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredTransaction(data);
          // setDetailedData(data);
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
    setTransactionId(null);
  };
  const handleSelectWallet = (id) => {
    setSelectedWalletId(id);
  };

  const reloadTrsansaction = () => {
    dispatch(fetchTransactionsNew())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setFilteredTransaction(data);

          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
          console.log("Services reloaded:", data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách giao dịch:", error);
      });
  };

  const handleModalTransaction = (transactionId) => {
    console.log(transactionId); // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getTransactionById({ id: transactionId }))
      .then((response) => {
        const transactionDetails = response.payload.data;
        setTransactionId(transactionId);
        // Đóng modal và đặt lại orderId
        setOpenConfirmModal(true);
        setDetailedData(transactionDetails);

        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin chủ xe cứu hộ:", error);
      });
  };
  const handleConfirmWithdraw = (transactionId, accept) => {
    console.log(transactionId);
    setIsAccepted(accept);
    console.log(accept);
    // Fetch the VehicleId details based on the selected Vehicle ID
    dispatch(
      createAcceptWithdrawRequest({ id: transactionId, boolean: accept })
    )
      .then(() => {
        setTransactionId(transactionId);
        setOpenConfirmModal(false);
        setIsSuccess(true);
        reloadTrsansaction();
        toast.success("Xác nhận rút tiền thành công.");
      })
      .catch((error) => {
        console.error(
          "Lỗi khi Xác nhận rút tiền thành công:",
          error.status || error.message
        );
      });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const filteredTransactionsPagination = filteredTransaction.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "id",
      headerName: "id",
      width: 100,
      cellClassName: "name-column--cell"
  
    },
    {
      field: "walletId",
      headerName: "walletId",
      width: 100,
      cellClassName: "name-column--cell",
      onCellClick: (params) => {
        setSelectedWalletId(params.row.walletId);
        // Các hành động khác sau khi chọn walletId
      },
    },
    {
      field: "transactionAmount",
      headerName: "Số tiền giao dịch",
      width: 100,
      valueFormatter: (params) => {
        // Đảm bảo rằng params.value là một số
        if (typeof params.value === "number") {
          // Chuyển số thành chuỗi và định dạng theo định dạng tiền tệ VNĐ
          const formattedPrice = params.value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          });
          return formattedPrice;
        } else {
          return params.value;
        }
      },
    },
    {
      field: "type",
      headerName: "Hình thức",
      width: 120,
      key: "type",
      renderCell: ({ row: { type } }) => {
        return (
          <Box
            width="86%"
            m="0 auto"
            p="4px"
            display="flex"
            justifyContent="center"
            fontSize={8}
            borderRadius={2} // Corrected prop name from "buserRadius" to "borderRadius"
            backgroundColor={
              type === "Withdraw"
                ? colors.greenAccent[700]
                : type === "Deposit"
                ? colors.purpleAccent[200]
                : colors.purpleAccent[200]
            }
          >
            {type === "Withdraw" && <CurrencyExchangeIcon />}
            {type === "Deposit" && <AssuredWorkloadIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "2px" }}>
              {type}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "totalAmount",
      headerName: "Tổng cộng",
      width: 100,
      renderCell: (params) => {
        // Đảm bảo rằng params.value là một số
        if (typeof params.value === "number") {
          // Chuyển số thành chuỗi và định dạng theo định dạng tiền tệ VNĐ
          const formattedPrice = params.value.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          });

          // Trả về phần tử Typography để render với màu xanh và giá trị tiền đã định dạng
          return (
            <Typography color={colors.greenAccent[500]}>
              {formattedPrice}
            </Typography>
          );
        } else {
          return params.value;
        }
      },
    },
    {
      field: "createdAt",
      headerName: "Ngày giao dịch",
      width: 160,
      valueGetter: (params) =>
        moment(params.row.createdAt).utcOffset(7).format("DD-MM-YYYY HH:mm"),
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
      field: "acceptWithdraw",
      headerName: "Trạng Thái Đơn",
      width: 60,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => handleModalTransaction(params.row.id)}
        >
          <CheckCircleOutlineIcon
            variant="contained"
            style={{ color: "green" }} // Set the color to green
          />
        </IconButton>
      ),
      key: "acceptWithdraw",
    },
    {
      field: "orderDetails",
      headerName: "Chi Tiết Đơn Hàng",
      width: 120,
      renderCell: (params) => (
        <Grid container justifyContent="center" alignItems="center">
          <IconButton
            color="indigo"
            onClick={() => handleDetailClickDetail(params.row.walletId)}
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
      <Header title="Giao Dịch" subtitle="Danh sách giao dịch với đối tác" />
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
          rows={filteredTransactionsPagination}
          columns={columns}
          getRowId={(row) => row.id} // Sử dụng thuộc tính `id` của mỗi hàng
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <CustomTablePagination
        count={filteredTransaction.length}
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
          sx={{ color: "indigo", fontSize: "24px", textAlign: "center" }}
        >
          Xác nhận rút tiền
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {detailedData !== null ? (
              <div>
                <Card>
                  <Divider light />
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{ marginBottom: "4px", textAlign: "center" }}
                    >
                      Thông tin giao dịch
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <PhoneRoundedIcon />
                      <Typography variant="h6">
                        <strong>SĐT: </strong>{" "}
                        {detailedData.walletId || "Không có thông tin"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <PersonRoundedIcon />
                      <Typography variant="h6">
                        <strong>transactionAmount: </strong>{" "}
                        {detailedData.transactionAmount || "Không có thông tin"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <PersonRoundedIcon />
                      <Typography variant="h6">
                        <strong>totalAmount: </strong>{" "}
                        {detailedData.totalAmount || "Không có thông tin"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <PersonRoundedIcon />
                      <Typography variant="h6">
                        <strong>type: </strong>{" "}
                        {detailedData.type || "Không có thông tin"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <PersonRoundedIcon />
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
                      <PersonRoundedIcon />
                      <Typography variant="h6">
                        <strong>Ghi Chú: </strong>{" "}
                        {detailedData.description || "Không có thông tin"}
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

        <DialogActions>
          <Button onClick={handleCancel} color="primary" variant="contained">
            Hủy
          </Button>
          <Button
            onClick={() => handleConfirmWithdraw(transactionId, true)}
            color="secondary"
            variant="contained"
          >
            Đồng Ý
          </Button>
          <Button
            onClick={() => handleConfirmWithdraw(transactionId, false)}
            color="primary"
            variant="contained"
          >
            Không Đồng Ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;
