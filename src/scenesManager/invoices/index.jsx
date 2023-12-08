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
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  styled,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CategoryRounded } from "@mui/icons-material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import TodayIcon from "@mui/icons-material/Today";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import {
  createAcceptWithdrawRequest,
  fetchTransactionsNew,
  getRVOOfWallet,
  getTransactionById,
  getTransactionOfWalletId,
} from "../../redux/transactionsSlice";
import { useNavigate } from "react-router-dom";
import CustomTablePagination from "../../components/TablePagination";
import { sendNotification } from "../../redux/orderSlice";
import { getAccountId } from "../../redux/accountSlice";

const Invoices = ({ onSelectWallet = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactions = useSelector((state) => state.transaction.transactions);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Type");
  const [filterOptionStatus, setFilterOptionStatus] = useState("Status");
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
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);
  const [fullnameData, setFullnameData] = useState({});
  const [accountDeviceToken, setAccountDeviceToken] = useState("");
  const [rvoId, setRvoId] = useState("");
  const [accountId, setAccountId] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const CustomButton = styled(Box)({
    backgroundColor: colors.lightGreen[300],
    borderRadius:"10px",
    padding:"2px",
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: colors.lightGreen[500], // Màu sẽ thay đổi khi hover
      cursor: 'pointer',
      borderRadius:"10px"
    },
  });
  useEffect(() => {
    if (accountId && !accountDeviceToken) {
      fetchAccounts(accountId);
    }
  }, [accountId, accountDeviceToken]);
  const fetchAccounts = (accountId) => {
    console.log(accountId);
    // Make sure you have a check to prevent unnecessary API calls
    if (accountId) {
      //lấy devices của account
      console.log("RovId off Account " + accountId);
      dispatch(getAccountId({ id: accountId }))
        .then((response) => {
          const dataAccount = response.payload.data;
          console.log("DeviceToken of Account " + dataAccount.deviceToken);
          if (dataAccount.deviceToken) {
            console.log(dataAccount.deviceToken);
            setAccountDeviceToken(dataAccount.deviceToken);
          } else {
            console.error("deviceToken not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data detail:", error);
        });
    }
  };
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
      console.log(accountId)
      console.log(transactionId);
      setIsAccepted(accept);
      console.log(accept);
      const messageAccept = {
        title: "Chấp nhận đơn rút ví",
        body: "Chúc mừng xe của bạn đã đủ điều kiện vào hệ thống",
      };
      const messageRejected = {
        title: "Không chấp nhận đơn rút ví đăng kí ",
        body: "Xin lỗi!! xe của bạn không đủ điều kiện vào hệ thống!!",
      };
      dispatch(
        createAcceptWithdrawRequest({ id: transactionId, boolean: accept })
      ).then(() => {
          // const updatedFilteredServices = filteredTransaction.filter(
          //   (transaction) => transaction.id !== transactionId
          // );
    
          
          // filteredTransaction(updatedFilteredServices);
          setTransactionId(transactionId);
          setOpenConfirmModal(false);
          setIsSuccess(true);
          reloadTrsansaction();
          
          if (accept) {
            toast.success("Chấp nhận rút tiền ví thành công.");
            const notificationData = {
              deviceId:  accountDeviceToken,
              isAndroiodDevice: true,
              title: messageAccept.title,
              body: messageAccept.body,
              target:accountId
            };
            console.log("notificationData Accepted withdraw: "+notificationData)
            // Gửi thông báo bằng hàm sendNotification
            dispatch(sendNotification(notificationData))
              .then((res) => {
                if (res.payload.message === "Notification sent successfully")
                  toast.success("Gửi thông báo thành công");
                console.log("Gửi thông báo thành công");
              })
              .catch((error) => {
                toast.error("Gửi thông không thành công vui lòng thử lại!!");
                console.error("Lỗi khi gửi thông báo:", error);
              });
          } else {
            toast.error("Không đồng ý rút tiền ví.");
            setTransactionId(transactionId);
            setOpenConfirmModal(false);
            setIsSuccess(true);
            reloadTrsansaction();
            const notificationData = {
              deviceId:accountDeviceToken,
              isAndroiodDevice: true,
              title: messageRejected.title,
              body: messageRejected.body,
              target:accountId
        
              
            };
            console.log("notificationData Accepted withdraw"+notificationData)
            // Gửi thông báo bằng hàm sendNotification
            dispatch(sendNotification(notificationData))
              .then((res) => {
                if (res.payload.message === "Notification sent successfully")
                  toast.success("Gửi thông báo thành công");
                console.log("Gửi thông báo thành công");
              })
              .catch((error) => {
                toast.error("Gửi thông không thành công vui lòng thử lại!!");
                console.error("Lỗi khi gửi thông báo:", error);
              });
          }
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
      // Format startDate and endDate to the beginning of the day in the specified time zone
      const formattedStartDate = moment(startDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");
      const formattedEndDate = moment(endDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");

      const filteredTransactionDetail = transactions
        ? transactions.filter((order) => {
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
          })
        : [];

      setFilteredTransaction(filteredTransaction);
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

  const handleFilterChangeStatus = (event) => {
    const selectedStatusOption = event.target.value;

    if (selectedStatusOption === "Status") {
      setFilteredTransaction(data); // Show all payments if "Status" is selected
    } else {
      const filteredTransaction = data.filter(
        (transaction) => transaction.status === selectedStatusOption
      );
      setFilteredTransaction(filteredTransaction);
    }
    setFilterOptionStatus(selectedStatusOption);
  };
  const handleFilterChange = (event) => {
    const selectedOption = event.target.value;
    setFilterOption(selectedOption);

    if (selectedOption === "Type") {
      // Reset the filter to show all transactions
      setFilteredTransaction(transactions);
    } else {
      // Filter by the selected type
      const filteredByType = transactions.filter(
        (transactionDetail) => transactionDetail.type === selectedOption
      );
      setFilteredTransaction(filteredByType);
    }
  };
  useEffect(() => {
    // Giả sử bạn cũng muốn lọc dựa trên searchText
    const filteredTransactionDetail = transactions.filter((transaction) => {
      const matchesType =
        filterOption === "Type" || transaction.type === filterOption;
      const matchesSearch =
        searchText === "" || transaction.someField.includes(searchText); // Thay 'someField' bằng trường dữ liệu thích hợp
      return matchesType && matchesSearch;
    });

    setFilteredTransaction(filteredTransactionDetail);
  }, [transactions, searchText, filterOption]);


  //Fetch fullname rvo
  useEffect(() => {
    // Tạo danh sách duy nhất từ walletId và chuyển đổi thành mảng
    const uniqueWalletIds = Array.from(new Set(data.map((row) => row.walletId)));
  
     // Lấy thông tin đầy đủ từ uniqueWalletIds
  const fetchFullNames = async (walletIds) => {
    for (const walletId of walletIds) {
      if (!fullnameData[walletId]) {
        await fetchFullname(walletId);
      }
    }
  };
  
    fetchFullNames(uniqueWalletIds);
  }, [data, fullnameData]);
  
  const fetchFullname = (walletId) => {
    console.log(walletId)
    if (!fullnameData[walletId]) {
      dispatch(getRVOOfWallet({ id: walletId }))
        .then((response) => {
          const data = response.payload.data;
          if (data && data.rvo.fullname) {
            console.log(data.rvo.id)
           console.log(data.rvo.accountId)
           setAccountId(data.rvo.accountId)
            setFullnameData((prevData) => ({
              ...prevData,
              [walletId]: data.rvo.fullname,
            }
           
            
            ));
            setRvoId(data.rvoid)
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

  // Function để chuyển đổi thời gian sang múi giờ Việt Nam
  const convertToVietnamTime = (createdAt) => {
    if (!createdAt) return "Không có thông tin";

    // Chuyển đổi thời gian sang múi giờ Việt Nam (GMT+7)
    const vietnamTime = moment
      .utc(createdAt)
      .tz("Asia/Ho_Chi_Minh")
      .format("DD-MM-YYYY HH:mm:ss");
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

        if (!response && !response.payload && !response.payload.data) {
          setLoading(false);
          return; // Kết thúc sớm hàm useEffect() nếu không có dữ liệu
        }
          // Đã lấy dữ liệu thành công
          const data = response.payload.data;
          setData(data);
          setFilteredTransaction(data);
          setDetailedData(data);
      
      })
      .catch((error) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const filteredVehiclePagination = filteredTransaction.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );
  let filteredVehiclePagination = [];

  if (Array.isArray(filteredTransaction)) {
    filteredVehiclePagination =
      filteredTransaction &&
      filteredTransaction.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
  }



  const columns = [
    {
      field: "id",
      headerName: "id",
      width: 100,
      cellClassName: "name-column--cell",
    },

    {
      field: "walletId",
      headerName: "Họ Và tên",
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
      field: "createdAt",
      headerName: "Ngày giao dịch",
      width: 160,
      valueGetter: (params) =>
        moment(params.row.createdAt)
          .tz("Asia/Ho_Chi_Minh") // Set the time zone to Vietnam's ICT
          .add(7, "hours") // Adding 3 hours (you can adjust this number as needed)
          .format("DD-MM-YYYY HH:mm:ss"),
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
            {type === "Rút" && <CurrencyExchangeIcon />}
            {type === "Deposit" && <AssuredWorkloadIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "2px" }}>
              {type === "Withdraw"
                ? "Mới"
                : type === "Deposit"
                ? "Tiền gửi"
                : type}
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
                : status === "FAILD"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.cyan[300]
                : status === "COMPLETED"
            }
            color={
              status === "NEW"
                ? colors.greenAccent[300]
                : colors.yellowAccent[700] && status === "COMPLETED"
                ? colors.cyan[700]
                : colors.yellowAccent[700]
            }
          >
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
            {status === "NEW"
                ? "Mới"
                : status === "FAILD"
                ? "Thất Bại"
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
      field: "orderDetails",
      headerName: "Chi Tiết Giao Dịch",
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
            onClick={() => handleDetailClickDetail(params.row.walletId)}
          >
            <VisibilityIcon
              color="indigo"
              onClick={() => handleDetailClickDetail(params.row.walletId)}
              aria-label="Chi Tiết Đơn Hàng"
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginLeft: "5px" }}
              onClick={() => handleDetailClickDetail(params.row.walletId)}
            >
              {"Xem Chi Tiết"}
            </Typography>
          </Box>
        </Grid>
      ),
      key: "orderDetails",
    },
    {
      field: "acceptWithdraw",
      headerName: "Đơn rút ví",
      width: 120,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => handleClickModalDetail(params.row.id)}
        >
            <CustomButton
          onClick={() => handleClickModalDetail(params.row.id)}
        >
            <Typography
              variant="body1"
              color="error"
              sx={{ fontWeight: "bold",  color: "green" }}
              onClick={() => handleClickModalDetail(params.row.id)}
            >
              {"Chấp Nhận Đơn"}
            </Typography>
        </CustomButton>
        </IconButton>
      ),
      key: "acceptWithdraw",
    },
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header
        title="Danh Sách Đối Tác Rút Ví"
        subtitle="Danh sách xe cứu hộ chờ duyệt"
      />
      <Box display="flex" className="box" left={0}>
        <Box    display="flex"
            borderRadius="6px"
            border={1}
            marginRight={1}
            marginLeft={1}
            width={500}>
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
              <MenuItem key="type-all" value="Type">
                Hình thức
              </MenuItem>
              <MenuItem key="type-withdraw" value="Withdraw">
                Rút tiền
              </MenuItem>
              <MenuItem key="type-deposit" value="Deposit">
                Nạp tiền
              </MenuItem>
              {/* Add more MenuItem options if needed */}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center" className="filter-box" sx={{marginLeft:"14px"}}>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOptionStatus}
              onChange={handleFilterChangeStatus}
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
                Thành Công
              </MenuItem>
              <MenuItem key="status-faild" value="FAILD">
                Không Thành Công
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
              // handleDateFilterChange(); // Gọi hàm lọc ngay khi ngày tháng thay đổi
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
          rows={filteredVehiclePagination.map((row, index) => ({
            ...row,
            id: row.id || `temp-id-${index}`, // Generate temporary ID if 'id' is missing
          }))}
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
                            detailedData.transactionAmount ||
                              "Không có thông tin"
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
