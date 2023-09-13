  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import axios from 'axios';


  export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async () => {
      try {
        const response = await axios.get(
          'https://secondhandbookstoreapi.azurewebsites.net/api/Orders'
        );
        const data = response.data;
        console.log(response.data);
        return data;
      } catch (error) {
        console.error('Failed to retrieve orders:', error);
        throw error;
      }
    }
  );

  export const fetchOrdersDetail = createAsyncThunk(
    'orders/fetchOrdersDetail',
    async () => {
      try {
        const response = await axios.get(
          'https://secondhandbookstoreapi.azurewebsites.net/api/OrdersDetails'
        );
        const data = response.data;
        console.log(response.data);
        return data;
      } catch (error) {
        console.error('Failed to retrieve ordersDetail:', error);
        throw error;
      }
    }
  );
  const orderSlice = createSlice({
    name: 'order',
    initialState: {
      orders: [],
      status: '',
      ordersDetails: [], // Thêm thuộc tính ordersDetails vào state
    },
    reducers: {
      setorders: (state, action) => {
        state.orders = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.orders = action.payload;
        })
        .addCase(fetchOrders.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(fetchOrdersDetail.fulfilled, (state, action) => {
          state.ordersDetails = action.payload; // Lưu trữ dữ liệu ordersDetails vào state
        })
        .addCase(fetchOrdersDetail.pending, (state, action) => {
          state.status = 'loading';
        })
    }
  });
  export const { setorders, } = orderSlice.actions;
  export default orderSlice.reducer;
  export const { reducer } = orderSlice;
  // Thêm fetchOrdersDetail vào danh sách các actions
