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
import { tokens } from "../../../../theme";

import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../features/auth/authSlice";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  Item.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    setSelected: PropTypes.func.isRequired,
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

  useEffect(() => {
    if (user && user.role) {
      setUserRole(user.role);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, [user, storedRole]);
  let admin = null;
  const adminString = localStorage.getItem("isAdmin");
  if (adminString) {
    try {
      admin = JSON.parse(adminString); // Thử phân tích chuỗi JSON
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }
  const sidebarStyles = {
    position: "relative",
    top: 0,
    bottom: 0,
    height: "800px",
  };
  const BadgeContentSpan = styled("span")(({ theme }) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }));
  return (
    <Box
      sx={{
        ...sidebarStyles, // Apply the sidebar styles
        display: "flex",
        height: userRole === "admin" ? "100%" : "auto",

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
                ml="44px"
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
                      admin && admin.avatar
                        ? admin.avatar
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
    
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Dữ liệu
            </Typography>
            <Item
              title="Khách Hàng"
              to="/Client"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Tài Khoản"
              to="admin/account"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Chủ Xe Cứu Hộ"
              to="admin/rescueVehicleOwner"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Kỹ Thuật Viên"
              to="admin/techinian"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Item
              title="Quản Lí"
              to="admin/manager"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{" "}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "30px 0 10px 30px" }}
            >
              Pages
            </Typography>
      
            <Item
              title="Tạo Chủ Xe Cứu Hộ"
              to="admin/add/carVihecileOwner"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tạo Kỹ Thuật"
              to="admin/add/technician"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tạo Quản Lí"
              to="admin/add/manager"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Tạo Khách Hàng"
              to="admin/add/customer"
              icon={<PersonOutlinedIcon />}
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
