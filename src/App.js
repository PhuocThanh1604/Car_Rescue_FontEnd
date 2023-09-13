import React from 'react';
import { Box } from '@mui/material';
import User from './scenes/user';
import { useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { Routes, Route } from 'react-router-dom';
import Topbar from './scenes/global/Topbar';
import Dashboard from './scenes/dashboard';
import Contacts from './scenes/contacts';
import Sidebar from './scenes/global/Sidebar';
import Invoices from './scenes/invoices';
import Form from './scenes/form';
import Calendar from './scenes/calendar';
import FAQ from './scenes/faq';
import Bar from './scenes/bar';
import Pie from './scenes/Pie';
import Line from './scenes/line';
import Geography from './scenes/geography';
import Products from './scenes/products';
import Main from './scenes/main';
import Books from './scenes/bookImage';
import CreateBook from './scenes/products/createBook';
import CreateBookGenres from './scenes/products/createGenres';
import UploadImage from './scenes/products/uploadImage';
import Orders from './scenes/orders';
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import AuthProvider from './context/AuthContext';
import LoginForm from './scenes/login/LoginForm';

const firebaseConfig = {
  apiKey: "AIzaSyBxp3h03ozQGAdC1ZxAxefGIIwo0i8ViRo",
  authDomain: "book-store-2hand.firebaseapp.com",
  projectId: "book-store-2hand",
  storageBucket: "book-store-2hand.appspot.com",
  messagingSenderId: "206884235195",
  appId: "1:206884235195:web:b452a49e9f089a7110c69e",
  measurementId: "G-4PB7QTRHJ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Topbar setIsSidebar={setIsSidebar} />
          <main className="content" style={{ display: 'flex' }}>
            {isSidebar && <Sidebar isSidebar={isSidebar} />}
            <Box flexGrow={1}>
            <AuthProvider>
            <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/users" element={<User />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/books" element={<Products />} />
                  <Route path="/addBook" element={<CreateBook />} />
                  <Route path="/addGenres" element={<CreateBookGenres />} />
                  <Route path="/test" element={<Books />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/uploadImages" element={<UploadImage />} />
                </Routes>
                
                 </AuthProvider>
            
         
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
