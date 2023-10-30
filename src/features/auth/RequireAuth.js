import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentRole,
  selectCurrentToken,
  selectCurrentUser,
} from "./authSlice";
import jwt_decode from "jwt-decode";
import ManagerContent from "./Manager";
const RequireAuth = () => {
  // Sử dụng useSelector để truy cập giá trị token từ Redux store
  const data = useSelector(selectCurrentUser);
  if (data) {
    localStorage.setItem("refesh_token", data?.refreshToken);
    localStorage.setItem("role_user", data?.role);
    localStorage.setItem("access_token", data?.accessToken);
    localStorage.setItem("manager", data?.manager);
    localStorage.setItem("deviceToken", data?.deviceToken);
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
    console.log("Test device"+devicetoken1);
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
