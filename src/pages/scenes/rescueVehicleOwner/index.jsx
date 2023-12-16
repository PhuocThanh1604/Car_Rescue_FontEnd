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
  Typography,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import ModalEdit from "./ModalEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";

// import {
//   fetchRescueVehicleOwners,
//   getRescueVehicleOwnerId,
//   updateStatusRescueVehicleOwner,
// } from "../../redux/rescueVehicleOwnerSlice";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import {
  fetchRescueVehicleOwners,
  getRescueVehicleOwnerId,
  updateStatusRescueVehicleOwner,
} from "../../../redux/rescueVehicleOwnerSlice";
import CustomTablePagination from "../../../components/TablePagination";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../../data.json";
const RescueVehicleOwners = (props) => {
  const dispatch = useDispatch();
  const rescueVehicleOwners = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
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
  const [accountData, setAccountData] = useState({});
  const [dataJson, setDataJson] = useState([]);
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu");
    }
    setDataJson(areaData);
  }, [dataJson]);
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
      // Format startDate and endDate to the beginning of the day in the specified time zone
      const formattedStartDate = moment(startDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");
      const formattedEndDate = moment(endDate)
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "hours")
        .startOf("day");

      const filteredRVO = rescueVehicleOwners.filter((rescueVehicleOwner) => {
        // Adjust the order createdAt date to the same time zone
        const rescueVehicleOwnerDate = moment(rescueVehicleOwner.createAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .startOf("day");

        const isAfterStartDate = rescueVehicleOwnerDate.isSameOrAfter(
          formattedStartDate,
          "day"
        );
        const isBeforeEndDate = rescueVehicleOwnerDate.isSameOrBefore(
          formattedEndDate,
          "day"
        );

        return isAfterStartDate && isBeforeEndDate;
      });

      setFilteredRescueVehicleOwners(filteredRVO);
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
          setLoading(false);
        }
      })
      .catch((error) => {
        // Xử lý lỗi ở đây
        toast.error("Lỗi khi lấy dữ liệu danh sách chủ xe cứu hộ:", error);
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
        console.log(rescueVehicleOwnerDetails.accountId);
        const accountData = response.payload.data;
        console.log(response.payload.data.account);
        setAccountData(accountData);
        setSelectedEditRescueVehicleOwner(rescueVehicleOwnerDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin chủ xe cứu hộ:", error);
      });
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

  const filteredRescueVehicleOwnersPagination =
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
      renderCell: (params) => (
        <Box>
        <Box sx={{fontWeight:"bold"}}>{params.row.fullname}</Box>
        {params.row.account?.email ? (
      <Box sx={{color:"black"}}>{params.row.account?.email}</Box>
    ) : (
      <Box  sx={{color:"black"}} >Không có Email</Box> 
    )}
      </Box>
    ),
    cellClassName: "name-column--cell",
    },
    { field: "sex", headerName: "Giới Tính", width: 60, key: "sex" },
    { field: "address", headerName: "Địa Chỉ", width: 260, key: "address" },
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
      field: "area",
      headerName: "Khu Vực",
      width: 120,
      key: "area",
      renderCell: ({ row }) => {
        const { area } = row;

        let displayedArea = "Không có dữ liệu";
        let areaDescription = ""; // Mô tả khu vực

        if (dataJson.area && dataJson.area.length > 0) {
          switch (area) {
            case 1:
              displayedArea = dataJson.area[0]?.name || "Không có";
              areaDescription =
                dataJson.area[0]?.description || "Không có mô tả";
              break;
            case 2:
              displayedArea = dataJson.area[1]?.name || "Không có";
              areaDescription =
                dataJson.area[1]?.description || "Không có mô tả";
              break;
            case 3:
              displayedArea = dataJson.area[2]?.name || "Không có";
              areaDescription =
                dataJson.area[2]?.description || "Không có mô tả";
              break;
            default:
              displayedArea = "Không có dữ liệu";
          }
        }

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography color="inherit">{displayedArea}</Typography>
            <Tooltip
              title={areaDescription.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            >
              <InfoIcon style={{ marginLeft: "5px", fontSize: "16px" }} />
            </Tooltip>
          </Box>
        );
      },
    },

    {
      field: "avatar",
      headerName: "Hình ảnh",
      width: 100,
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
    // {
    //   field: "status",
    //   headerName: "Trạng Thái",
    //   width: 80,
    //   renderCell: (params) => (
    //     <Box display="flex" alignItems="center" className="filter-box">
    //       <Switch
    //         defaultChecked
    //         color="warning"
    //         checked={params.value === "ACTIVE"}
    //         onChange={() => {
    //           const newStatus =
    //             params.value === "ACTIVE" ? "INACTIVE" : "ACTIVE"; // Toggle the status
    //           // Lấy ID, fullname và status từ dữ liệu cột
    //           const rescueVehicleOwnerId = params.row.id;
    //           const fullname = params.row.fullname;
    //           handleSaveClickStatus(rescueVehicleOwnerId, fullname, newStatus);
    //           // Gọi hàm để gửi yêu cầu cập nhật trạng thái
    //           // Để cập nhật giao diện ngay lập tức, bạn cần áp dụng thay đổi trạng thái lên local state
    //         }}
    //       />
    //     </Box>
    //   ),
    //   key: "status",
    // },
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
        >
          <Typography
            variant="body1"
            sx={{ ml: "1px", color: "indigo", fontWeight: "bold" }}
            onClick={() => handleUpdateClick(params.row.id)}
          >
            Chỉnh Sửa
          </Typography>
        </Box>
      ),
      key: "update",
    },
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header title="Chủ Xe Cứu Hộ" subtitle="Danh sách chủ xe cứu hộ" />
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
              <MenuItem key="status-Unactive" value="Unactive">
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
          rows={filteredRescueVehicleOwnersPagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
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

      <ModalEdit
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedEditRescuseVehicleOwner={selectedEditRescueVehicleOwner}
        accountData={accountData}
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

export default RescueVehicleOwners;
