import React, { useEffect } from 'react';
import { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PropTypes from 'prop-types';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import ViewListIcon from '@mui/icons-material/ViewList';
import CategoryIcon from '@mui/icons-material/Category';
import { useSelector } from 'react-redux';
import { selectCurrentUser,selectCurrentRole } from '../../../features/auth/authSlice';
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
 
  
  Item.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    setSelected: PropTypes.func.isRequired,
  };
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        backgroundColor: selected === title ? colors.blue[100] : 'transparent', 
        borderRadius: '20px', 
      }}
      onClick={() => setSelected(title)}
      icon={icon}>
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('dashboard');
  const user = useSelector(selectCurrentUser);
  const storedRole = localStorage.getItem("role_user");
  const [userRole, setUserRole] = useState(storedRole || "");

  useEffect(() => {
    if (user && user.role) {
      setUserRole(user.role);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, [user, storedRole]);
  const sidebarStyles = {
  // Set the position to fixed
    bottom: 0,          // Stick it to the bottom of the screen
    top: '10px',        // Make sure it doesn't overlap the content
    height: 'fit-content', // Adjust the height to fit the content
  };
  return (
    <Box
      sx={{
        ...sidebarStyles,  // Apply the sidebar styles
        display: 'flex',
        height: userRole === 'admin' ? '100%' : 'auto',
        '& .pro-sidebar-inner': {
          background: `${colors.primary[400]} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#868dfb !important',
        },
        '& .pro-menu-item.active': {
          color: '#6870fa !important',
        },
      }}>
      <ProSidebar collapsed={isCollapsed} >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: '10px 0 20px 0',
              color: colors.grey[100],
            }}>
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="44px">
                <Typography variant="h3" color={colors.grey[100]}>
                  DashBoard
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="200px"
                  height="130px"
                  src={`../../assets/logo-no-background.png`}
                  style={{ cursor: 'pointer', borderRadius: '50%' }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: '10px 0 0 0' }}>
                    {userRole && `Chào: ${userRole}`}
                </Typography>
            
                <Typography variant="h2" color={colors.greenAccent[500]}>
                  Car Rescue
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : '10%'}>
          {/* <Item
              title="HOME"
              to="/client"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: '15px 0 5px 20px' }}>
              Data
            </Typography>
            <Item
              title="Khách Hàng"
              to="/Client"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{' '}
            <Item
              title="Chủ Xe Cứu Hộ"
              to="admin/rescueVehicleOwner"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{' '}
            <Item
              title="Kỹ Thuật Viên"
              to="admin/techinian"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{' '}
          
                  <Item
              title="Quản Lí"
              to="admin/manager"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />{' '}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: '30px 0 10px 30px' }}>
              Pages
            </Typography>
             <Item
              title="Tạo Tài Khoản"
              to="admin/add/account"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="Tạo Chủ Xe Cứu Hộ"
              to="admin/add/carVihecileOwner"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                <Item
              title="Tạo Kỹ Thuật"
              to="admin/add/technician"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
        
               <Item
              title="Tạo Quản Lí"
              to="admin/add/manager"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
               {/* <Item
              title="Tạo Khách Hàng"
              to="admin/add/customer"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
           
 
   
          
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
