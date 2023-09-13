// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// // initialize userToken from local storage
// const userToken = localStorage.getItem("token")
//   ? localStorage.getItem("token")
//   : null;

// const initialState = {
//   loading: false,
//   userInfo: null, // for user object
//   userToken, // for storing the JWT
//   error: null,
//   success: false, // for monitoring the registration process.};
//   message: "",
// };



// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("jwt");
//       state.loading = false;
//       state.userInfo = null;
//       state.userToken = null;
//       state.error = null;
//     },
//     fetchUser: (state, { payload }) => {
//       state.userInfo = payload.user;
//       state.userToken = payload.accessToken;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(login.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(login.fulfilled, (state, { payload }) => {
//       state.loading = false;
//       state.message = "Sign in successfully";
//       state.userInfo = payload.user;
//       state.userToken = payload.accessToken;
//     });
//     builder.addCase(login.rejected, (state, { payload }) => {
//       state.loading = false;
//       state.errorMessage = payload;
//     });
//   },
// });

// export default authSlice.reducer;
// export const { logout, loginGoogle, fetchUser } = authSlice.actions;



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
