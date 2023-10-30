import { createSlice } from "@reduxjs/toolkit"
// Tạo một "slice" của Redux sử dụng createSlice từ Redux Toolkit
const authSlice = createSlice({
    name: '/Login/Login',
    initialState: { email: null, token: null,deviceToken: null, role:null },// Tạo một "slice" của Redux sử dụng createSlice từ Redux Toolkit
    reducers: {
        // Action creator "setCredentials" với hàm reducer tương ứng
        setCredentials: (state, action) => {
            const { email, role ,data,deviceToken} = action.payload
            state.email = email; // Thiết lập user trong trạng thái
            state.token = data.accessToken; 
            state.role = role
            state.deviceToken = deviceToken;
            state.data = data
        },
        logOut: (state, action) => {
            state.email = null; // Đặt user về null khi đăng xuất
            state.token = null; // Đặt token về null khi đăng xuất
            state.deviceToken= null
            state.role =null;
        }
    },
})

// Export action creators (setCredentials và logOut) từ slice
export const { setCredentials, logOut } = authSlice.actions;

// Export reducer từ slice để sử dụng trong store Redux
export default authSlice.reducer;
// Selector functions để truy xuất thông tin từ trạng thái Redux
export const selectCurrentUser = (state) => state.auth.data
export const selectCurrentRole = (state) => state.auth.role
export const selectCurrentToken = (state) => state.auth.token
