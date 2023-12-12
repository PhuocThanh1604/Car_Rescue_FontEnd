import { Routes, Route } from "react-router-dom";
import RequireAuth from "./features/auth/RequireAuth";
import Manager from "./features/auth/Manager";
import Admin from "./features/auth/Admin";
import { useEffect } from "react";
import { requestPermissions } from "./firebase";
import axios from "axios";

function App() {
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
