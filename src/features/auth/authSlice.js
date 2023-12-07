import { createSlice } from "@reduxjs/toolkit"
const authSlice = createSlice({
    name: '/Login/Login',
    initialState: { email: null, token: null,deviceToken: null, role:null },// Tạo một "slice" của Redux sử dụng createSlice từ Redux Toolkit
    reducers: {
        // Action creator "setCredentials" với hàm reducer tương ứng
        setCredentials: (state, action) => {
            const { email, role ,data,deviceToken} = action.payload
            state.email = email; 
            state.token = data.accessToken; 
            state.role = role
            state.deviceToken = deviceToken;
            state.data = data
        },
        logOut: (state, action) => {
            state.email = null; 
            state.token = null; 
            state.deviceToken= null
            state.role =null;
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.data
export const selectCurrentRole = (state) => state.auth.role
export const selectCurrentToken = (state) => state.auth.token
