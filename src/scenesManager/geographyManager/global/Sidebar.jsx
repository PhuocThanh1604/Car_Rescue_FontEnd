import React, { useEffect } from "react";
import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PropTypes from "prop-types";
import CategoryIcon from "@mui/icons-material/Category";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import ListIcon from "@mui/icons-material/List";
import { display } from "@mui/system";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DvrIcon from '@mui/icons-material/Dvr';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LoopIcon from '@mui/icons-material/Loop';
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

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("dashboard");
  const user = useSelector(selectCurrentUser);
  const storedRole = localStorage.getItem("role_user");
  const [userRole, setUserRole] = useState(storedRole || "");
  const [shouldShowItem, setShouldShowItem] = useState(false);

  useEffect(() => {
    if (user && user.role) {
      setUserRole(user.role);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, [user, storedRole]);

  const [showSubItems, setShowSubItems] = useState(false);
  const [showSubItemsRescue, setShowSubItemsRescue] = useState(false);
  const handleOrderClick = () => {
    // Toggle the visibility of sub-items
    setShowSubItems(!showSubItems);
  };
  const handleRescuseClick = () => {
    // Toggle the visibility of sub-items
    setShowSubItemsRescue(!showSubItemsRescue);
  };

  const sidebarStyles = {
    // Set the position to fixed
    bottom: 0, // Stick it to the bottom of the screen
    top: "10px", // Make sure it doesn't overlap the content
    height: "100%", // Adjust the height to fit the content
  };
  return (
    <Box
      sx={{
        ...sidebarStyles, // Apply the sidebar styles
        display: "flex",
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
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
                <Typography variant="h3" color={colors.grey[100]}>
                  DashBoard
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="200px"
                  height="130px"
                  src={`../../assets/logo-no-background.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userRole && `Chào: ${userRole}`}
                </Typography>
                <Typography variant="h2" color={colors.greenAccent[500]}>
                  Car Rescue
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
              Dữ Liệu
            </Typography>
            <MenuItem
              onClick={handleOrderClick}
              icon={<ReceiptOutlinedIcon />}
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
                  title="Đang Thực Hiện"
                  to="manager/books"
                  icon={<HourglassTopIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                   <Item
                  title="Đang Điều Phối"
                  to="manager/books"
                  icon={<LoopIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                  <Item
                  title="Đã Điều Phối"
                  to="manager/books"
                  icon={<AssignmentTurnedInIcon />}
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
                  to="manager/books"
                  icon={<CancelIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* Add more sub-items as needed */}
              </div>
            )}
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
                  title="Xe Cứu Hộ"
                  to="manager/vehicles"
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
                {/* Add more sub-items as needed */}
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
            <Item
              title="Kỹ Thuận Viên "
              to="manager/techinian"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Khách Hàng"
              to="manager/customer"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Dịch Vụ"
              to="manager/service"
              icon={<ListIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Contacts Info"
              to="manager/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Transacions"
              to="manager/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="manager/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="New Service"
              to="manager/add/service"
              icon={<BookmarkAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="New CarVihecileOwner"
              to="manager/add/carVihecileOwner"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="New Customer"
              to="manager/add/customer"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="New Book"
              to="manager/addBook"
              icon={<BookmarkAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="New Genres"
              to="manager/addGenres"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Lịch Kỹ Thuật Viên"
              to="manager/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Lịch Xe Cứu Hộ"
              to="manager/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Google Map"
              to="manager/googlemap"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="manager/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
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
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
