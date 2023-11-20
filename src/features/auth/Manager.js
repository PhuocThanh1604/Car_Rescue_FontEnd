import React, { useState } from "react";
import { Box } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "../../components/Topbar";
import Sidebar from "../../scenesManager/geographyManager/global/Sidebar";
import Contacts from "../../scenesManager/contacts";
import Invoices from "../../scenesManager/invoices";
import FAQ from "../../scenesManager/faq";
import Orders from "../../scenesManager/ordersPage/ordersNew";
import { Routes, Route, useParams } from "react-router-dom";
import Dashboard from "../../scenesManager/dashboard";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "./authSlice";
import Customers from "../../scenes/customer";
import Technicians from "../../scenes/technician";
import RescueVehicleOwners from "../../scenes/rescueVehicleOwner";
import Managers from "../../scenes/manager";
import AddRescueVehicleOwner from "../../scenes/create_RescueVehicleOwner";
import AddTechnician from "../../scenes/create_Technician";
import AddManager from "../../scenes/create_Manager";
import AddCustomer from "../../scenes/create_Customer";
import AddService from "../../scenesManager/create_Service";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Services from "../../scenesManager/servicePage";
import UpdateProfileManager from "../../scenesManager/updateProfile";
import OrdersCompleted from "../../scenesManager/ordersPage/ordersCompleted";
import OrdersAssigned from "../../scenesManager/ordersPage/ordersAssigned";
import OrdersInprogress from "../../scenesManager/ordersPage/ordersInprogress";
import OrdersAssigning from "../../scenesManager/ordersPage/ordersAssigning";
import OrdersCancelled from "../../scenesManager/ordersPage/ordersCancelled";
import CalendarRescueVehicleOwner from "../../scenesManager/calendarRescueVehicleOwner";
import CalendarTechnician from "../../scenesManager/calendarTechnician";
import Map from "../../scenesManager/map/google";
import Vehicles from "../../scenesManager/vehicle";
import CreateOrderOffline from "../../scenesManager/create_OrderOffline";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import TransactionDetails from "../../scenesManager/invoices/transactionDetail";
import Payment from "../../scenesManager/payment";

const Manager = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const handleSelectWallet = (id) => {
    console.log("Manager: Updating Selected Wallet ID to", id);
    setSelectedWalletId(id);
  };

  useEffect(() => {
    // Hàm để tải lại dữ liệu
    const reloadData = async () => {
      // Tạo các hành động để tải lại dữ liệu ở đây
      console.log("Reloading data for new route:", location.pathname);
      // Ví dụ: dispatch(fetchOrdersNew()), fetchProducts(), v.v...
    };

    // Gọi hàm tải lại dữ liệu
    reloadData();
  }, [location.pathname]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <ToastContainer />
          <Topbar setIsSidebar={setIsSidebar} />
          <main
            className="content"
            style={{ display: "flex", height: "100vh" }}
          >
            {isSidebar && (
              <Sidebar
                isSidebar={isSidebar}
                selectedWalletId={selectedWalletId}
              />
            )}
            <Box flexGrow={2}>
              {/* <AuthProvider> */}
              <Routes>
                <Route path="/client" element={<Dashboard />} />
                <Route path="/manager/contacts" element={<Contacts />} />
                <Route path="/manager/payments" element={<Payment />} />
                {/* <Route path="/manager/invoices" element={<Invoices />} /> */}
                <Route path="/manager/invoices/:id" element={ <TransactionDetails/>} />

                <Route 
                  path="/manager/invoices" 
                  element={<Invoices onSelectWallet={handleSelectWallet} />} 
                />

                <Route
                  path="/manager/calendarTechnicians"
                  element={<CalendarTechnician />}
                />
                <Route
                  path="/manager/calendarRescueVehicleOwners"
                  element={<CalendarRescueVehicleOwner />}
                />
                {/* } />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} /> */}
                {/* <Route path="/geography" element={<Geography />} /> */}
                <Route path="/manager/googlemap" element={<Map />} />

                <Route path="/manager/faq" element={<FAQ />} />
                <Route path="/manager/orders" element={<Orders />} />
                <Route
                  path="/manager/ordersAssigned"
                  element={<OrdersAssigned />}
                />
                <Route
                  path="/manager/ordersCompleted"
                  element={<OrdersCompleted />}
                />
                <Route
                  path="/manager/ordersInprogress"
                  element={<OrdersInprogress />}
                />
                <Route
                  path="/manager/ordersAssigning"
                  element={<OrdersAssigning />}
                />
                <Route
                  path="/manager/ordersCancelled"
                  element={<OrdersCancelled />}
                />
                {/* LIST actor */}
                <Route path="/manager/customer" element={<Customers />} />
                <Route path="/manager/techinian" element={<Technicians />} />
                <Route path="/manager/manager" element={<Managers />} />
                <Route
                  path="/manager/rescueVehicleOwner"
                  element={<RescueVehicleOwners />}
                />
                <Route path="/manager/vehicles" element={<Vehicles />} />

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
                <Route
                  path="/manager/add/orderOffline"
                  element={<CreateOrderOffline />}
                />
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
