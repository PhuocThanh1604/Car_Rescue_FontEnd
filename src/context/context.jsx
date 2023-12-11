import React, { createContext, useContext, useState } from "react";

const AccessTokenContext = createContext();

export const useAccessToken = () => {
  return useContext(AccessTokenContext);
};

export const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || "");

  const updateAccessToken = (token) => {
    localStorage.setItem("access_token", token);
    setAccessToken(token);
  };

  return (
    <AccessTokenContext.Provider value={{ accessToken, updateAccessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};
