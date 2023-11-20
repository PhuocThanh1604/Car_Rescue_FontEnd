

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
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ModalEdit from "./ModalComponentEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import { fetchTechnicians, getTechnicianId } from "../../redux/technicianSlice";
import CustomTablePagination from "../../components/TablePagination";
import { useParams } from "react-router-dom";
import { getTransactionOfWalletId } from "../../redux/transactionsSlice";
import AddCardIcon from "@mui/icons-material/AddCard";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
const TransactionDetails = () => {
  const { id } = useParams();
  console.log("Selected Wallet ID in TransactionDetails:", id);

  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transaction.transactions);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
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

  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredTransactionDetail = transactions
        ? transactions.filter((user) => {
            const orderDate = moment(user.createAt).format("YYYY-MM-DD");
            const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
            const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
            return isAfterStartDate && isBeforeEndDate;
          })
        : [];
      setFilteredTransactionDetail(filteredTransactionDetail);
      setFilterOption("Date");
    } else {
      setFilteredTransactionDetail(transactions);
    }
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredTransactionDetail(transactions);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredTransaction = transactions.filter(
        (transactionDetail) => transactionDetail.status === selectedStatusOption
      );
      setFilteredTransactionDetail(filteredTransaction);
    }
  };

  const handleDeleteClick = (technician) => {
    setSelectedtechnician(technician);
    setOpenDeleteModal(true);
  };

  useEffect(() => {
    const filteredTransactionDetail = transactions
      ? transactions.filter((technician) => {
       
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" && technician.status === "ACTIVE") ||
            (filterOption === "INACTIVE" && technician.status === "INACTIVE");
          return  filterMatch;
        })
      : [];
    setFilteredTransactionDetail(filteredTransactionDetail);
  }, [transactions, searchText, filterOption]);

  useEffect(() => {
    setLoading(true);
    console.log("id" + id);
    // Pass the 'id' to the API request as a parameter
    dispatch(getTransactionOfWalletId({ id }))
      .then((response) => {
        // Successfully fetched data
        const responseData = response.payload.data;
        console.log("responseData detail" + responseData);
        if (responseData) {
          setData(responseData);
          setFilteredTransactionDetail(responseData);
          // Handle the data as needed
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, id]);
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
      key: "transactionAmount",
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
      key: "totalAmount",
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
      field: "createdAt",
      headerName: "Date",
      width: 100,
      key: "status",
      valueGetter: (params) =>
        moment(params.row.createAt).utcOffset(7).format("DD-MM-YYYY"),
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
    <Box m="10px">
      <Header
        title="Chi tiết đơn hàng"
    
      walletId={"WalletId: "+id}
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
              <MenuItem key="status-active" value="ACTIVE">
                Hoạt Động
              </MenuItem>
              <MenuItem key="status-INACTIVE" value="INACTIVE">
                Không Hoạt Động
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
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
          >
   
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default TransactionDetails;
