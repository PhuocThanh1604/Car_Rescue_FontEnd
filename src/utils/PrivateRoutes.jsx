// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//   const { userInfo } = useSelector((state) => state.auth);

//   return userInfo ? <Outlet /> : <Navigate to={"unauth"} />;
// };

// export default PrivateRoute;


import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Element, adminOnly, ...rest }) => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  if (!user || Object.keys(user).length === 0) {
    // User is null or an empty object, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    // Requires admin privilege, but user is not an admin, redirect to another page
    return <Navigate to="/unauthorized" />;
  }

  // User is logged in and has access, display the component
  return <Element {...rest} />;
};

export default PrivateRoute;
