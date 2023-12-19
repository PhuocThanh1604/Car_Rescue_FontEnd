

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const loginWithGoogle = async (accessToken) => {
  try {
    const response = await axios.post(
      "https://secondhandbookstoreapi.azurewebsites.net/google-login",
      null,
      {
        params: {
          accessToken: accessToken,
        },
      }
    );

    // Return the user and access token from the response
    return response.data;
  } catch (error) {
    throw new Error("Failed to login with Google.");
  }
};
export const login = createAsyncThunk("auth/login", async (accessToken) => {
  try {
    const data = await loginWithGoogle(accessToken);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
})
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAdmin: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
    },
  },
});


export const { setUser, setIsAdmin, logout } = authSlice.actions;

export default authSlice.reducer;
