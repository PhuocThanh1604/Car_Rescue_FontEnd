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
        "Failed to retrieve fetch Orders Completed:",
        response.status,
        response.message
      );
      throw response.status || response.message;
    }
  }
);
export const fetchOrdersInprogress = createAsyncThunk(
  "orders/fetchOrdersInprogress",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderInprogress"
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve fetch Orders Inprogress:",
        response.status,
        response.message
      );
      throw response.status || response.message;
    }
  }
);
export const fetchOrdersAssigned = createAsyncThunk(
  "orders/fetchOrdersAssigned",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderAssigned"
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve Orders Assigned:",
        response.status,
        response.message
      );
      throw response.status || response.message;
    }
  }
);
export const fetchOrdersCancelled = createAsyncThunk(
  "orders/fetchOrdersCancelled",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderCancelled"
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve Orders Assigned:",
        response.status,
        response.message
      );
      throw response.status || response.message;
    }
  }
);
export const fetchOrdersAssigning = createAsyncThunk(
  "orders/fetchOrdersAssigning",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderAssigning"
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve Orders Assigning:",
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
export const getOrderId = createAsyncThunk(
  "orders/getOrderId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Order/GetOrder?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get  Order Id ", error.response);
      throw error.response.data || error.message;
    }
  }
);

// export const createAcceptOrder = createAsyncThunk(
//   "orders/createAcceptOrder",
//   async ({ data }) => {
//     try {
//       const response = await axios.post(
//         `https://rescuecapstoneapi.azurewebsites.net/api/Order/ManagerAssignOrder`,data
//       );
//       const data = response.data;
//       console.log(data);
//       return data;
//     } catch (error) {
//       console.error("Failed to create Accept Order ", error.response);
//       throw error.response.data || error.message;
//     }
//   }
// );
export const createAcceptOrder = createAsyncThunk(
  "orders/createAcceptOrder",
  async (data) => {
    try {
      // const orderData = {
      //   ...data,
      // };
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/ManagerAssignOrder",
        data ,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data)
      return res.data;
    } catch (error) {
      console.error("Failed to create Accept Order:", error.response);
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
      .addCase(fetchOrdersInprogress.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(fetchOrdersInprogress.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersAssigned.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(fetchOrdersAssigned.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersCancelled.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(fetchOrdersCancelled.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersAssigning.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(fetchOrdersAssigning.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersDetail.fulfilled, (state, action) => {
        state.ordersDetails = action.payload; // Lưu trữ dữ liệu ordersDetails vào state
      })
      .addCase(fetchOrdersDetail.pending, (state, action) => {
        state.status = "loading";
      }).addCase(getOrderId.fulfilled, (state, action) => {
        state.orderData = action.payload.data;
      }).addCase(createAcceptOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(createAcceptOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAcceptOrder.rejected, (state, action) => {
        state.status = "error";
      })
  },
});
export const { setorders } = orderSlice.actions;
export default orderSlice.reducer;
export const { reducer } = orderSlice;
// Thêm fetchOrdersDetail vào danh sách các actions
