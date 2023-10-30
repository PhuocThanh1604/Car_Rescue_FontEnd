import React, { useContext, useState } from "react";
import { Box, IconButton, MenuItem, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
const Topbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  // Lấy đối tượng manager từ localStorage
  const managerString = localStorage.getItem("manager");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  let manager = null;

  if (managerString) {
    try {
      manager = JSON.parse(managerString); // Thử phân tích chuỗi JSON
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    // Gọi hàm logout khi người dùng chọn "Logout"
    logout(); // Bạn cần tự định nghĩa hàm logout để xóa JWT Token và thông tin đăng nhập

    // Chuyển đến trang đăng nhập sau khi đăng xuất
    navigate("/");
  };
  const handleProfile = () => {
    if (isAdmin) {
      // If the user is an admin, navigate to the admin profile page
      navigate("admin/update/profile");
    } else {
      // If the user is a manager, navigate to the manager profile page
      navigate("manager/update/profile");
    }
  };
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleMenuOpen}>
            <PersonOutlinedIcon style={{ fontSize: 30 }} />{" "}
            {/* Đặt kích thước biểu tượng */}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            style={{
              marginTop: "50px",
            }}
          >
            <div
              style={{
                width: "200px",
                height: "100px",
              }}
            >
              {" "}
              <MenuItem>
                <PersonIcon />
                {(manager && `Xin Chào: ${manager.fullname}`) ||
                  (isAdmin ? "Xin Chào Admin" : "")}
              </MenuItem>
              <MenuItem onClick={handleProfile}>
                <FolderSharedIcon /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon /> Logout
              </MenuItem>
            </div>
          </Menu>
        </div>
      </Box>
    </Box>
  );
};

export default Topbar;
