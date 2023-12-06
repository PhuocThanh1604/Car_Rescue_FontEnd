import React, { useEffect } from "react";
import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReorderIcon from '@mui/icons-material/Reorder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PropTypes from "prop-types";
import CategoryIcon from "@mui/icons-material/Category";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import ListIcon from "@mui/icons-material/List";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ElectricRickshawIcon from "@mui/icons-material/ElectricRickshaw";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DvrIcon from "@mui/icons-material/Dvr";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LoopIcon from "@mui/icons-material/Loop";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useParams } from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';
const Item = ({ title, to, icon, selected, setSelected, subItems }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  Item.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    setSelected: PropTypes.func.isRequired,
    subItems: PropTypes.array,
  };
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        backgroundColor: selected === title ? colors.blue[100] : "transparent",
        borderRadius: "20px",
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
      {subItems && subItems.length > 0 && (
        <Menu>
          {subItems.map((subItem, index) => (
            <Item
              key={index}
              title={subItem.title}
              to={subItem.to}
              icon={subItem.icon}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </Menu>
      )}
    </MenuItem>
  );
};

const Sidebar = ({ selectedWalletId, selectedItemId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("dashboard");
  const user = useSelector(selectCurrentUser);
  const storedRole = localStorage.getItem("role_user");
  const [userRole, setUserRole] = useState(storedRole || "");
  const [shouldShowItem, setShouldShowItem] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [showSubItems, setShowSubItems] = useState(false);
  const [showSubItemsTransaction, setShowSubItemsTransaction] = useState(false);
  const [showSubItemsReport, setShowSubItemsReport] = useState(false);
  const [showSubItemsRescue, setShowSubItemsRescue] = useState(false);
  const [showSubItemsSchedule, setShowSubItemsSchedule] = useState(false);

  useEffect(() => {
    if (user && user.role) {
      setUserRole(user.role);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, [user, storedRole]);
  let manager = null;
  const managerString = localStorage.getItem("manager");
  if (managerString) {
    try {
      manager = JSON.parse(managerString); // Thử phân tích chuỗi JSON
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOrderClick = () => {
    // Toggle the visibility of sub-items
    setShowSubItems(!showSubItems);
  };

  const handleTransactionClick = () => {
    // Toggle the visibility of sub-items
    setShowSubItemsTransaction(!showSubItemsTransaction);
  };
  const handleReportClick = () => {
    // Toggle the visibility of sub-items
    setShowSubItemsReport(!showSubItemsReport);
  };
  const handleRescuseClick = () => {
    // Toggle the visibility of sub-items
    setShowSubItemsRescue(!showSubItemsRescue);
  };
  const handleScheduleClick = () => {
    // Toggle the visibility of sub-items
    setShowSubItemsSchedule(!showSubItemsSchedule);
  };
  const BadgeContentSpan = styled("span")(({ theme }) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }));
  const sidebarStyles = {
    // position: "fixed",
    top: 0,
    bottom: 0,
    height: "100vh", // Các thuộc tính CSS khác
  };

  return (
    <Box
      sx={{
        ...sidebarStyles, // Apply the sidebar styles
        display: "flex",
        height: isSmallScreen
          ? "100vh"
          : userRole === "manager"
          ? "100%"
          : "auto",

        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",

        "& .pro-sidebar-inner": {
          background: `${colors.white[50]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <img
                  alt="profile-user"
                  width="80px"
                  height="80px"
                  src={`../../assets/logo-color.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box
              mb="5px"
              textAlign="center"
              marginLeft="30px"
              padding="10px"
              borderRadius="20px"
              sx={{
                backgroundColor: colors.orange[50],
                transition: "margin-left 0.3s ease-in-out", // Thêm transition cho marginLeft
                overflow: "hidden", // Tránh việc nội dung bị che mất khi collapse
                opacity: isCollapsed ? 0 : 1, // Ẩn hiện nội dung dựa trên isCollapsed
                width: isCollapsed ? "0" : "auto", // Thu gọn/kéo rộng theo isCollapsed
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Badge
                  overlap="circular"
                  badgeContent={<BadgeContentSpan />}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  sx={{ padding: "1px" }}
                >
                  <Avatar
                    alt="Manager"
                    src={
                      manager && manager.avatar
                        ? manager.avatar
                        : "https://c1.klipartz.com/pngpicture/823/765/sticker-png-login-icon-system-administrator-user-user-profile-icon-design-avatar-face-head.png"
                    }
                    sx={{ width: "2.5rem", height: "2.5rem" }}
                  />
                </Badge>
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ ml: "12px" }}
                >
                  {userRole && `Chào: ${userRole}`}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Trang Chủ"
              to="/client"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Hệ Thống
            </Typography>
            <MenuItem
              onClick={handleOrderClick}
              icon={<ReorderIcon />}
              style={{
                color: colors.grey[100],
              }}
            >
              <Typography>Đơn Hàng</Typography>
              <Link to="#" />
            </MenuItem>
            {showSubItems && (
              <div style={{ marginLeft: "20px" }}>
                <Item
                  title="Đơn Hàng Mới"
                  to="manager/orders"
                  icon={<PlaylistAddIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Đang Điều Phối"
                  to="manager/ordersAssigning"
                  icon={<LoopIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Đã Được Điều Phối"
                  to="manager/ordersAssigned"
                  icon={<AssignmentTurnedInIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Đang Thực Hiện"
                  to="manager/ordersInprogress"
                  icon={<HourglassTopIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Đã Hoàn Thành"
                  to="manager/ordersCompleted"
                  icon={<TaskAltIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Đã Bị Hủy"
                  to="manager/ordersCancelled"
                  icon={<CancelIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* Add more sub-items as needed */}
              </div>
            )}
           
            <MenuItem
              onClick={handleTransactionClick}
              icon={<ListAltIcon />}
              style={{
                color: colors.grey[100],
                // Add a conditional class to indicate if this item is selected
                backgroundColor:
                  selectedItemId === "yourItemId"
                    ? "selectedColor"
                    : "defaultColor",
              }}
            >
              <Typography>Các Loại Giao Dịch</Typography>
              <Link to="#" />
            </MenuItem>
            {showSubItemsTransaction && (
              <div style={{ marginLeft: "20px" }}>
                <Item
                  title="Thanh Toán"
                  to="manager/payments"
                  icon={<ListIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />{" "}
                <Item
                  title="Đối Tác Rút Ví"
                  to="manager/invoices"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Chi Tiết Rút Ví"
                  to={`/manager/invoices/${selectedWalletId}`}
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />{" "}
              </div>
            )}
            <MenuItem
              onClick={handleReportClick}
              icon={<AssessmentIcon />}
              style={{
                color: colors.grey[100],
                // Add a conditional class to indicate if this item is selected
                backgroundColor:
                  selectedItemId === "yourItemId"
                    ? "selectedColor"
                    : "defaultColor",
              }}
            >
              <Typography>Các Loại Báo Cáo</Typography>
              <Link to="#" />
            </MenuItem>
            {showSubItemsReport && (
              <div style={{ marginLeft: "20px" }}>
                <Item
                  title="Đơn Báo Cáo"
                  to="manager/reports"
                  icon={<ListIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Danh Sách Báo Cáo"
                  to="manager/listReport"
                  icon={<ListIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            )}
            <Item
              title="Kỹ Thuật Viên "
              to="manager/techinian"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <MenuItem
              onClick={handleScheduleClick}
              icon={<CalendarTodayOutlinedIcon />}
              style={{
                color: colors.grey[100],
              }}
            >
              <Typography>Lịch</Typography>
              <Link to="#" />
            </MenuItem>
            {showSubItemsSchedule && (
              <div style={{ marginLeft: "20px" }}>
                <Item
                  title="Lịch Kỹ Thuật Viên"
                  to="manager/calendarTechnicians"
                  icon={<PermContactCalendarIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            )}
             <Item
              title="Dịch Vụ"
              to="manager/service"
              icon={<ReceiptLongIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Danh Sách Mẫu Xe"
              to="manager/modelCar"
              icon={<ListIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
               <Item
              title="Danh Sách Hiện Tượng"
              to="manager/symptom"
              icon={<ListIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Đối Tác
            </Typography>
            <MenuItem
              onClick={handleRescuseClick}
              icon={<DvrIcon />}
              style={{
                color: colors.grey[100],
              }}
            >
              <Typography>Cứu Hộ</Typography>
              <Link to="#" />
            </MenuItem>
            {showSubItemsRescue && (
              <div style={{ marginLeft: "20px" }}>
                <Item
                  title="Đơn Xe Cứu Hộ"
                  to="manager/vehicles"
                  icon={<ElectricRickshawIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                     <Item
                  title="Danh Sách Xe Cứu Hộ"
                  to="manager/listVehicle"
                  icon={<ElectricRickshawIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Chủ Xe Cứu Hộ"
                  to="manager/rescueVehicleOwner"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />{" "}
                <Item
                  title="Lịch Xe Cứu Hộ"
                  to="manager/calendarRescueVehicleOwners"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            )}
            {shouldShowItem && (
              <Item
                title="Cập Nhật Thông Tin"
                to="manager/update/profile"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Khách Hàng
            </Typography>
            <Item
              title="Khách Hàng"
              to="manager/customer"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
             <Item
              title="Google Map"
              to="manager/googlemap"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
 
            {/* <Item
              title="Tạo Đơn Hàng Offline"
              to="manager/add/orderOffline"
              icon={<AddToQueueIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="Tạo Mới Khách Hàng"
              to="manager/add/customer"
              icon={<PersonAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tạo Dịch Vụ"
              to="manager/add/service"
              icon={<BookmarkAddIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="Tạo Chủ Xe Mới"
              to="manager/add/carVihecileOwner"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="Tạo Mẫu Xe"
              to="manager/add/modelCar"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              title="Google Map"
              to="manager/googlemap"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Câu hỏi thường gặp"
              to="manager/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
