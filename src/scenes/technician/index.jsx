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
import ModalEdit from "./ModalEdit";
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
    const formattedStartDate = moment(startDate)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .startOf("day");
    const formattedEndDate = moment(endDate)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .startOf("day");

    const filteredTechnicians = technicians.filter((technician) => {
      // Kiểm tra nếu dữ liệu không hợp lệ trong technician.createAt
      if (!technician.createdAt || !moment(technician.createdAt).isValid()) {
        // Xử lý khi dữ liệu không hợp lệ, ví dụ: loại bỏ technician này khỏi kết quả lọc
        return false;
      }

      const orderDate = moment(technician.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");

      const isAfterStartDate = orderDate.isSameOrAfter(
        formattedStartDate,
        "day"
      );
      const isBeforeEndDate = orderDate.isSameOrBefore(formattedEndDate, "day");

      return isAfterStartDate && isBeforeEndDate;
    });

    setFilteredTechnicians(filteredTechnicians);
    setFilterOption("Date");
  };

  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);
    if (!Array.isArray(technicians) || technicians.length === 0) {
      // Xử lý khi technicians không tồn tại hoặc không có dữ liệu
      toast.error("Không có dữ liệu technicians.");
      return;
    }

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
        toast.error("Lỗi khi lấy thông tin kỹ thuật viên:", error);
      });
  };

  useEffect(() => {
    if (!Array.isArray(technicians)) {
      // Xử lý khi technicians không tồn tại, không có dữ liệu hoặc searchText/filterOption không được định nghĩa
      toast.dismiss("Dữ liệu không hợp lệ để thực hiện lọc.");
      return;
    }
    const filteredTechnicians = technicians
      ? technicians.filter((technician) => {
          const hasFullName =
            technician &&
            technician.fullname && // Kiểm tra technician không phải undefined và có thuộc tính fullname
            technician.fullname
              .toLowerCase()
              .includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" && technician.status === "ACTIVE") ||
            (filterOption === "INACTIVE" && technician.status === "INACTIVE") ||
            (filterOption === "ASSIGNED" && technician.status === "ASSIGNED");
          return hasFullName && filterMatch;
        })
      : [];
    setFilteredTechnicians(filteredTechnicians);
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
        }else{
          toast.dismiss("không có dữ liệu trả về")
        }
      }).catch(error => {
        toast.dismiss("Lỗi khi lấy dữ liệu kỹ thuật viên:", error);
      }).finally(() => {
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
      headerName: "Tên kỹ thuật viên",
      width: 160,
      key: "fullname",
      cellClassName: "name-column--cell",
    },
    {
      field: "sex",
      headerName: "Gioi Tính",
      width: 80,
      key: "sex",
    },
    { field: "address", headerName: "Địa Chỉ", width: 260, key: "address" },

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
    { field: "area", headerName: "Khu Vực", width: 60, key: "area" },

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
            {status === "ACTIVE" && <HowToRegIcon />}
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
      headerName: "Update",
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
      <Header title="Kỹ Thuật Viên" subtitle="Danh sách kỹ thuật vi" />

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
                Hoạt Động
              </MenuItem>
              <MenuItem key="status-INACTIVE" value="INACTIVE">
                Không Hoạt Động
              </MenuItem>
              <MenuItem key="status-ASSIGNED" value="ASSIGNED">
                Đang làm việc
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
          ></Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Technicians;
