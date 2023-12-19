import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";
import ManagerContent from "./Manager";
import Error4O1 from "../../utils/401";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { onMessageListener } from "../../firebase";
import AutoLogout from "./AutoLogout";
import { AccessTokenProvider } from "../../context/context";

const RequireAuth = () => {


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
  const managerString = localStorage.getItem("manager");

  let manager = null;

  if (managerString) {
    try {
      manager = JSON.parse(managerString);
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }


 console.log(AccessTokenProvider)

  const devicetoken1 = localStorage.getItem("deviceToken");

  if (devicetoken1) {
  }


  const location = useLocation();
 
  const role = localStorage.getItem("role_user");

  if (role) {
    if (role === "Admin") {
      if (role.includes("Admin")) {
        return (
          <div>
           
            <Outlet />
          </div>
        );
      }
    
    } else if (role === "Manager") {
      return (
        <div>
     
          <ManagerContent />
        </div>
      );
    } else {
      return <Error4O1 />;
    }
  }

  // if (token) {
  //   const decodedToken = jwt_decode(token);
  //   console.log("decoded" + decodedToken);
  //   const userRoles = decodedToken?.Role || [];
  //   console.log("test " + userRoles);

  //   if (userRoles === "Admin") {
  //     // Nếu người dùng có role 5150, cho phép truy cập Outlet
  //     if (userRoles.includes("Admin")) {
  //       // Check if the user has the Admin role
  //       localStorage.setItem("isAdmin", "true"); // Set an isAdmin flag in local storage
  //     }
  //     return <Outlet />;
  //   } else if (userRoles === "Manager") {
  //     // Nếu người dùng có role 1984 hoặc 2001, chuyển hướng đến trang /manager
  //     return <ManagerContent />;
  //   } else {
  //     // Mặc định, chuyển hướng người dùng đến trang /welcome
  //     return <Navigate to="/welcome" />;
  //   }
  // }

  // Lấy mảng roles từ đối tượng UserInfo
  // Kiểm tra xem người dùng có quyền truy cập hay không dựa trên giá trị trong mảng roles

  // Kiểm tra xem có token trong Local Storage không
  const storedToken = localStorage.getItem("token");
  if (!storedToken) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
