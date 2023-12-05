import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  Typography,

} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import {
  fetchVehicle, fetchVehicleStatus,
} from "../../redux/vehicleSlice";
import CustomTablePagination from "../../components/TablePagination";
import { tokens } from "../../theme";
import { getAccountId } from "../../redux/accountSlice";
const Vehicles = () => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Type");
  const [filterOptionStatus, setFilterOptionStatus] = useState("ACTIVE");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [initialFormState, setInitialFormState] = useState({});
  const [editStatus, setEditStatus] = useState({});
  const [detailedData, setDetailedData] = useState(null);

  const [accountId, setAccountId] = useState("");
  const [accountDeviceToken, setAccountDeviceToken] = useState("");
  useEffect(() => {
    if (accountId && !accountDeviceToken) {
      fetchAccounts(accountId);
    }
  }, [accountId, accountDeviceToken]);
  const fetchAccounts = (accountId) => {
    console.log(accountId);
    // Make sure you have a check to prevent unnecessary API calls
    if (accountId) {
      //lấy devices của account
      console.log("RovId off Account " + accountId);
      dispatch(getAccountId({ id: accountId }))
        .then((response) => {
          const dataAccount = response.payload.data;
          console.log("DeviceToken of Account " + dataAccount.deviceToken);
          if (dataAccount.deviceToken) {
            console.log(dataAccount.deviceToken);
            setAccountDeviceToken(dataAccount.deviceToken);
          } else {
            console.error("deviceToken not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching service data detail:", error);
        });
    }
  };

  const reloadVehicle = () => {
    dispatch(fetchVehicle())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setFilteredVehicles(data);
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

    if (selectedStatusOption === "type") {
      // Hiển thị tất cả các trạng thái
      setFilteredVehicles(vehicles); // Sử dụng dữ liệu gốc khi không lọc
    } else {
      // Lọc dữ liệu gốc dựa trên giá trị trạng thái
      const filteredVehicles = vehicles.filter(
        (vehicle) => vehicle.type === selectedStatusOption
      );
      setFilteredVehicles(filteredVehicles);
    }
  };
  const handleFilterChangeStatus = (event) => {
    const selectedStatusOption = event.target.value;
    setFilterOptionStatus(selectedStatusOption);
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      // Xử lý khi technicians không tồn tại hoặc không có dữ liệu
      toast.error("Không có dữ liệu technicians.");
      return;
    }

    if (selectedStatusOption === "Status") {
      // Hiển thị tất cả các trạng thái
      setFilteredVehicles(vehicles);
    } else {
      // Lọc sản phẩm dựa trên giá trị trạng thái
      const filteredtechnicians = vehicles.filter(
        (technician) => technician.status === selectedStatusOption
      );
      setFilteredVehicles(filteredtechnicians);
    }
  };
  useEffect(() => {
    if (Array.isArray(vehicles)) {
      const vehicleId = vehicles.id; // Xem xét lại điều này, có vẻ như vehicles.id không đúng
      const vehicleToEdit = vehicles.find(
        (vehicle) => vehicle.id === vehicleId
      );

      if (vehicleToEdit) {
        setEditStatus(vehicleToEdit);
        setInitialFormState(vehicleToEdit);
      }
    }
  }, [vehicles]);

  // Thay đổi hàm useEffect để lọc từ dữ liệu gốc
  useEffect(() => {
    if (Array.isArray(vehicles)) {
      const filteredVehicles = vehicles.filter((vehicle) => {
        const nameMatch =vehicle&&
          vehicle.manufacturer &&
          vehicle.manufacturer.toLowerCase().includes(searchText.toLowerCase());
        const filterMatch =
          filterOption === "Type" ||
          (filterOption === "Xe cẩu" && vehicle.type === "Xe cẩu") ||
          (filterOption === "Xe chở" && vehicle.type === "Xe chở") ||
          (filterOption === "Xe kéo" && vehicle.type === "Xe kéo");
        return nameMatch && filterMatch;
      });
      setFilteredVehicles(filteredVehicles);
    } else {
      setFilteredVehicles([]);
    }
  }, [vehicles, searchText, filterOption]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchVehicleStatus())
      .then((response) => {
        // Kiểm tra nếu response.payload tồn tại và có thuộc tính 'data'
        if (!response.payload || !response.payload.data) {
          setLoading(false);
          return; 
        }
  
        const data = response.payload.data;
    
        setData(data);
        setFilteredVehicles(data);
        setDetailedData(data);
        setLoading(false); 
      })
      .catch((error) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false); // Đặt trạng thái loading thành false
      });
  }, [dispatch]);
  
  
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVehiclePagination = filteredVehicles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    {
      field: "vinNumber",
      headerName: "vinNumber",
      width: 100,
      key: "vinNumber",
    },
    {
      field: "licensePlate",
      headerName: "licensePlate",
      width: 100,
      key: "licensePlate",
    },

    { field: "type", headerName: "Loại Xe", width: 140, key: "type" },
    {
      field: "manufacturer",
      headerName: "Hiệu xe  ",
      width: 100,
      key: "manufacturer",
    },
    {
      field: "manufacturingYear",
      headerName: "Năm sản xuất",
      width: 120,
      key: "manufacturingYear",
    },
    {
      field: "image",
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
  ];

  return (
    <Box ml="50px" mr="50px" mb="auto">
      <Header
        title="Danh Sách Xe Cứu Hộ"
        subtitle="Danh sách xe cứu hộ trong hệ thống"
      />
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
            placeholder="Tìm kiếm hiệu xe"
            onChange={handleSearchChange}
            className="search-input"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <ToastContainer />
        <Box display="flex" alignItems="center" className="filter-box" marginRight={1}>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOption}
              onChange={handleFilterChange}
              variant="outlined"
              className="filter-select"
            >
              <MenuItem key="type-all" value="Type">
                Loại Xe
              </MenuItem>
              <MenuItem key="type-towing" value="Xe kéo">
                Xe Kéo
              </MenuItem>
              <MenuItem key="type-truck" value="Xe chở">
                Xe Chở
              </MenuItem>
              <MenuItem key="type-crane" value="Xe cẩu">
                Xe Cẩu
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center" className="filter-box">
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOptionStatus}
              onChange={handleFilterChangeStatus}
              variant="outlined"
              className="filter-select"
            >
          
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
          rows={filteredVehiclePagination} // Thêm id nếu không có
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          checkboxSelection
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />

        <CustomTablePagination
          count={filteredVehicles.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
        />
      </Box>

  
 
    </Box>
  );
};

export default Vehicles;
