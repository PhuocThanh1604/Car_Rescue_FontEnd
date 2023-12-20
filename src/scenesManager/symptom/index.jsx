import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Modal,
  Select,
  MenuItem,
  IconButton,
  FormControl,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import ModalEdit from "./ModalEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import {  fetchSymptom, getServiceId, getSymptomId } from "../../redux/serviceSlice";
import CustomTablePagination from "../../components/TablePagination";
const Symptoms = (props) => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.service.services);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [filterOptionType, setFilterOptionType] = useState("type");
  const [selectedEditSevice, setSelectedEditSevice] = useState(null);
  const [filteredSerivces, setFilteredSerivces] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);
  const handleSearchChange = (event) => {
    const value = event.target.value || ""; // Use an empty string if the value is null
    setSearchText(value);
  };

  const handleUpdateClick = (serviceId) => {
    console.log(serviceId);

    dispatch(getSymptomId({ id: serviceId })) 
      .then((response) => {
        const serviceDetails = response.payload.data; 
        setSelectedEditSevice(serviceDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin hiện tượng:", error);
      });
  };


// Trong hàm useEffect
useEffect(() => {
  const filteredServices = services
    ? services.filter((service) => {
        // Đảm bảo rằng service tồn tại trước khi truy cập các thuộc tính của nó
        const nameMatch = service?.symptom1
          ? service.symptom1.toLowerCase().includes(searchText.toLowerCase())
          : false;

        return nameMatch ;
      })
    : [];

  
  console.log(filteredServices);
  setFilteredSerivces(filteredServices);
}, [services, searchText, filterOption, filterOptionType]);



  useEffect(() => {
    setLoading(true);
    dispatch(fetchSymptom())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredSerivces(data);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }else{
          toast.dismiss("không có dữ liệu trả về")
        }
      })
      .catch(error => {
        // Xử lý lỗi ở đây
        console.error("Lỗi khi lấy dữ liệu hiện tượng:", error);
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

  const filteredServicesPagination = filteredSerivces.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "symptom1",
      headerName: "Tên Hiện Tượng",
      width: 220,
      key: "symptom1",
      cellClassName: "name-column--cell",
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
            // Thay đổi màu sắc hoặc hiệu ứng khác khi hover vào Box
            backgroundColor: "lightgray",

            borderRadius: "4px",
          },
        }}
      >       <IconButton
      variant="contained"
      color="error"
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
      <Header title="Hiện Tượng Phổ Biến" subtitle="Danh sách chi tiết hiện tượng" />
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
        <Box display="flex"
            borderRadius="6px"
            marginRight={2}
            marginLeft={2}
            sx={{
              height: "auto",
              width: "auto",
              alignItems: "center", // Các nút được căn giữa theo chiều dọc
            }}>
            <a href="add/symptom" style={{ textDecoration: "none" }}>
              {" "}
              {/* Thêm đường dẫn ở đây */}
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disableElevation
                sx={{
                  width: "150px",
                  height: "50px", 
                }}
              >
                <AddIcon sx={{ color: "white", fontWeight: "bold" }} />
                <Typography sx={{ color: "white", fontWeight: "bold" }}>
                  Tạo Hiện Tượng
                </Typography>
              </Button>
            </a>
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
          rows={filteredServicesPagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />

        <CustomTablePagination
          count={filteredSerivces.length}
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
        selectedEditService={selectedEditSevice}
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

export default Symptoms;
