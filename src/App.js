import { Routes, Route } from "react-router-dom";
import RequireAuth from "./features/auth/RequireAuth";
import Manager from "./features/auth/Manager";
import Admin from "./features/auth/Admin";
import { useEffect, useState } from "react";
import { onMessageListener, requestPermissions } from "./firebase";
import axios from "axios";
import { toast } from "react-toastify";
import Topbar from "./components/Topbar";

function App() {
    
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
        `${payload.notification.title}, ${payload.notification.body}`,
        {
          marginTop:"50px",
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
  useEffect(() => {
    requestPermissions();
  }, []);
  axios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        config.headers.Authorization = `${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return (
     
      <Routes>
        <Route>
          <Route element={<RequireAuth />}>
            <Route path="/client/*" element={<Admin />} />
            <Route path="/manager/*" element={<Manager />} />
          </Route>
        </Route>
      </Routes>
  );
}

export default App;
