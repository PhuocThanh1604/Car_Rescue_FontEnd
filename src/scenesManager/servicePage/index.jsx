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
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Edit, FilterList, Search } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
// import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
import CustomTablePagination from "./TablePagination";
import ToggleButton from "./ToggleButton";
import { DeleteOutline } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";

import { fetchServices, getServiceId } from "../../redux/serviceSlice";
const Services = (props) => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.service.services);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
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
  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredServices = services.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredSerivces(filteredServices);
      setFilterOption("Date");
    } else {
      setFilteredSerivces(services);
    }
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

  const handleBookDetailClick = (book) => {
    setSelectedBook(book);
    setOpenModal(true);
  };

  useEffect(() => {
    const filteredServices = services
      ? services.filter((service) => {
          const nameMatch =
            service.name &&
            service.name.toLowerCase().includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" && service.status === "ACTIVE") ||
            (filterOption === "INACTIVE" && service.status === "INACTIVE");
          return nameMatch && filterMatch;
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
    dispatch(fetchServices())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredSerivces(data);

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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredServicesPagination = filteredSerivces.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  function isAllCharactersSame(value) {
    if (!value) {
      return false;
    }

    const firstChar = value[0];
    return value.split("").every((char) => char === firstChar);
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    {
      field: "name",
      headerName: "Tên Dịch Vụ",
      width: 160,
      key: "name",
      cellClassName: "name-column--cell",
    },
    {
      field: "type",
      headerName: "Loại Dịch Vụ",
      width: 80,
      key: "type",
    },
    {
      field: "description",
      headerName: "Mô Tả",
      width: 120,
      key: "description",
    },
    {
      field: "price",
      headerName: "Giá Dịch Vụ",
      width: 100,
      key: "price",
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
    // {
    //   field: "publicDate",
    //   headerName: "Date",
    //   width: 100,
    //   key: "status",
    //   valueGetter: (params) =>
    //     moment(params.row.createAt).utcOffset(7).format("DD-MM-YYYY"),
    // },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 80,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" className="filter-box">
          <ToggleButton
            initialValue={params.value === "ACTIVE"}
            onChange={(value) => {
              const updatedServices = services.map((service) => {
                if (service.id === params.row.id) {
                  return {
                    ...service,
                    status: value ? "ACTIVE" : "INACTIVE",
                  };
                }
                return service;
              });
              // setFilteredServices(updatedServices);
            }}
          />
        </Box>
      ),
      key: "status",
    },
    {
      field: "update",
      headerName: "Cập Nhật",
      width: 60,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => handleUpdateClick(params.row.id)}
        >
          <Edit style={{ color: "red" }} />
        </IconButton>
      ),
      key: "update",
    },
  ];

  return (
    <Box m="5px">
      <Header title="Dịch Vụ" subtitle="Danh sách dịch vụ" />
      <Box display="flex" className="box" left={0}>
      <Box
          display="flex"
          borderRadius="5px"
          border={1}
          marginRight={2} 
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
          rows={filteredServicesPagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
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
            {/* <Card>
              <CardContent>
                <Typography variant="h3">Confirm Delete</Typography>
                <Typography>
                  Are you sure you want to delete this book?
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  color="error">
                  Delete
                </Button>
                <Button
                  onClick={() => setOpenDeleteModal(false)}
                  variant="contained">
                  Cancel
                </Button>
              </CardActions>
            </Card> */}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Services;
