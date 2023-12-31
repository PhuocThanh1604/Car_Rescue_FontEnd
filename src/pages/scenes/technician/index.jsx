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
import { Edit, FilterList, Search } from "@mui/icons-material";
import ModalEdit from "./ModalEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import moment from "moment";

import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Map from "./google";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import {
  fetchTechnicians,
  getLocationTechnician,
  getTechnicianId,
} from "../../../redux/technicianSlice";
import CustomTablePagination from "../../../components/TablePagination";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../../data.json";
import * as yup from 'yup';
const Technicians = (props) => {
  const dispatch = useDispatch();
  const technicians = useSelector((state) => state.technician.technicians);
  const [showMapModal, setShowMapModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOption, setFilterOption] = useState("Status");
  const [selectedEditTechnician, setSelectedEditTechnician] = useState(null);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [address, setAddress] = useState(""); // Thêm trường address

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [technicianLocation, setTechnicianLocation] = useState(null);
  const [infoTechnician, setInfoTechnician] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
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
  let managerString = "Admin"; 

  try {
    managerString = localStorage.getItem("role_user") || managerString;
  } catch (error) {
      toast.error("Lỗi không nhận được role_user")
  }

  const handleLocationOfTechnician = (technicianId) => {
    console.log(technicianId);
    setShowMapModal(true);
    setIsMapLoaded(true);
    setMapLoading(true);

    const intervalId = setInterval(() => {
      dispatch(getLocationTechnician({ id: technicianId }))
        .then((response) => {
          setMapLoading(false);
          const technicianDetails = response.payload.data;
          if (technicianDetails && technicianDetails.body) {
            var bodyObj = JSON.parse(technicianDetails.body);
            const lat = parseFloat(bodyObj.Lat);
            const lng = parseFloat(bodyObj.Long);

            if (!isNaN(lat) && !isNaN(lng)) {
              setTechnicianLocation({ lat, lng });
              setIsSuccess(true);

              // Check if valid lat and lng before making further API calls
              if (lat !== 0 && lng !== 0) {
                dispatch(getTechnicianId({ id: technicianId }))
                  .then((response) => {
                    // toast.info("Đã tìm thấy vị trí kỹ thuật viên đang muốn xem:");
                    const technicianInfo = response.payload.data;
                    setInfoTechnician(technicianInfo);
                  })
                  .catch((error) => {
                    toast.error("Lỗi khi lấy thông tin kỹ thuật viên:", error);
                  });
              } else {
                clearInterval(intervalId);
                setTechnicianLocation(null);
                setInfoTechnician(null);
                setIsSuccess(false);
                toast.error("Dữ liệu vị trí của kỹ thuật viên không hợp lệ");
              }
            } else {
              // No valid lat and lng, clear the interval and stop further API calls
              clearInterval(intervalId);
              setTechnicianLocation(null);
              setInfoTechnician(null);
              setIsSuccess(false);
              toast.error("Dữ liệu vị trí của kỹ thuật viên không tìm thấy");
            }
          } else {
            // No data, clear the interval and stop further API calls
            clearInterval(intervalId);
            setTechnicianLocation(null);
            setInfoTechnician(null);
            setIsSuccess(false);
            toast.error("Không có dữ liệu trả về từ getLocationTechnician");
          }
        })
        .catch((error) => {
          setMapLoading(false);
          toast.warning(
            "Chưa tìm thấy vị trí kỹ thuật viên đang muốn xem:",
            error
          );
        });
    }, 3000);

    setIntervalId(intervalId);
  };

  useEffect(() => {
    // Clear interval when the component unmounts or modal is closed
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);


  useEffect(() => {
    if (showMapModal) {
      setMapLoading(true);
      setIsMapLoaded(true);
    }
  }, [showMapModal, isMapLoaded]);
  const handleMapLocationSelected = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      if (results && results.length > 0) {
        const firstResult = results[0];
        const latLng = await getLatLng(firstResult);
        const selectedLocation = {
          lat: latLng.lat,
          lng: latLng.lng,
          address: firstResult.formatted_address,
        };
        const latLngDeparture = `lat:${selectedLocation.lat},long:${selectedLocation.lng}`;
        console.log(latLngDeparture);
        setLat(selectedLocation.lat);
        setLng(selectedLocation.lng);
        setAddress(selectedLocation.address);
      } else {
        console.error("No results found for this address.");
      }
    } catch (error) {
      console.error(
        "An error occurred while searching for the location.",
        error
      );
    }
  };

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

      if (!technician.createdAt || !moment(technician.createdAt).isValid()) {
   
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
        const technicianDetails = response.payload.data;
        const accountData = response.payload.data;
        setAccountData(accountData);
        setSelectedEditTechnician(technicianDetails);
        setOpenEditModal(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        toast.error("Lỗi khi lấy thông tin kỹ thuật viên:", error);
      });
  };

  useEffect(() => {
    if (!Array.isArray(technicians)) {
      toast.dismiss("Dữ liệu không hợp lệ để thực hiện lọc.");
      return;
    }
    const filteredTechnicians = technicians
      ? technicians.filter((technician) => {
          const hasFullName =
            technician &&
            technician.fullname && 
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
        const data = response.payload.data;
        if (data) {
          setData(data);
          setFilteredTechnicians(data);

          setLoading(false);
        } else {
          toast.dismiss("không có dữ liệu trả về");
        }
      })
      .catch((error) => {
        toast.dismiss("Lỗi khi lấy dữ liệu kỹ thuật viên:", error);
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

  const filteredTechniciansPagination = filteredTechnicians.slice(
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
      renderCell: (params) => (
        <Box>
          <Box sx={{ fontWeight: "bold" }}>{params.row.fullname}</Box>
          {params.row.account?.email ? (
            <Box sx={{ color: "black" }}>{params.row.account?.email}</Box>
          ) : (
            <Box sx={{ color: "black" }}>Không có Email</Box>
          )}
        </Box>
      ),
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
        if (typeof params.value === "number") {
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
      width: 120,
      renderCell: (params) => {
        const avatarSrc =
          params.value ||
          "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";
        return (
          <img
            src={avatarSrc}
            alt="Hình ảnh"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
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
      headerName: "Cập Nhật",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
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
  if (managerString  === "Manager") {
    columns.push({
      field: "Location",
      headerName: "Vị Trí",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "lightgray",
              borderRadius: "4px",
            },
          }}
        >
          {" "}
          <IconButton
            variant="contained"
            color="indigo"
            onClick={() => handleLocationOfTechnician(params.row.id)}
          >
            <PersonPinCircleIcon sx={{ color: colors.greenAccent[500] }} />
          </IconButton>
        </Box>
      ),
      key: "update",
    });
  }
  
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
          rows={filteredTechniciansPagination}
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

      <Modal
        style={{
          position: "fixed",
          marginTop: "100px",
          marginLeft: "160px",
          maxWidth: "80%",
          maxHeight: "80%",
        }}
        open={showMapModal}
        onClose={() => {
          clearInterval(intervalId);
          setTechnicianLocation(null);
          setInfoTechnician(null);
          setShowMapModal(false);
        }}
        loading={mapLoading}
      >
        <Map
          technicianLocation={technicianLocation}
          infoTechnician={infoTechnician}
          onLocationSelected={handleMapLocationSelected}
          loadingMap={mapLoading}
        />
      </Modal>
    </Box>
  );
};

export default Technicians;
