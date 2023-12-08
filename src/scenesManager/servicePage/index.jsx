import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Modal,
  TextField,
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
import { Edit } from "@mui/icons-material";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import ModalEdit from "./ModalEdit";
import ToggleButton from "./ToggleButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import { fetchServices, getServiceId } from "../../redux/serviceSlice";
import CustomTablePagination from "../../components/TablePagination";
const Services = (props) => {
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

  const handleFilterRescueType = (event) => {
    const selectedResuceOption = event.target.value;
    setFilterOptionType(selectedResuceOption);

    if (!Array.isArray(services) || !services.length) {
      return;
    }

    let filteredServices;
    if (selectedResuceOption === "type") {
      filteredServices = [...services]; // Hiển thị tất cả các dịch vụ
    } else {
      filteredServices = services.filter(
        (service) => service.type === selectedResuceOption
      );
    }
    setFilteredSerivces(filteredServices); // Cập nhật danh sách dịch vụ đã lọc
};

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredSerivces(services);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredSerivces = services.filter(
        (service) => service.status === selectedStatusOption
      ); //check
      setFilteredSerivces(filteredSerivces);
    }
  };
  const handleUpdateClick = (serviceId) => {
    console.log(serviceId); //check
    // Fetch the serviceId details based on the selected serviceId ID
    dispatch(getServiceId({ id: serviceId })) //check
      .then((response) => {
        const serviceDetails = response.payload.data; //check
        setSelectedEditSevice(serviceDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin dịch vụ:", error);
      });
  };


// Trong hàm useEffect
useEffect(() => {
  const filteredServices = services
    ? services.filter((service) => {
        // Đảm bảo rằng service tồn tại trước khi truy cập các thuộc tính của nó
        const nameMatch = service?.name
          ? service.name.toLowerCase().includes(searchText.toLowerCase())
          : false;

        const filterMatch =
          filterOption === "Status" ||
          (filterOption === "ACTIVE" && service?.status === "ACTIVE") ||
          (filterOption === "INACTIVE" && service?.status === "INACTIVE");

        const filterMatchType =
          filterOptionType === "type" ||
          (filterOptionType === "Fixing" && service?.type === "Fixing") ||
          (filterOptionType === "Towing" && service?.type === "Towing");

        return nameMatch && filterMatch && filterMatchType;
      })
    : [];
  
  console.log(filteredServices);
  setFilteredSerivces(filteredServices);
}, [services, searchText, filterOption, filterOptionType]);





  if (services) {
    services.forEach((service) => {
      // Đây bạn có thể truy cập và xử lý dữ liệu từng đối tượng khách hàng ở đây
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchServices())
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
        console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
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
      field: "name",
      headerName: "Tên Dịch Vụ",
      width: 160,
      key: "name",
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Mô Tả",
      width: 260,
      key: "description",
    },
  
    {
      field: "type",
      headerName: "Hình Thức",
      width: 140,
      key: "type",
      renderCell: ({ row: { type } }) => {
        return (
          <Box
            width="auto"
            m="0 auto"
            p="2px"
            display="flex"
            justifyContent="center"
            fontSize={10}
            borderRadius={2}
            backgroundColor={
              type === "Fixing"
                ? colors.yellowAccent[400]
                : colors.grey[800]
                ? colors.redAccent[600]
                : type === "Towing"
            }
            color={
              type === "Towing"
                ? colors.redAccent[300]
                : colors.yellowAccent[700]
            }
          >
            {type === "Towing" && <SupportIcon />}
            {type === "Fixing" && <HandymanIcon />}
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
              {type === "Towing"
                ? "Kéo Xe"
                : type === "Fixing"
                ? "Sữa Chữa Tại Chỗ"
                : type}
            </Typography>
          </Box>
        );
      },
    },

  
    {
      field: "price",
      headerName: "Giá Dịch Vụ",
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
            <Typography color={colors.blueAccent[500]}sx={{fontWeight:"bold"}}>
              {formattedPrice}
            </Typography>
          );
        } else {
          return params.value;
        }
      },
    },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 140,
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
              status === "ACTIVE"
                ? colors.green[300]
                : status === "ASSIGNED"
                ? colors.redAccent[700]
                : colors.redAccent[700]
                ? colors.blueAccent[700]
                : status === "COMPLETED"
            }
            color={
              status === "ACTIVE" ? colors.green[800] : colors.yellowAccent[700]
            }
          >
            {status === "ACTIVE" }
            <Typography color="inherit" sx={{ ml: "1px", fontWeight: "bold" }}>
              {status === "ACTIVE"
                ? "Đang Hoạt Động"
                : status === "INACTIVE"
                ? "Không Hoạt Động"
                : status === "ASSIGNED"
                ? "Đang Làm Việc"
                : status}
            </Typography>
          </Box>
        );
      },
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
      <Header title="Dịch Vụ" subtitle="Danh sách chi tiết dịch vụ" />
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
        <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOptionType}
              onChange={handleFilterRescueType}
              variant="outlined"
              className="filter-select"
              style={{ width: "150px" ,marginRight:"10px"}}
            >
              <MenuItem key="type-all" value="type">
                Hình Thức
              </MenuItem>
              <MenuItem key="type-towing" value="Towing">
                Kéo Xe
              </MenuItem>
              <MenuItem key="type-fixing" value="Fixing">
                Sửa Chữa Tại Chỗ
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
              <MenuItem key="status-active" value="ACTIVE">
                Hoạt động
              </MenuItem>
              <MenuItem key="status-INACTIVE" value="INACTIVE">
                Không hoạt động
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex"
            borderRadius="6px"
            marginRight={2}
            marginLeft={2}
            sx={{
              height: "auto",
              width: "auto",
              alignItems: "center", // Các nút được căn giữa theo chiều dọc
            }}>
            <a href="add/service" style={{ textDecoration: "none" }}>
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
                  Tạo Dịch Vụ
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

export default Services;
