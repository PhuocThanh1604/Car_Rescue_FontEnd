import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice'
// Tạo một baseQuery sử dụng fetchBaseQuery từ Redux Toolkit Query
const baseQuery = fetchBaseQuery({
    // baseUrl: 'http://localhost:3500',
    baseUrl: 'https://rescuecapstoneapi.azurewebsites.net/api',
    credentials: 'omit',
    prepareHeaders: (headers, { getState }) => {
         // Lấy token từ trạng thái Redux
        const token = getState().auth.token
        if (token) {
              // Thêm token vào tiêu đề yêu cầu nếu tồn tại
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})
// Tạo một baseQuery với xử lý tái xác thực (reauthentication)
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
         // Gửi token làm mới để lấy token truy cập mới
    if (result?.error?.originalStatus === 403) {
        console.log('sending refresh token')
        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const user = api.getState().auth.user
            const roles = api.getState().auth.roles
            console.log(roles)
            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data, user ,roles}))
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})