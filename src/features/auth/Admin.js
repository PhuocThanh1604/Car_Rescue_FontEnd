
import React, { useState } from "react";
import { Box } from '@mui/material';
import { ColorModeContext, useMode } from '../../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from '../../components/Topbar';
import Sidebar from '../../pages/scenes/geography/global/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser} from "./authSlice";
import Customers from "../../pages/scenes/customer";
import Managers from "../../pages/scenes/manager";
import Technicians from "../../pages/scenes/technician";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateTechnician from "../../pages/scenes/update_Technician";
import UpdateProfileAmdin from "../../pages/scenes/updateProfile";
import AddCustomer from "../../pages/scenes/create_Customer";
import Accounts from "../../pages/scenes/account";
import CreateAccount from "../../pages/scenes/account/createAccount";
import AddRescueVehicleOwner from "../../pages/scenes/create_RescueVehicleOwner";
import AddManager from "../../pages/scenes/create_Manager";
import RescueVehicleOwners from "../../pages/scenes/rescueVehicleOwner";
import Addtechnician from "../../pages/scenes/create_Technician";


const Admin = () => {
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
          <main className="content" style={{ display: 'flex'}}>
            {isSidebar && <Sidebar isSidebar={isSidebar} />}
            <Box flexGrow={2}>
            {/* <AuthProvider> */}
            <Routes>
                  <Route path="" element={<Customers />} />
                  {/* LIST actor */}
                  <Route path="" element={<Customers />} />
                  <Route path="/admin/techinian" element={<Technicians />} />
                  <Route path="/admin/account" element={<Accounts />} />
                  <Route path="/admin/manager" element={<Managers />} />
                  <Route path="/admin/rescueVehicleOwner" element={<RescueVehicleOwners />} />

                  {/* create actor */}
                  <Route path="/admin/add/account" element={<CreateAccount />} />
                  <Route path="/admin/add/carVihecileOwner" element={<AddRescueVehicleOwner />} />
                  <Route path="/admin/add/technician" element={<Addtechnician />} />
                  <Route path="/admin/add/manager" element={<AddManager />} />
                  <Route path="/admin/add/customer" element={<AddCustomer />} />
                  <Route path="/admin/edit/updateTechnician" element={<UpdateTechnician />} />
                  {/* <Route path="/admin/add/customer" element={<AddCustomer />} /> */}
                  <Route path="/admin/update/profile" element={<UpdateProfileAmdin />} />
                </Routes>
                
                 {/* </AuthProvider> */}
            
         
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Admin;

