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
  Switch,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Edit, FilterList, Search } from "@mui/icons-material";

import ModalDetail from "./ModalComponentDetail";
import ModalEdit from "./ModalComponentEdit";
import CustomTablePagination from "./TablePagination";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import {
  fetchRescueVehicleOwners,
  getRescueVehicleOwnerId,
  updateStatusRescueVehicleOwner,
} from "../../redux/rescueVehicleOwnerSlice";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
const RescueVehicleOwners = (props) => {
  const dispatch = useDispatch();
  const rescueVehicleOwners = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const [rescueVehicleOwnerStatus, setRescueVehicleOwnerStatus] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openEditModalRescuse, setOpenEditModalRescuse] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [openModal, setOpenModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedEditRescueVehicleOwner, setSelectedEditRescueVehicleOwner] =
    useState(null);
  const [filteredRescueVehicleOwners, setFilteredRescueVehicleOwners] =
    useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [initialFormState, setInitialFormState] = useState({});
  const [editStatus, setEditStatus] = useState({});
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
      const filteredrescueVehicleOwners = rescueVehicleOwners.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredRescueVehicleOwners(filteredrescueVehicleOwners);
      setFilterOption("Date");
    } else {
      setFilteredRescueVehicleOwners(rescueVehicleOwners);
    }
  };
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredRescueVehicleOwners(rescueVehicleOwners);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredrescueVehicleOwners = rescueVehicleOwners.filter(
        (rescueVehicleOwner) =>
          rescueVehicleOwner.status === selectedStatusOption
      );
      setFilteredRescueVehicleOwners(filteredrescueVehicleOwners);
    }
  };

  useEffect(() => {
    if (rescueVehicleOwners) {
      if (rescueVehicleOwners.id) {
        const RescuseVehicleOwnerToEditToEdit = rescueVehicleOwners.find(
          (rescuseVehicleOwner) =>
            rescuseVehicleOwner.id === rescueVehicleOwners.id
        );
        if (RescuseVehicleOwnerToEditToEdit) {
          console.log(RescuseVehicleOwnerToEditToEdit);
          setEditStatus(RescuseVehicleOwnerToEditToEdit);
          setInitialFormState(RescuseVehicleOwnerToEditToEdit);
        }
      }
    }
  }, [rescueVehicleOwners]);

  useEffect(() => {
    const filteredRescueVehicleOwners = rescueVehicleOwners
      ? rescueVehicleOwners.filter((rescueVehicleOwner) => {
          const nameMatch =
            rescueVehicleOwner.fullname &&
            rescueVehicleOwner.fullname
              .toLowerCase()
              .includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" &&
              rescueVehicleOwner.status === "ACTIVE") ||
            (filterOption === "INACTIVE" &&
              rescueVehicleOwner.status === "INACTIVE");
          return nameMatch && filterMatch;
        })
      : [];
    setFilteredRescueVehicleOwners(filteredRescueVehicleOwners);
  }, [rescueVehicleOwners, searchText, filterOption]);

  if (rescueVehicleOwners) {
    rescueVehicleOwners.forEach((rescueVehicleOwner) => {
      // Đây bạn có thể truy cập và xử lý dữ liệu từng đối tượng khách hàng ở đây
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchRescueVehicleOwners())
      .then((response) => {
        // Đã lấy dữ liệu thành công
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredRescueVehicleOwners(data);

          setLoading(false); // Đặt trạng thái loading thành false sau khi xử lý dữ liệu
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleUpdateClick = (rescueVehicleOwnerId) => {
    console.log(rescueVehicleOwnerId);
    // Fetch the rescueVehicleOwnerId details based on the selected rescueVehicleOwnerId ID
    dispatch(getRescueVehicleOwnerId({ id: rescueVehicleOwnerId }))
      .then((response) => {
        const rescueVehicleOwnerDetails = response.payload.data;
        setSelectedEditRescueVehicleOwner(rescueVehicleOwnerDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin chủ xe cứu hộ:", error);
      });
  };

  const handleBookDetailClick = (book) => {
    setSelectedBook(book);
    setOpenModal(true);
  };
  const reloadRescueVehicleOwners = () => {
    dispatch(fetchRescueVehicleOwners())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredRescueVehicleOwners(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách chủ xe cứu hộ:", error);
      });
  };
  const handleSaveClickStatus = (rescueVehicleOwnerId, fullname, newStatus) => {
    if (!rescueVehicleOwnerId || !fullname || !newStatus) {
      toast.error("Không có thông tin để cập nhật.");
      return;
    }
    console.log(fullname);
    console.log(rescueVehicleOwnerId);
    console.log(newStatus);
    // Create an object containing the necessary data
    const updateData = {
      id: rescueVehicleOwnerId,
      fullname: fullname,
      sex: "",
      phone: "",
      avatar: "",
      address: "",
      createAt: "",
      updateAt: "",
      area: "",
      status: newStatus,
    };
    const updateDataJson = JSON.stringify(updateData);
    console.log("dã update" + updateData);
    // Update the status of the matching RescueVehicleOwner and send the update to the server
    dispatch(updateStatusRescueVehicleOwner({ data: updateDataJson }))
      .then(() => {
        toast.success("Thay đổi trạng thái thành công.");
        reloadRescueVehicleOwners();
        setIsSuccess(true);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi cập nhật chủ xe cứu hộ: ${error.response.data.message}`
          );
        } else if (error.message) {
          toast.error(`Lỗi khi cập nhật chủ xe cứu hộ: ${error.message}`);
        } else {
          toast.error("Lỗi khi cập nhật chủ xe cứu hộ");
        }
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredrescueVehicleOwnersPagination =
    filteredRescueVehicleOwners.slice(
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
      field: "fullname",
      headerName: "Họ Và Tên",
      width: 160,
      key: "fullname",
    },
    { field: "sex", headerName: "Giới Tính", width: 60, key: "sex" },
    { field: "address", headerName: "Địa Chỉ", width: 140, key: "address" },
    {
      field: "phone",
      headerName: "Số Điện Thoại",
      width: 120,
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
      field: "avatar",
      headerName: "Hình ảnh",
      width: 120,
      renderCell: (params) => {
        const containsSpecialChars =
          /[áàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]/.test(
            params.value
          );
        const isRandomChars = isAllCharactersSame(params.value);
        const avatarSrc =
          params.value && !containsSpecialChars && !isRandomChars
            ? params.value
            : "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"; // Đặt URL của hình mặc định ở đây
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
          <Switch
            defaultChecked
            color="warning"
            checked={params.value === "ACTIVE"}
            onChange={() => {
              const newStatus =
                params.value === "ACTIVE" ? "INACTIVE" : "ACTIVE"; // Toggle the status

              // Lấy ID, fullname và status từ dữ liệu cột
              const rescueVehicleOwnerId = params.row.id;
              const fullname = params.row.fullname;
              handleSaveClickStatus(rescueVehicleOwnerId, fullname, newStatus);
              // Gọi hàm để gửi yêu cầu cập nhật trạng thái
              // Để cập nhật giao diện ngay lập tức, bạn cần áp dụng thay đổi trạng thái lên local state
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
        <EditIcon
          variant="contained"
          color="error"
          onClick={() => handleUpdateClick(params.row.id)}
        >
          <EditIcon style={{ color: "green" }} />
        </EditIcon>
      ),
      key: "update",
    },
  ];

  return (
    <Box m="5px">
      <Header title="Chủ Xe Cứu Hộ" subtitle="Danh sách chủ xe cứu hộ" />
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
          rows={filteredrescueVehicleOwnersPagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
        />

        <CustomTablePagination
          count={filteredRescueVehicleOwners.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
        />
      </Box>
      <ModalDetail
        openModal={openModal}
        setOpenModal={setOpenModal}
        onClose={() => setOpenModal(false)}
        selectedBook={selectedBook}
        loading={loading}
      ></ModalDetail>

      <ModalEdit
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedEditRescuseVehicleOwner={selectedEditRescueVehicleOwner}
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
                  color="error"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setOpenDeleteModal(false)}
                  variant="contained"
                >
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

export default RescueVehicleOwners;
