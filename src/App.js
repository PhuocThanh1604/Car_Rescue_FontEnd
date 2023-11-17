import { Routes, Route } from "react-router-dom";
import RequireAuth from "./features/auth/RequireAuth";
import SignIn from "./features/auth/Singin";
import Manager from "./features/auth/Manager";
import Admin from "./features/auth/Admin";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY_GG;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);
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
