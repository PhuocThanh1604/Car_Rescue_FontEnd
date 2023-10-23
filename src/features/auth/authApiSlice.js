import { apiSlice } from "../../app/api/apiSlice";


// Sử dụng `apiSlice` để tạo `authApiSlice` và định nghĩa các endpoint cho API của phần xác thực (auth).
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
               // Hàm query trả về thông tin endpoint, bao gồm URL và phương thức HTTP.
            query: credentials => ({
                url: '/Login/Login', 
                // url: '/auth',      // URL mà yêu cầu sẽ được gửi đến.
                method: 'POST',    // Phương thức HTTP sẽ được sử dụng (POST).
                body: { ...credentials } // Dữ liệu gửi kèm trong yêu cầu (credentials).
            })
        }),
    })
})

export const {
    useLoginMutation
} = authApiSlice