import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Modal,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ModalEdit from "./ModalComponentEdit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import CustomTablePagination from "../../components/TablePagination";
import { useParams } from "react-router-dom";
import { getTransactionOfWalletId } from "../../redux/transactionsSlice";
import AddCardIcon from "@mui/icons-material/AddCard";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
const TransactionDetails = () => {
  const { id } = useParams();
  console.log("Selected Wallet ID in TransactionDetails:", id);

  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transaction.transactions);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Type");
  const [filterOptionStatus, setFilterOptionStatus] = useState("Status");
  const [selectedEditTechnician, setselectedEditTechnician] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedtechnician, setSelectedtechnician] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [technicianData, setTechnicianData] = useState([]);
  const [filteredTransactionDetail, setFilteredTransactionDetail] = useState(
    []
  );

  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);

  const handleSearchChange = (event) => {
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };

  // const handleDateFilterChange = () => {
  //   if (startDate && endDate) {
  //     const filteredTransactionDetail = transactions
  //       ? transactions.filter((user) => {
  //           const orderDate = moment(user.createAt).format("YYYY-MM-DD");
  //           const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
  //           const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
  //           return isAfterStartDate && isBeforeEndDate;
  //         })
  //       : [];
  //     setFilteredTransactionDetail(filteredTransactionDetail);
  //     setFilterOption("Date");
  //   } else {
  //     setFilteredTransactionDetail(transactions);
  //   }
  // };

  const handleStartDateChange = (event) => {
    const selectedStartDate = event.target.value;
    setStartDate(selectedStartDate);
  };

  const handleEndDateChange = (event) => {
    const selectedEndDate = event.target.value;
    setEndDate(selectedEndDate);
  };
  // const handleDateFilterChange = () => {
  //   if (startDate && endDate) {
  //     // Format startDate and endDate to the beginning of the day in the specified time zone
  //     const formattedStartDate = moment(startDate)
  //       .tz("Asia/Ho_Chi_Minh")
  //       .add(7, "hours")
  //       .startOf("day");
  //     const formattedEndDate = moment(endDate)
  //       .tz("Asia/Ho_Chi_Minh")
  //       .add(7, "hours")
  //       .startOf("day");

  //     const filteredTransactionDetail = transactions
  //       ? transactions.filter((order) => {
  //           // Adjust the order createdAt date to the same time zone
  //           const orderDate = moment(order.createdAt)
  //             .tz("Asia/Ho_Chi_Minh")
  //             .add(7, "hours")
  //             .startOf("day");

  //           const isAfterStartDate = orderDate.isSameOrAfter(
  //             formattedStartDate,
  //             "day"
  //           );
  //           const isBeforeEndDate = orderDate.isSameOrBefore(
  //             formattedEndDate,
  //             "day"
  //           );

  //           return isAfterStartDate && isBeforeEndDate;
  //         })
  //       : [];

  //     setFilteredTransactionDetail(filteredTransactionDetail);
  //     setFilterOption("Date");
  //   } else {
  //     setFilteredTransactionDetail(transactions);
  //   }
  // };
  const handleFilterChange = (event) => {
    const selectedOption = event.target.value;
    setFilterOption(selectedOption);
  
    if (selectedOption === "Type") {
      // Reset the filter to show all transactions
      setFilteredTransactionDetail(transactions);
    } else {
      // Filter by the selected type (Withdraw or Deposit)
      const filtered = transactions.filter(
        (transactionDetail) => transactionDetail.type === selectedOption
      );
      setFilteredTransactionDetail(filtered);
    }
  };
  
  const handleFilterChangeStatus = (event) => {
    const selectedStatusOption = event.target.value;

    if (selectedStatusOption === "Status") {
      setFilteredTransactionDetail(data); // Show all payments if "Status" is selected
    } else {
      const filteredTransaction = data.filter(
        (transaction) => transaction.status === selectedStatusOption
      );
      setFilteredTransactionDetail(filteredTransaction);
    }
    setFilterOptionStatus(selectedStatusOption);
  };
  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesType = filterOption === "Type" || transaction.type === filterOption;
      return matchesType ;
    });
  
    setFilteredTransactionDetail(filtered);
  }, [transactions, searchText, filterOption]);
  
  

  const handleDeleteClick = (technician) => {
    setSelectedtechnician(technician);
    setOpenDeleteModal(true);
  };


  useEffect(() => {

    const filteredTransactionDetail = transactions
      ? transactions.filter((technician) => {
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "NEW" && technician.status === "NEW") ||
            (filterOption === "COMPLETED" && technician.status === "COMPLETED")||
            (filterOption === "FAILD" && technician.status === "FAILD");
          return filterMatch;
        })
      : [];
    setFilteredTransactionDetail(filteredTransactionDetail);
  }, [transactions, searchText, filterOption]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
  
    dispatch(getTransactionOfWalletId({ id }))
      .then((response) => {
        if (!response || !response.payload || !response.payload.data) {
          setLoading(false);
          return;
        }
        const responseData = response.payload.data;
        console.log("responseData detail", responseData);
        if (responseData) {
          setFilteredTransactionDetail(responseData);
          setData(responseData); // Store all data for future reference
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error while fetching transaction data:", error);
      });
  }, [dispatch, id]);
  


  // Handling changes in filterOption, searchText, startDate, endDate
  useEffect(() => {
    // Applying filters when filter options change or search text or date range is updated
    const applyFilters = () => {
      let filteredData = data; // Using stored data which has all transactions
      if (searchText) {
        filteredData = filteredData.filter((transaction) =>
          transaction.some((field) =>
            String(field).toLowerCase().includes(searchText.toLowerCase())
          )
        );
      }

      if (filterOption !== "Type") {
        filteredData = filteredData.filter(
          (transaction) => transaction.type === filterOption
        );
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

      filteredData = filteredData.filter((transaction) => {
        const orderDate = moment(transaction.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .startOf("day");

        return (
          orderDate.isSameOrAfter(formattedStartDate, "day") &&
          orderDate.isSameOrBefore(formattedEndDate, "day")
        );
      });
      }

      setFilteredTransactionDetail(filteredData);
    };

    applyFilters();
  }, [searchText, filterOption, startDate, endDate, data]);
 
  
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTransactionsDetailPagination = filteredTransactionDetail.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "walletId",
      headerName: "walletId",
      width: 250,
      key: "walletId",
      cellClassName: "walletId-column--cell",
    },
    {
      field: "transactionAmount",
      headerName: "Số tiền giao dịch",
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
            <Typography color={colors.redAccent[500]}sx={{fontWeight:"bold"}}>
              {formattedPrice}
            </Typography>
          );
        } else {
          return params.value;
        }
      },
    },
    {
      field: "totalAmount",
      headerName: "Số Dư Ví",
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
      headerName: "Ngày Tạo Đơn",
      width: 140,
      key: "createdAt",
      valueGetter: (params) =>
        moment(params.row.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
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
                : status === "FAILD"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === "COMPLETED"
            }
          >
            {status === "NEW" && <AddCardIcon />}
            {status === "COMPLETED" && <CreditScoreIcon />}
            {status === "FAILD" && <CreditCardOffIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "4px" }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header title="Chi tiết đơn hàng" walletId={"WalletId: " + id} />
      <Box display="flex" className="box" left={0}>
        <Box          display="flex"
            borderRadius="6px"
            border={1}
            marginRight={2}
            marginLeft={2}
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
        <Box display="flex" alignItems="center" className="filter-box"sx={{marginLeft:"20px"}}>
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
              // handleDateFilterChange(); // Gọi hàm lọc ngay khi ngày tháng thay đổi
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleStartDateChange}
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
            onBlur={handleEndDateChange }
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
          rows={filteredTransactionsDetailPagination}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />
        <CustomTablePagination
          count={filteredTransactionDetail.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
        />
      </Box>

      <ModalEdit
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedEditTechnician={selectedEditTechnician}
        onClose={() => setOpenEditModal(false)}
        loading={loading}
      />
      <ToastContainer />
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        className="centered-modal" // Thêm className cho modal
      >
        <Fade in={openDeleteModal}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              boxShadow: 24,
              borderRadius: 16,
            }}
          ></Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default TransactionDetails;
