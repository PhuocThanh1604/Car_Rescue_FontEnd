
import React, { useState } from "react";
import { Box } from '@mui/material';
import { ColorModeContext, useMode } from '../../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from '../../components/Topbar';
import Sidebar from '../../scenes/geography/global/Sidebar';
import User from '../../scenes/user';

import Products from '../../scenes/products';
import Customer from '../../scenes/customer';
// import UploadImage from './scenes/products/uploadImage';
import AuthProvider from '../../context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser} from "./authSlice";
import { Link } from "react-router-dom";
import Customers from "../../scenes/customer";
import RescueVehicleOwners  from "../../scenes/rescueVehicleOwner";
import Managers from "../../scenes/manager";
import AddRescueVehicleOwner from "../../scenes/create_RescueVehicleOwner";
import AddTechnian  from "../../scenes/create_Technician";
import AddManager from "../../scenes/create_Manager";
import AddCustomer from "../../scenes/create_Customer";
import Technicians from "../../scenes/technician";
import CreateAccount from "../../scenes/account/createAccount";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateTechnician from "../../scenes/update_Technician";
import UpdateProfileAmdin from "../../scenes/updateProfile";


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
                  {/* <Route path="/admin/users" element={<User />} /> */}
                  {/* <Route path="/admin/invoices" element={<Invoices />} /> */}
        
                  <Route path="/admin/books" element={<Products />} />
                  
                  <Route path="" element={<Customers />} />
                  {/* LIST actor */}
                  <Route path="" element={<Customers />} />
                  <Route path="/admin/techinian" element={<Technicians />} />
                  <Route path="/admin/manager" element={<Managers />} />
                  <Route path="/admin/rescueVehicleOwner" element={<RescueVehicleOwners />} />

                  {/* create actor */}
                  <Route path="/admin/add/account" element={<CreateAccount />} />
                  <Route path="/admin/add/carVihecileOwner" element={<AddRescueVehicleOwner />} />
                  <Route path="/admin/add/technician" element={<AddTechnian />} />
                  <Route path="/admin/add/manager" element={<AddManager />} />
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

