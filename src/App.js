import { Routes, Route } from "react-router-dom";
import RequireAuth from "./features/auth/RequireAuth";
import SignIn from "./features/auth/Singin";
import Manager from "./features/auth/Manager";
import Admin from "./features/auth/Admin";

function App() {
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
