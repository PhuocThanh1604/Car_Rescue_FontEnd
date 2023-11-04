import React, { useContext, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
import BadgeIcon from "@mui/icons-material/Badge";
import SettingsIcon from "@mui/icons-material/Settings";
import { Logout } from "@mui/icons-material";
import { styled, Theme } from "@mui/material/styles";
import PerfectScrollbarComponent from "react-perfect-scrollbar";

const Topbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorElNoti, setAnchorElNoti] = useState(null); // Notifications menu
  const [anchorElProfile, setAnchorElProfile] = useState(null); // Profile menu
  const [notifications, setNotifications] = useState([]);

  const MAX_NOTIFICATIONS_DISPLAYED = 5;

  const handleMenuOpenNoti = (event) => {
    // Only display a limited number of notifications initially
    const initialNotifications = notifications.slice(
      0,
      MAX_NOTIFICATIONS_DISPLAYED
    );
    setAnchorElNoti(event.currentTarget);
    setNotifications(initialNotifications);
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
  // Define the 'styles' object at the top
  const styles = {
    py: 2,
    px: 4,
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "text.primary",
    textDecoration: "none",
    "& svg": {
      fontSize: "1.375rem",
      color: "text.secondary",
    },
  };

  const handleMenuOpenProfile = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElNoti(null);
    setAnchorElProfile(null);
  };
  // ** Styled PerfectScrollbar component
  const PerfectScrollbar = styled(PerfectScrollbarComponent)({
    ...styles,
  });
  // ** Styled component for the title in MenuItems
  const MenuItemTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    flex: "1 1 100%",
    overflow: "hidden",
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginBottom: theme.spacing(0.75),
  }));

  const MenuItemSubtitle = styled(Typography)({
    flex: "1 1 100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  });

  const handleViewAllNotifications = () => {
    setNotifications([...notifications]);
  };

  const ScrollWrapper = ({ children }) =>
    useMediaQuery("(max-width: 1280px)") ? (
      <Box sx={{ overflowY: "auto", overflowX: "hidden" }}>{children}</Box>
    ) : (
      <PerfectScrollbarComponent
        options={{ wheelPropagation: false, suppressScrollX: true }}
      >
        {children}
      </PerfectScrollbarComponent>
    );

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

  const BadgeContentSpan = styled("span")(({ theme }) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }));

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
        <IconButton onClick={handleMenuOpenNoti}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElNoti}
          open={anchorElNoti}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem disableRipple>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
              <Chip
                size="small"
                label="New"
                color="primary"
                sx={{
                  height: 20,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  borderRadius: "10px",
                }}
              />
            </Box>
          </MenuItem>
          <ScrollWrapper>
            <MenuItem onClick={handleMenuClose}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt="Flora"
                  src="https://png.pngtree.com/png-clipart/20230524/original/pngtree-congratulations-with-clap-icon-png-image_9168959.png"
                />
                <Box
                  sx={{
                    mx: 4,
                    flex: "1 1",
                    display: "flex",
                    overflow: "hidden",
                    flexDirection: "column",
                  }}
                >
                  <MenuItemTitle>Congratulation Flora! 🎉</MenuItemTitle>
                  <MenuItemSubtitle variant="body2">
                    Won the monthly best seller badge
                  </MenuItemSubtitle>
                </Box>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  Today
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Box
                sx={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <img
                  width={38}
                  height={38}
                  alt="paypal"
                  src="https://storelinhtinh.com/wp-content/uploads/2022/03/kisspng-paypal-logo-brand-font-payment-paypal-logo-icon-paypal-icon-logo-png-and-vecto-5b7f273e45e8a9.9067728615350597742864.png"
                />
                <Box
                  sx={{
                    mx: 4,
                    flex: "1 1",
                    display: "flex",
                    overflow: "hidden",
                    flexDirection: "column",
                  }}
                >
                  <MenuItemTitle>Paypal</MenuItemTitle>
                  <MenuItemSubtitle variant="body2">
                    Received Payment
                  </MenuItemSubtitle>
                </Box>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  25 May
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Box
                sx={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <Avatar
                  alt="order"
                  src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7912768/avatar-icon-md.png"
                />
                <Box
                  sx={{
                    mx: 4,
                    flex: "1 1",
                    display: "flex",
                    overflow: "hidden",
                    flexDirection: "column",
                  }}
                >
                  <MenuItemTitle>Revised Order 📦</MenuItemTitle>
                  <MenuItemSubtitle variant="body2">
                    New order revised from john
                  </MenuItemSubtitle>
                </Box>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  19 Mar
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Box
                sx={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <img
                  width={38}
                  height={38}
                  alt="chart"
                  src="https://cdn-icons-png.flaticon.com/512/4541/4541461.png"
                />
                <Box
                  sx={{
                    mx: 4,
                    flex: "1 1",
                    display: "flex",
                    overflow: "hidden",
                    flexDirection: "column",
                  }}
                >
                  <MenuItemTitle>
                    Finance report has been generated
                  </MenuItemTitle>
                  <MenuItemSubtitle variant="body2">
                    25 hrs ago
                  </MenuItemSubtitle>
                </Box>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  27 Dec
                </Typography>
              </Box>
            </MenuItem>
          </ScrollWrapper>

          <MenuItem
            disableRipple
            sx={{
              borderBottom: 0,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={handleMenuClose}
              sx={{
                backgroundColor: "green", // Set the background color to green
              }}
            >
              Read All Notifications
            </Button>
          </MenuItem>
        </Menu>

        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleMenuOpenProfile}>
            <PersonOutlinedIcon style={{ fontSize: 30 }} />
            {/* Đặt kích thước biểu tượng */}
          </IconButton>

          <Menu
            anchorEl={anchorElProfile}
            open={Boolean(anchorElProfile)}
            onClose={handleMenuClose}
            sx={{ "& .MuiMenu-paper": { width: 230, marginTop: 2 } }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ pt: 0, pb: 1, px: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Badge
                  overlap="circular"
                  badgeContent={<BadgeContentSpan />}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Avatar
                    alt="John Doe"
                    src={
                      manager && manager.avatar
                        ? manager.avatar
                        : "https://c1.klipartz.com/pngpicture/823/765/sticker-png-login-icon-system-administrator-user-user-profile-icon-design-avatar-face-head.png"
                    }
                    sx={{ width: "2.5rem", height: "2.5rem" }}
                  />
                </Badge>
                <Box
                  sx={{
                    display: "flex",
                    marginLeft: 3,
                    alignItems: "flex-start",
                    flexDirection: "column",
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    {" "}
                    {(manager && `Xin Chào: ${manager.fullname}`) ||
                      (isAdmin && `Xin Chào: Admin`)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.8rem", color: "text.disabled" }}
                  >
                    {isAdmin ? "Admin" : "Manager"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            <MenuItem sx={{ p: 0 }} onClick={() => handleProfile()}>
              <Box sx={styles}>
                <BadgeIcon sx={{ marginRight: 2 }} />
                Profile
              </Box>
            </MenuItem>

            <Divider />
            <MenuItem sx={{ p: 0 }} onClick={() => handleMenuClose()}>
              <Box sx={styles}>
                <SettingsIcon sx={{ marginRight: 2 }} />
                Settings
              </Box>
            </MenuItem>
            <Divider />

            <MenuItem sx={{ p: 0 }} onClick={() => handleLogout()}>
              <Box sx={styles}>
                <LogoutIcon sx={{ marginRight: 2 }} />
                Logout
              </Box>
            </MenuItem>
          </Menu>
        </div>
      </Box>
    </Box>
  );
};

export default Topbar;
