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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Edit, FilterList, Search } from "@mui/icons-material";
import ModalEdit from "./ModalComponentEdit";
import ToggleButton from "./ToggleButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import { fetchTechnicians, getTechnicianId } from "../../redux/technicianSlice";
import CustomTablePagination from "../../components/TablePagination";

const Technicians = (props) => {
  const dispatch = useDispatch();
  const technicians = useSelector((state) => state.technician.technicians);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEditTechnician, setselectedEditTechnician] = useState(null);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
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
      const filteredtechnicians = technicians
        ? technicians.filter((user) => {
            const orderDate = moment(user.createAt).format("YYYY-MM-DD");
            const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
            const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
            return isAfterStartDate && isBeforeEndDate;
          })
        : [];
      setFilteredTechnicians(filteredtechnicians);
      setFilterOption("Date");
    } else {
      setFilteredTechnicians(technicians);
    }
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredTechnicians(technicians);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredtechnicians = technicians.filter(
        (technician) => technician.status === selectedStatusOption
      );
      setFilteredTechnicians(filteredtechnicians);
    }
  };

  const handleUpdateClick = (technicianId) => {
    console.log(technicianId);
    // Fetch the technicianId details based on the selected technicianId ID
    dispatch(getTechnicianId({ id: technicianId }))
      .then((response) => {
        const technicianDetails = response.payload.data; // No need for .data here
        setselectedEditTechnician(technicianDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin kỹ thuật viên:", error);
      });
  };

  const handleDeleteClick = (technician) => {
    setSelectedtechnician(technician);
    setOpenDeleteModal(true);
  };

  // const handleConfirmDelete = () => {
  //   dispatch(deletetechnician({ id: selectedtechnician.bookId }))
  //     .then(() => {
  //       toast.success('Delete book successfully');
  //       setOpenDeleteModal(false);
  //       // Cập nhật danh sách sản phẩm sau khi xóa thành công
  //       const updatedtechnicians = technicians.filter(
  //         (technician) => technician.bookId !== selectedtechnician.bookId
  //       );
  //       setFilteredtechnicians(updatedtechnicians);
  //     })
  //     .catch((error) => {
  //       toast.error(error,"Error!!");
  //     });
  // };

  useEffect(() => {
    const filteredtechnicians = technicians
      ? technicians.filter((technician) => {
          const nameMatch = technician.fullname
            .toLowerCase()
            .includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" && technician.status === "ACTIVE") ||
            (filterOption === "INACTIVE" && technician.status === "INACTIVE");
          return nameMatch && filterMatch;
        })
      : [];
    setFilteredTechnicians(filteredtechnicians);
  }, [technicians, searchText, filterOption]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchTechnicians())
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

  const filteredtechniciansPagination = filteredTechnicians.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "fullname",
      headerName: "Tên quản lí",
      width: 160,
      key: "fullname",
      cellClassName: "name-column--cell",
    },
    {
      field: "sex",
      headerName: "Gioi Tính",
      width: 30,
      key: "sex",
    },
    { field: "address", headerName: "Địa Chỉ", width: 120, key: "address" },
    { field: "area", headerName: "Khu Vực", width: 60, key: "area" },
    {
      field: "phone",
      headerName: "Số Điện Thoại",
      width: 100,
      key: "price",
      valueFormatter: (params) => {
        // Đảm bảo rằng params.value là một số
        if (typeof params.value === "number") {
          // Chuyển số thành chuỗi và định dạng theo định dạng số điện thoại
          return params.value
            .toString()
            .replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
        } else {
          return params.value;
        }
      },
    },
    {
      field: "publicDate",
      headerName: "Date",
      width: 100,
      key: "status",
      valueGetter: (params) =>
        moment(params.row.createAt).utcOffset(7).format("DD-MM-YYYY"),
    },
    {
      field: "avatar",
      headerName: "Hình ảnh",
      width: 120,
      renderCell: (params) => {
        const avatarSrc =
          params.value ||
          "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"; // Đặt URL của hình mặc định ở đây
        return (
          <img
            src={avatarSrc}
            alt="Hình ảnh"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%", // Tạo hình tròn
            }}
          />
        );
      },
    },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 80,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" className="filter-box">
          <ToggleButton
            initialValue={params.value === "ACTIVE"}
            onChange={(value) => {
              const updatedtechnicians = technicians.map((technician) => {
                if (technician.id === params.row.id) {
                  return {
                    ...technician,
                    status: value ? "ACTIVE" : "INACTIVE",
                  };
                }
                return technician;
              });
              // setFilteredtechnicians(updatedtechnicians);
            }}
          />
        </Box>
      ),
      key: "status",
    },
    {
      field: "update",
      headerName: "Update",
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
    // {
    //   field: 'delete',
    //   headerName: 'Xóa',
    //   width: 60,
    //   renderCell: (params) => (
    //     <IconButton
    //       variant="contained"
    //       color="secondary"
    //       onClick={() => handleDeleteClick(params.row)}
    //       {...(loading ? { loading: true } : {})} // Conditionally include the loading attribute
    //       comingsoon={loading ? 1 : 0}

    //     >
    //       <DeleteOutline />
    //     </IconButton>
    //   ),
    //   key: 'deleted',
    // },
  ];

  return (
    <Box m="10px">
      <Header title="Kỹ Thuật Viên" subtitle="Danh sách kỹ thuật vi" />

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
          rows={filteredtechniciansPagination}
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

export default Technicians;
