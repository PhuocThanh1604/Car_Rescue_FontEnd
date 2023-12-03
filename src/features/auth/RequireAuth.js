import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";
import jwt_decode from "jwt-decode";
import ManagerContent from "./Manager";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { onMessageListener } from "../../firebase";
import Topbar from "../../components/Topbar";
const RequireAuth = () => {
  const MAX_NOTIFICATIONS_DISPLAYED = 5;
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const saveNotificationToLocalStorage = (payload) => {
    const now = new Date();
  
    const notification = {
      title: payload.notification.title,
      body: payload.notification.body,
      image: payload.notification.image,
      receivedTime: now.toISOString(),
    };
  
    // Lấy danh sách thông báo từ localStorage nếu có
    const notificationsFromLocalStorage = localStorage.getItem("notifications");
    const notifications = notificationsFromLocalStorage
      ? JSON.parse(notificationsFromLocalStorage)
      : [];
  
    // Thêm thông báo mới vào đầu danh sách
    notifications.unshift(notification);
  
    // Giới hạn số lượng thông báo
    const limitedNotifications = notifications.slice(
      0,
      MAX_NOTIFICATIONS_DISPLAYED
    );
  
    // Tăng số lượng thông báo chưa đọc lên 1
    setUnreadNotifications((prevUnreadCount) => prevUnreadCount + 1);
  };
  
  useEffect(() => {
    localStorage.setItem(
      "unreadNotificationsCount",
      unreadNotifications.toString()
    );
  }, [unreadNotifications]);
  
  
  

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
      saveNotificationToLocalStorage(payload);
      return {
        unreadNotifications,
        setUnreadNotifications,
        saveNotificationToLocalStorage,
      };
    };

    onMessageListener(handleMessage);
  }, []);

  // Sử dụng useSelector để truy cập giá trị token từ Redux store
  const data = useSelector(selectCurrentUser);
  if (data) {
    localStorage.setItem("refesh_token", data?.refreshToken);
    localStorage.setItem("role_user", data?.role);
    localStorage.setItem("access_token", data?.accessToken);
    localStorage.setItem("manager", data?.manager);
  }

  if (data && data.manager) {
    localStorage.setItem("manager", JSON.stringify(data.manager));
  }
  // Lấy đối tượng manager từ localStorage
  const managerString = localStorage.getItem("manager");
  let manager = null;

  if (managerString) {
    try {
      manager = JSON.parse(managerString); // Thử phân tích chuỗi JSON
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }

  // Kiểm tra và sử dụng đối tượng manager
  if (manager) {
    console.log("Thông tin của manager:", manager);
    console.log("Id của manager:", manager.id);
  }
  const devicetoken1 = localStorage.getItem("deviceToken");
  if (devicetoken1) {
    // Có deviceToken, bạn có thể sử dụng nó tại đây
    console.log("Test device" + devicetoken1);
  }

  const thisrole = data?.role ? `Role ${data?.role}!` : "role!";
  // Sử dụng useLocation để lấy thông tin vị trí hiện tại (đường dẫn URL) của ứng dụng
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  if (token) {
    const decodedToken = jwt_decode(token);
    console.log("decoded" + decodedToken);
    const userRoles = decodedToken?.Role || [];
    console.log("test " + userRoles);

    if (userRoles === "Admin") {
      // Nếu người dùng có role 5150, cho phép truy cập Outlet
      if (userRoles.includes("Admin")) {
        // Check if the user has the Admin role
        localStorage.setItem("isAdmin", "true"); // Set an isAdmin flag in local storage
      }
      return <Outlet />;
    } else if (userRoles === "Manager") {
      // Nếu người dùng có role 1984 hoặc 2001, chuyển hướng đến trang /manager
      return <ManagerContent />;
    } else {
      // Mặc định, chuyển hướng người dùng đến trang /welcome
      return <Navigate to="/welcome" />;
    }
  }

  // Lấy mảng roles từ đối tượng UserInfo
  // Kiểm tra xem người dùng có quyền truy cập hay không dựa trên giá trị trong mảng roles

  // Kiểm tra xem có token trong Local Storage không
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // else {
  //   // Mặc định, chuyển hướng người dùng đến trang đăng nhập
  //   return <Navigate to="/signin" state={{ from: location }} replace />;
  // }
};

export default RequireAuth;
