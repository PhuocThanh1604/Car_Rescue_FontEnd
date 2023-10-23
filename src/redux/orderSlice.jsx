import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  try {
    const response = await axios.get(
      "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAll"
    );
    const data = response.data;
    console.log(response.data);
    return data;
  } catch (response) {
    console.error(
      "Failed to retrieve orders:",
      response.status,
      response.message
    );
    throw response.status || response.message;
  }
});
export const fetchOrdersNew = createAsyncThunk(
  "orders/fetchOrdersNew",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderNew"
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve orders:",
        response.status,
        response.message
      );
      throw response.status || response.message;
    }
  }
);
export const fetchOrdersCompleted = createAsyncThunk(
  "orders/fetchOrdersCompleted",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderCompleted"
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve orders:",
        response.status,
        response.message
      );
      throw response.status || response.message;
    }
  }
);

export const fetchOrdersDetail = createAsyncThunk(
  "orders/fetchOrdersDetail",
  async () => {
    try {
      const response = await axios.get(
        "https://secondhandbookstoreapi.azurewebsites.net/api/OrdersDetails"
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (error) {
      console.error("Failed to retrieve ordersDetail:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getOderId = createAsyncThunk(
  "orders/getOderId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Order/GetOrder?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get Rescue Vehicle Owner ", error.response);
      throw error.response.data || error.message;
    }
  }
);
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    status: "",
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
        state.orders = action.payload.data;
      })
      .addCase(fetchOrders.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersNew.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(fetchOrdersNew.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersCompleted.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(fetchOrdersCompleted.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersDetail.fulfilled, (state, action) => {
        state.ordersDetails = action.payload; // Lưu trữ dữ liệu ordersDetails vào state
      })
      .addCase(fetchOrdersDetail.pending, (state, action) => {
        state.status = "loading";
      }).addCase(getOderId.fulfilled, (state, action) => {
        state.rescueVehicleOwnerData = action.payload.data;
      })
  },
});
export const { setorders } = orderSlice.actions;
export default orderSlice.reducer;
export const { reducer } = orderSlice;
// Thêm fetchOrdersDetail vào danh sách các actions
