import React, { useState } from "react";
import { Box } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "../../components/Topbar";
import Sidebar from "../../scenesManager/geographyManager/global/Sidebar";
import Contacts from "../../scenesManager/contacts";
import Calendar from "../../scenesManager/calendar";
import User from "../../scenes/user";
import Form from "../../scenesManager/form";
import Invoices from "../../scenesManager/invoices";
// import FAQ from './scenes/faq';
// import Bar from './scenes/bar';
// import Pie from './scenes/Pie';
// import Line from './scenes/line';
// import Geography from './scenes/geography';
import Products from "../../scenesManager/products";
import Orders from "../../scenesManager/ordersPage";
import AuthProvider from "../../context/AuthContext";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../scenes/dashboard";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "./authSlice";
import { Link } from "react-router-dom";
import Customers from "../../scenes/customer";
import Technicians from "../../scenes/technician";
import RescueVehicleOwners from "../../scenes/rescueVehicleOwner";
import Managers from "../../scenes/manager";
import AddRescueVehicleOwner from "../../scenes/create_RescueVehicleOwner";
import AddTechnician from "../../scenes/create_Technician";
import AddManager from "../../scenes/create_Manager";
import AddCustomer from "../../scenes/create_Customer";
import AddService from "../../scenes/create_Service";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Services from "../../scenesManager/servicePage";
import UpdateProfileManager from "../../scenesManager/updateProfile";
import Vehicles from "../../scenesManager/vehicle";
import OrdersCompleted from "../../scenesManager/ordersPage/ordersCompleted";

const Manager = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <ToastContainer />
          <Topbar setIsSidebar={setIsSidebar} />
          <main className="content" style={{ display: "flex" }}>
            {isSidebar && <Sidebar isSidebar={isSidebar} />}
            <Box flexGrow={2}>
              {/* <AuthProvider> */}
              <Routes>
                <Route path="/client" element={<Dashboard />} />
                <Route path="/manager/contacts" element={<Contacts />} />
                <Route path="/manager/calendar" element={<Calendar />} />
                <Route path="/manager/users" element={<User />} />
                <Route path="/manager/invoices" element={<Invoices />} />
                <Route path="/manager/form" element={<Form />} />
                {/* <Route path="/faq" element={<FAQ />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} /> */}
                {/* <Route path="/geography" element={<Geography />} /> */}
                <Route path="/manager/books" element={<Products />} />
                {/* <Route path="/manager/addBook" element={<CreateBook />} />
                  <Route path="/manager/addGenres" element={<CreateBookGenres />} /> */}
                <Route path="/manager/orders" element={<Orders />} />
                <Route path="/manager/ordersCompleted" element={<OrdersCompleted />} />
                {/* LIST actor */}
                <Route path="/manager/customer" element={<Customers />} />
                <Route path="/manager/techinian" element={<Technicians />} />
                <Route path="/manager/manager" element={<Managers />} />
                <Route
                  path="/manager/rescueVehicleOwner"
                  element={<RescueVehicleOwners />}
                />
                  <Route
                  path="/manager/vehicles"
                  element={<Vehicles />}
                />
                
                <Route path="/manager/service" element={<Services />} />

                {/* create actor */}
                <Route
                  path="/manager/add/carVihecileOwner"
                  element={<AddRescueVehicleOwner />}
                />
                <Route
                  path="/manager/add/techinian"
                  element={<AddTechnician />}
                />
                <Route path="/manager/add/manager" element={<AddManager />} />
                <Route path="/manager/add/customer" element={<AddCustomer />} />
                <Route path="/manager/add/service" element={<AddService />} />
                {/*Update Profile*/}
                <Route
                  path="/manager/update/profile"
                  element={<UpdateProfileManager />}
                />
              </Routes>

              {/* </AuthProvider> */}
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Manager;
