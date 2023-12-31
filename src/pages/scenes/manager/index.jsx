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
import { fetchManagers, getManagerId, updateStatusManager } from "../../../redux/managerSlice";
import Header from "../../../components/Header";
import CustomTablePagination from "../../../components/TablePagination";
import { tokens } from "../../../theme";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../../data.json";
const Managers = (props) => {
  const dispatch = useDispatch();
  const managers = useSelector((state) => state.manager.managers);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [selectedEditManager, setSelectedEditManager] = useState(null);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [accountData, setAccountData] = useState({});

   const [dataJson, setDataJson] = useState([]);
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      toast.dismiss(dataJson.area[0].name || "Không có ");
    } else {
      toast.dismiss("Không có dữ liệu khư vực!! vui lòng load lại");
    }
    setDataJson(areaData);
  }, [dataJson]);
  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);
  const handleSearchChange = (event) => {
    const value = event.target.value || ""; 
    setSearchText(value);
  };
  const handleDateFilterChange = () => {
    if (startDate && endDate) {
      const filteredmanagers = managers.filter((user) => {
        const orderDate = moment(user.createAt).format("YYYY-MM-DD");
        const isAfterStartDate = moment(orderDate).isSameOrAfter(startDate);
        const isBeforeEndDate = moment(orderDate).isSameOrBefore(endDate);
        return isAfterStartDate && isBeforeEndDate;
      });
      setFilteredManagers(filteredmanagers);
      setFilterOption("Date");
    } else {
      setFilteredManagers(managers);
    }
  };
  const handleFilterChange = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOption(selectedStatusOption);
  
    if (selectedStatusOption === "Status") {
      setFilteredManagers(managers || []); // Bắt lỗi nếu managers không tồn tại
    } else {
      const filteredManagers = managers
        ? managers.filter((manager) => manager.status === selectedStatusOption)
        : [];
      setFilteredManagers(filteredManagers);
    }
  };
  const handleUpdateClick = (managerId) => {
    dispatch(getManagerId({ id: managerId }))
      .then((response) => {
        const managerDetails = response.payload.data; 
        const accountData = response.payload.data;
        console.log(response.payload.data.account);
        setAccountData(accountData);
        setSelectedEditManager(managerDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin quản lí:", error);
      });
  };

  useEffect(() => {
    const filteredManagers = managers
      ? managers.filter((manager) => {
          const nameMatch =
          manager&&
            manager.fullname &&
            manager.fullname.toLowerCase().includes(searchText.toLowerCase());
          const filterMatch =
            filterOption === "Status" ||
            (filterOption === "ACTIVE" && manager.status === "ACTIVE") ||
            (filterOption === "INACTIVE" && manager.status === "INACTIVE");
          return nameMatch && filterMatch;
        })
      : [];
    setFilteredManagers(filteredManagers);
  }, [managers, searchText, filterOption]);
  

  const reloadRescueVehicleOwners = () => {
    dispatch(fetchManagers())
      .then((response) => {
        const data = response.payload.data;
        if (data) {
          setFilteredManagers(data);
          // Đặt loading thành false sau khi tải lại dữ liệu
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải lại danh sách quản lí:", error);
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
      status: newStatus,
    };
    const updateDataJson = JSON.stringify(updateData);
    console.log("dã update" + updateData);
    // Update the status of the matching RescueVehicleOwner and send the update to the server
    dispatch(updateStatusManager({ data: updateDataJson }))
      .then(() => {
        toast.success("Thay đổi trạng thái thành công.");
        reloadRescueVehicleOwners();
        setIsSuccess(true);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi cập nhật quản lí: ${error.response.data.message}`
          );
        } else if (error.message) {
          toast.error(`Lỗi khi cập nhật quản lí: ${error.message}`);
        } else {
          toast.error("Lỗi khi cập nhật quản lí");
        }
      });
  };

  useEffect(() => {
    dispatch(fetchManagers())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setData(data);
          setFilteredManagers(data);
          setLoading(false); 
        }
      })
      .catch(error => {
        setLoading(false);
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

  const filteredmanagersPagination = filteredManagers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "fullname",
      headerName: "Tên quản lí",
      width: 120,
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

    {
      field: "sex",
      headerName: "Gioi Tính",
      width: 60,
      key: "sex",
    },
    { field: "address", headerName: "Địa Chỉ", width: 260, key: "address" },
    {
      field: "createdAt",
      headerName: "Ngày Tạo",
      width: 140,
      key: "createdAt",
      valueGetter: (params) =>
        moment(params.row.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "hours")
          .format("DD-MM-YYYY")
    },
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
      field: "area",
      headerName: "Khu Vực",
      width: 100,
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
      width: 80,
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
            onClick={() => handleUpdateClick(params.row.id)}
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
      <Header title="Quản lí" subtitle="Danh sách quản lí" />

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
          rows={filteredmanagersPagination} 
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />

        <CustomTablePagination
          count={filteredManagers.length}
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
        accountData={accountData}
        selectedEditManager={selectedEditManager}
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

export default Managers;
