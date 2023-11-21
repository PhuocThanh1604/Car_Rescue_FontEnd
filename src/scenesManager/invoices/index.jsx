import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { CategoryRounded } from "@mui/icons-material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import TodayIcon from "@mui/icons-material/Today";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Collapse from "@mui/material/Collapse";
import TimerIcon from "@mui/icons-material/Timer";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { getRescueVehicleOwnerId } from "../../redux/rescueVehicleOwnerSlice";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import {
  createAcceptWithdrawRequest,
  fetchTransactionsNew,
  getTransactionById,
  getTransactionOfWalletId,
} from "../../redux/transactionsSlice";
import { useNavigate } from "react-router-dom";
import AddCardIcon from "@mui/icons-material/AddCard";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import CustomTablePagination from "../../components/TablePagination";
import InfoIcon from "@mui/icons-material/Info";

const Invoices = ({ onSelectWallet = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactions = useSelector((state) => state.transaction.transactions);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [initialFormState, setInitialFormState] = useState({});
  const [editStatus, setEditStatus] = useState({});
  const [transactionId, setTransactionId] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [detailedData, setDetailedData] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
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
  const handleClickModalDetail = (transactionDetailId) => {
    console.log(transactionDetailId); // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getTransactionById({ id: transactionDetailId }))
      .then((response) => {
        const transactionDetails = response.payload.data;
        setTransactionId(transactionDetailId);
        // Đóng modal và đặt lại orderId
        setOpenConfirmModal(true);
        setDetailedData(transactionDetails);

        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin giao dịch:", error);
      });
  };

  //Hủy rút ví
  const handleCancel = () => {
    // Đóng modal và đặt lại orderId
    setOpenConfirmModal(false);
    setTransactionId(null);
  };

  const reloadTrsansaction = () => {
    dispatch(fetchTransactionsNew())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setFilteredTransaction(data);
          setLoading(false);
          console.log("Services reloaded:", data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách giao dịch:", error);
      });
  };
  //Chấp nhận order
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
        toast.success("Chấp nhận rút tiền ví thành công.");
      })
      .catch((error) => {
        console.error(
          "Lỗi khi lấy thông tin giao dịch mới:",
          error.status || error.message
        );
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
      const filteredVehicles = transactions.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredTransaction(filteredVehicles);
      setFilterOption("Date");
    } else {
      setFilteredTransaction(transactions);
    }
  };

  useEffect(() => {
    if (Array.isArray(transactions)) {
      const transactionId = transactions.id;
      const transactionToEdit = transactions.find(
        (transaction) => transaction.id === transactionId
      );

      if (transactionToEdit) {
        setEditStatus(transactionToEdit);
        setInitialFormState(transactionToEdit);
      }
    }
  }, [transactions]);

  // Function để chuyển đổi thời gian sang múi giờ Việt Nam
  const convertToVietnamTime = (createdAt) => {
    if (!createdAt) return "Không có thông tin";

    // Chuyển đổi thời gian sang múi giờ Việt Nam (GMT+7)
    const vietnamTime = moment
      .utc(createdAt)
      .utcOffset("+0700")
      .format("YYYY-MM-DD HH:mm:ss");
    return vietnamTime;
  };
  const formatToVND = (amount) => {
    if (!amount) return "Không có thông tin";

    // Định dạng số tiền thành VND
    const formattedAmount = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

    return formattedAmount;
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchTransactionsNew())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredTransaction(data);
          setDetailedData(data);
          console.log(data);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
    // Hiển thị hình ảnh đã chọn hoặc thực hiện một hành động khác ở đây
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVehiclePagination = filteredTransaction.slice(
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
      cellClassName: "name-column--cell",
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
      headerName: "Đơn rút ví",
      width: 60,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => handleClickModalDetail(params.row.id)}
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
      headerName: "Chi Tiết Giao Dịch",
      width: 120,
      renderCell: (params) => (
        <Grid container justifyContent="center" alignItems="center">
          <IconButton
            color="indigo"
            onClick={() => handleDetailClickDetail(params.row.walletId)}
            aria-label="Chi Tiết Giao Dịch"
          >
            <InfoIcon />
          </IconButton>
        </Grid>
      ),
      key: "bookDetail",
    },
  ];

  return (
    <Box m="5px">
      <Header
        title="Danh Sách Xe Cứu Hộ"
        subtitle="Danh sách xe cứu hộ chờ duyệt"
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
          rows={filteredVehiclePagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />

        <CustomTablePagination
          count={filteredTransaction.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
        />
      </Box>

      <ToastContainer />
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
          Xác nhận rút ví của đối tác
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {detailedData !== null ? (
              <div>
                <Card>
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
                      <PriceChangeIcon style={{ color: "blue" }} />
                      <Typography variant="h6">
                        <strong> Tổng tiền giao dịch: </strong>{" "}
                        <Box
                          component="span" // Sử dụng Box như là một span
                          sx={{
                            color: "red",
                           
                          }}
                        >
                        {formatToVND(
                          detailedData.transactionAmount || "Không có thông tin"
                        )}
                        </Box>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <PriceChangeIcon style={{ color: "blue" }} />
                      <Typography variant="h6">
                        <strong>Tổng tiền còn lại: </strong>{" "}
                        {formatToVND(
                          detailedData.totalAmount || "Không có thông tin"
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <CategoryRounded style={{ color: "blue" }} />
                      <Typography variant="h6">
                        <strong>Hình thức: </strong>{" "}
                        <Box
                          component="span" // Sử dụng Box như là một span
                          sx={{
                            backgroundColor: "lightblue",
                            padding: "4px 8px",
                            borderRadius: 4,
                          }}
                        >
                          {detailedData.type || "Không có thông tin"}
                        </Box>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <TodayIcon style={{ color: "blue" }} />
                      <Typography variant="h6">
                        <strong>Ngày tạo đơn: </strong>{" "}
                        {convertToVietnamTime(
                          detailedData.createdAt || "Không có thông tin"
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1, // Khoảng cách giữa icon và văn bản
                      }}
                    >
                      <TextSnippetIcon style={{ color: "blue" }} />
                      <Typography variant="h6">
                        <strong>Ghi chú: </strong>{" "}
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
            onClick={() => handleConfirmWithdraw(transactionId, true)} // Pass true for "Đồng Ý"
            color="secondary"
            variant="contained"
          >
            Đồng Ý
          </Button>
          <Button
            onClick={() => handleConfirmWithdraw(transactionId, false)} // Pass false for "Không Đồng Ý"
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
