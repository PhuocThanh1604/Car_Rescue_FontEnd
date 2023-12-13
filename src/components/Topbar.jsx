import React, { useContext, useEffect, useState } from "react";
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
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import BadgeIcon from "@mui/icons-material/Badge";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled, Theme } from "@mui/material/styles";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css'; 
import { toast } from "react-toastify";
import { onMessageListener } from "../firebase";
import { useDispatch } from "react-redux";
import { getAllNotification } from "../redux/orderSlice";

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [dataNotification, setDataNotification] = useState([]);
  const [anchorElNoti, setAnchorElNoti] = useState(null); // Notifications menu
  const [anchorElProfile, setAnchorElProfile] = useState(null); // Profile menu
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const MAX_NOTIFICATIONS_DISPLAYED = 5;
  useEffect(() => {
    const handleMessage = (payload) => {
      toast(
        `Title: ${payload.notification.title}, Body: ${payload.notification.body}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      // Lấy thời gian hiện tại
      const now = new Date();

      // Cập nhật trạng thái thông báo
      setDataNotification((prevNotifications) => {
        const updatedNotifications = [
          {
            title: payload.notification.tile,
            body: payload.notification.content,
            image: payload.notification.image,
            receivedTime: now.toISOString(),
          },
          ...prevNotifications, // Thêm thông báo mới vào đầu mảng
        ];

        // Giới hạn số lượng thông báo hiển thị
        const limitedNotifications = updatedNotifications.slice(
          0,
          MAX_NOTIFICATIONS_DISPLAYED
        );

        return limitedNotifications;
      });

      setUnreadNotifications((prevUnreadCount) => prevUnreadCount + 1);
    };

    onMessageListener(handleMessage);
  }, []);
  // Lấy đối tượng manager từ localStorage
  const managerString = localStorage.getItem("manager");
const isAdmin = localStorage.getItem("isAdmin") === "true";
let manager = null;

if (managerString) {
  try {
    manager = JSON.parse(managerString);
  } catch (error) {
    toast.dismiss("Không có thông báo:", error);
  }
}
let admin = null;
if (isAdmin) {
  try {
    admin = JSON.parse(isAdmin);
  } catch (error) {
    toast.dismiss("Không có thông báo:", error);
  }
}


useEffect(() => {
  if (manager && manager.accountId !== accountId) {
    setLoading(true);
    setAccountId(manager.accountId); // Di chuyển setAccountId vào đây
  }
}, [manager, accountId]);

useEffect(() => {
  if (accountId !== null) {
    setLoading(true);
    dispatch(getAllNotification({ id:accountId })) // Gửi accountId trong payload
      .then((response) => {
        if (!response.payload) {
          setLoading(false);
          return; // Kết thúc sớm hàm useEffect() nếu không có dữ liệu
        }
        console.log(response.payload);
        setDataNotification(response.payload);
      })
      .catch((error) => {
        setLoading(false);
        // Xử lý lỗi nếu cần
      })
      .finally(() => {
        setLoading(false);
      });
  }
}, [dispatch, accountId]);
  
  const handleMenuOpenNoti = (event) => {
    const savedNotifications = localStorage.getItem("notifications");
    const unreadNotificationsCount = localStorage.getItem(
      "unreadNotificationsCount"
    );
    const parsedNotifications = savedNotifications
      ? JSON.parse(savedNotifications)
      : [];
    const initialNotifications = parsedNotifications.slice(
      0,
      MAX_NOTIFICATIONS_DISPLAYED
    );

    setUnreadNotifications(unreadNotificationsCount);
    setAnchorElNoti(event.currentTarget);
    setNotifications(initialNotifications);
  };



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
  const handleMenuOpenProfileClose = (event) => {
    setAnchorElProfile(null);
  };

  const handleMenuClose = () => {
    setAnchorElNoti(null);
  };
  const handleDropdownClose = () => {
    setAnchorElNoti(null);
  };
  // ** Styled PerfectScrollbar component
 
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
      <PerfectScrollbar
        options={{ wheelPropagation: true, suppressScrollX: true }}
      >
        {children}
      </PerfectScrollbar>
    );

  const handleLogout = () => {
    localStorage.clear();
    logout();

    navigate("/");
  };
  const handleProfile = () => {
    if (isAdmin) {
      navigate("admin/update/profile");
    } else {
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
      <Box
        display="flex"
        backgroundColor={colors.white[50]}
        borderRadius="10px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton> */}

        <IconButton
          color="inherit"
          aria-haspopup="true"
          aria-controls="customized-menu"
          onClick={handleMenuOpenNoti}
        >
          <Badge
            badgeContent={unreadNotifications}
            color="error"
            invisible={false}
          >
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorElNoti}
          open={Boolean(anchorElNoti)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {/* <MenuItem disableRipple sx={{textAlign:"center"}}>Notifications</MenuItem> */}

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
                label={"New " + dataNotification.length}
                color="primary"
                sx={{
                  height: 20,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  borderRadius: "10px",
                  backgroundColor: colors.amber[500],
                }}
              />
            </Box>
          </MenuItem>

          <ScrollWrapper>
            {dataNotification.map((notification, index) => (
              <Box
                sx={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <MenuItem
                  key={index}
                  onClick={handleMenuClose}
                  sx={{ borderRadius: "10px" }} // Thêm borderRadius ở đây}}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <Avatar alt={notification.title} src={notification.image} />
                    <Box
                      sx={{
                        mx: 4,
                        flex: "1 1",
                        display: "flex",
                        overflow: "hidden",
                        flexDirection: "column",
                      }}
                    >
                      <MenuItemTitle> {notification.tilte}</MenuItemTitle>
                      <MenuItemSubtitle
                        variant="body2"
                        sx={{
                          wordWrap: "break-word", // Cho phép xuống dòng
                          whiteSpace: "normal", // Đảm bảo nội dung xuống dòng
                          width: "150px", // Cố định kích thước tối đa của nội dung
                        }}
                      >
                        {notification.content}
                      </MenuItemSubtitle>
                    </Box>
                    
                  </Box>
                  
                </MenuItem>
                <Typography
                      variant="caption"
                      sx={{ color: "text.disabled" }}
                      right={0}
                    >
                   
                      {new Date(notification.createdAt).toLocaleDateString()}{" "}
                    </Typography>
              </Box>
            ))}
          </ScrollWrapper>
          <MenuItem
            disableRipple
            sx={{
              py: 3.5,
              borderBottom: 0,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={handleDropdownClose}
              sx={{ background: colors.greenAccent[500] }}
            >
              Read All Notifications
            </Button>
          </MenuItem>
        </Menu>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleMenuOpenProfile}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Badge
                overlap="circular"
                badgeContent={<BadgeContentSpan />}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
            </Box>
          </IconButton>

          <Menu
            anchorEl={anchorElProfile}
            open={Boolean(anchorElProfile)}
            onClick={handleMenuOpenProfileClose}
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
                    {admin ? "Admin" : "" || manager ?"Manager":""  }
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
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
