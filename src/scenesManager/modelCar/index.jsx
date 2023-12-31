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
import { Edit } from "@mui/icons-material";
import ModalEdit from "./ModalComponentEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import AddIcon from "@mui/icons-material/Add";
import CustomTablePagination from "../../components/TablePagination";
import { fetchModelCar, getModelCarId } from "../../redux/modelCarSlice";
const ModelCar = (props) => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.service.services);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [selectedEditSevice, setSelectedEditSevice] = useState(null);
  const [filteredSerivces, setFilteredSerivces] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
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
    dispatch(getModelCarId({ id: serviceId })) //check
      .then((response) => {
        const updatedFilteredServices = filteredSerivces.filter(
          (service) => service.id !== serviceId
        );
  
        // Cập nhật danh sách filteredServices với dữ liệu đã lọc
        setFilteredSerivces(updatedFilteredServices);
        const serviceDetails = response.payload.data;
        console.log(serviceDetails)
        setSelectedServiceDetails(serviceDetails);
        setSelectedEditSevice(serviceDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
        reloadModelCar()
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin dịch vụ:", error);
      });
  };
  const reloadModelCar = () => {
    dispatch(fetchModelCar())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setFilteredSerivces(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
          console.log("Services reloaded:", data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách xe cứu hộ:", error);
      });
  };
  useEffect(() => {
    const filteredServices = services
    ? services.filter((service) => {
        const nameMatch = service?.symptom1
          ? service.symptom1.toLowerCase().includes(searchText.toLowerCase())
          : false;
        return nameMatch;
      })
    : [];
  
    setFilteredSerivces(filteredServices);
  }, [services, searchText, filterOption]);

  

  if (services) {
    services.forEach((service) => {
      // Đây bạn có thể truy cập và xử lý dữ liệu từng đối tượng khách hàng ở đây
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchModelCar())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredSerivces(data);
          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }else{
          toast.dismiss("Không có dữ liệu từ phản hồi");
        }
      }).catch(error => {
        // Xử lý lỗi ở đây
        toast.error("Lỗi khi lấy dữ liệu model:", error);
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
  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    {
      field: "model1",
      headerName: "Tên Mẫu Xe",
      width: 160,
      key: "model1",
      cellClassName: "name-column--cell",
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
        <IconButton
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
      ),
      key: "update",
    },
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header title="Mẫu Xe " subtitle="Danh sách chi tiết mẫu xe" />
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
            <a href="add/modelCar" style={{ textDecoration: "none" }}>
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
                  Tạo Mẫu Xe
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
        setSelectedEditService={setSelectedServiceDetails}
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

export default ModelCar;
