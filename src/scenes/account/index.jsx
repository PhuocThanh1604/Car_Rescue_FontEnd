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
import { Edit, FilterList, Search } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import { fetchTechnicians, getTechnicianId } from "../../redux/technicianSlice";
import CustomTablePagination from "../../components/TablePagination";
import AddCardIcon from "@mui/icons-material/AddCard";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { fetchAccounts, getAccountId } from "../../redux/accountSlice";
import ModalEdit from "./ModalEdit";
const Accounts = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.account.accounts);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditTechnician, setselectedEditTechnician] = useState(null);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedEditAccount, setSelectedEditAccount] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [technicianData, setTechnicianData] = useState([]);
  useEffect(() => {
    if (isSuccess) {
      reloadTechnicians(); // Gọi hàm cập nhật danh sách khi thành công
    }
  }, [isSuccess]);

  const reloadTechnicians = () => {
    dispatch(fetchAccounts())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredTechnicians(data); 
          setLoading(false);
          console.log("Accounts reloaded:", data);
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi tải lại danh sách khách hàng:", error);
      });
  };
  const handleSearchChange = (event) => {
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };
  useEffect(() => {
    // Lọc dữ liệu dựa trên searchText khi searchText thay đổi
    if (searchText.trim() === "") {
      setFilteredTechnicians(data); // Nếu không có tìm kiếm, hiển thị toàn bộ dữ liệu
    } else {
      const filteredAccounts = data.filter((account) =>
        account.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTechnicians(filteredAccounts);
    }
  }, [searchText, data]);
  useEffect(() => {
    setLoading(true);
    dispatch(fetchAccounts())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;

        if (data) {
          setData(data);
          setFilteredTechnicians(data);
          // Truy xuất và xử lý từng đối tượng khách hàng ở đây
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .catch((error) => {
        // Xử lý lỗi ở đây
        console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  //update
  const handleUpdateClick = (accountId) => {
    console.log(accountId);
    dispatch(getAccountId({ id: accountId }))
      .then((response) => {
        const accountDetails = response.payload.data;

        setSelectedEditAccount(accountDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        toast.error("Lỗi khi lấy thông tin kỹ thuật viên:", error);
      });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTechniciansPagination = filteredTechnicians.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "email",
      headerName: "Tên Tài Khoản",
      width: 180,
      key: "email",
    },
    { field: "id", headerName: "accountId", width: 200, key: "id" },

    {
      field: "createAt",
      headerName: "Ngày Tạo",
      width: 140,
      key: "createAt",
      valueGetter: (params) =>
        moment(params.row.createAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      field: "update",
      headerName: "Cập Nhật",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "lightgray",

              borderRadius: "4px",
            },
          }}
        >
          {" "}
          <IconButton
            variant="contained"
            color="indigo"
            onClick={() => handleUpdateClick(params.row.id)}
          >
            <Typography
              variant="body1"
              sx={{ ml: "1px", color: "indigo", fontWeight: "bold" }}
            >
              Chỉnh Sửa
            </Typography>
          </IconButton>
        </Box>
      ),
      key: "update",
    },
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header title="Danh Sách Tài Khoản" />

      <Box display="flex" className="box" left={0}>
        <Box
          display="flex"
          borderRadius="6px"
          border={1}
          marginRight={2}
          marginLeft={2}
          width={500}
          height={50}
        >
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
          rows={filteredTechniciansPagination}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />
        <CustomTablePagination
          count={filteredTechnicians.length}
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
        accountDetails={selectedEditAccount} // Truyền dữ liệu từ handleUpdateClick vào đây
        onClose={() => setOpenEditModal(false)}
        loading={loading}
        updateFilteredTechnicians={reloadTechnicians}
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

export default Accounts;
