// import * as React from "react";

// const AuthContext = React.createContext();

// function AuthProvider(props, children) {
//   const [user, setUser] = React.useState({});

//   const value = { user, setUser };
//   return (
//     <AuthContext.Provider value={value} {...props}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// function useAuth() {
//   const context = React.useContext(AuthContext);
//   if (typeof context === "undefined")
//     throw new Error("useAuth must be use in AuthProvider");
//   return context;
// }


import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../redux/authSlice";
import { auth } from "../firebase/firebase";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ displayName: user.displayName, email: user.email, uid: user.uid }));
      } else {
        dispatch(logout());
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
