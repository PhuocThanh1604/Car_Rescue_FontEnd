import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiKeyGG = "AIzaSyBv0RoGulA7l1v9-d8uD5pgG8EsOPZbFLU";
// const apiKeyGG = process.env.API_KEY_GG;
const mapboxToken =
  "pk.eyJ1IjoidGhhbmgyazEiLCJhIjoiY2xvZjMxcWppMG5oejJqcnI2M2ZleTJtZiJ9.yvWTA-yYNqTdr2OstpB7bw";
// const apiKey = '';
// Hàm lưu dữ liệu vào storage
const saveToStorage = (key, data) => {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData); // Dùng Local Storage
  // sessionStorage.setItem(key, jsonData); // Hoặc dùng Session Storage
};
const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};
// Hàm lấy dữ liệu từ storage
const getFromStorage = (key) => {
  const jsonData = localStorage.getItem(key); // Dùng Local Storage
  // const jsonData = sessionStorage.getItem(key); // Hoặc dùng Session Storage
  return jsonData ? JSON.parse(jsonData) : null;
};

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
    const storageKey = "ordersNew";
    try {
      // Xóa dữ liệu cũ trong localStorage trước khi gửi yêu cầu lên server
      removeFromStorage(storageKey);

      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderNew"
      );
      const data = response.data;
      saveToStorage(storageKey, data); // Lưu dữ liệu mới vào Local Storage
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
    const storageKey = "ordersCompleted";
    try {
      removeFromStorage(storageKey);

      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderCompleted"
      );
      const data = response.data;
      saveToStorage(storageKey, data);
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
export const fetchDashboard = createAsyncThunk(
  "orders/fetchDashboard",
  async () => {
    const storageKey = "fetchDashboard";
    try {
      removeFromStorage(storageKey);
      const response = await axios.get("https://rescuecapstoneapi.azurewebsites.net/api/Dashboard/GetDashboard");
      const data = response.data;
      saveToStorage(storageKey, data);
      console.log("Response data:", data); // Log the response data for debugging
      return data;
    } catch (error) {
      console.error("Failed to retrieve fetch Dashboard:", error); // Log the error for debugging
      throw error; // Throw the error so it can be caught in your component
    }
  }
);
export const fetchOrdersInprogress = createAsyncThunk(
  "orders/fetchOrdersInprogress",
  async () => {
    const storageKey = "ordersInprogress";
    try {
      removeFromStorage(storageKey);
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderInprogress"
      );
      const data = response.data;
      saveToStorage(storageKey, data);
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
    const storageKey = "ordersAssigned";
    try {
      removeFromStorage(storageKey);
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderAssigned"
      );
      const data = response.data;
      saveToStorage(storageKey, data);
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
    const storageKey = "ordersCanneclled";
    try {
      removeFromStorage(storageKey);
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderCancelled"
      );
      const data = response.data;
      saveToStorage(storageKey, data);
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
    const storageKey = "ordersAssigning";
    try {
      removeFromStorage(storageKey);
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderAssigning"
      );
      const data = response.data;
      console.log(response.data);
      saveToStorage(storageKey, data);
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

export const getFeedbackOfOrderId = createAsyncThunk(
  "orders/getFeedbackOfOrderId",
  async ({ id }) => {
    try {
      console.log("id:" + id);
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Feedback/GetFeedbackOfOrder?id=${id}`
      );
      const data = response.data;
      console.log("data of feedback" + data);
      return data;
    } catch (error) {
      console.error("Failed to get Feedback Of Order  Id ", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getOrderDetailId = createAsyncThunk(
  "orders/getOrderDetailId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/OrderDetail/GetDetailsOfOrder?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get  get Order Detail Id ", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getFormattedAddressGG = createAsyncThunk(
  "orders/getFormattedAddress",
  async ({ lat, lng }) => {
    const key = `formattedAddress_${lat}_${lng}`;
    const storedData = getFromStorage(key);

    if (storedData) {
      return storedData; // Trả về dữ liệu đã lưu nếu có
    }

    try {
      removeFromStorage(storedData);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKeyGG}`
      );
      const data = response.data;
      saveToStorage(key, data); // Lưu dữ liệu mới vào storage
      return data;
    } catch (error) {
      console.error("Failed to get Address ", error.error_message);
      throw error.response.data || error.message;
    }
  }
);

// export const getFormattedAddressGG = createAsyncThunk(
//   "orders/getFormattedAddress",
//   async ({ lat, lng }) => {
//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKeyGG}`
//       );
//       const data = response.data;
//       return data;
//     } catch (error) {
//       console.error("Failed to get Address ", error.error_message);
//       throw error.response.data || error.message;
//     }
//   }
// );

export const getFormattedAddressMapbox = createAsyncThunk(
  "orders/getFormattedAddress",
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`;

      const response = await axios.get(url);
      const data = response.data;
      const formattedAddress = data.features[0].place_name;
      console.log(formattedAddress);
    } catch (error) {
      console.error("Failed to get Address ", error.message);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const createAcceptOrder = createAsyncThunk(
  "orders/createAcceptOrder",
  async (data) => {
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/ManagerAssignOrder",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to create Accept Order:", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const createCancelOrder = createAsyncThunk(
  "orders/createCancelOrder",
  async (data) => {
    console.log(data);
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/CustomerCancelOrder",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to create Cancel Order:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const createChangeTypeRescue = createAsyncThunk(
  "orders/createChangeTypeRescue",
  async (data) => {
    console.log(data);
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/ChangeRescueType",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to create Change Type Rescue:", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const createOrderOfflineFixing = createAsyncThunk(
  "orders/createOrderOfflineFixing",
  async (data) => {
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/CreateFixingOrderForCustomer",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to create Order Offline fixing:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const createOrderOffline = createAsyncThunk(
  "orders/createOrderOffline",
  async (data) => {
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/CreateTowingOrderForCustomer",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to create Order Offline:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const addServiceForTechnicians = createAsyncThunk(
  "orders/addServiceForTechnicians",
  async (data) => {
    try {
      console.log(data);
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/ManagerAddService",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to add Service For Technicians:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const updateServiceForTechnicians = createAsyncThunk(
  "orders/updateServiceForTechnicians",
  async (data) => {
    try {
      console.log(data);
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/ManagerUpdateService",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error(
        "Failed to update Service For Technicians:",
        error.response
      );
      throw error.response.data || error.message;
    }
  }
);
export const sendNotification = createAsyncThunk(
  "orders/sendNotification",
  async (notificationData) => {
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Notification/send",
        notificationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(notificationData);
      return res.data;
    } catch (error) {
      console.error(
        "Failed to create notification Order Offline:",
        error.response
      );
      throw error.response.data || error.message;
    }
  }
);

export const sendSMS= createAsyncThunk(
  "orders/sendSMS",
  async (data) => {
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/SMS/Send-SMS",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to create send sms to customer:", error.res);
      throw error.res.status || error.res.message;
    }
  }
);
export const getPaymentId = createAsyncThunk(
  "orders/getPaymentId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Payment/GetPaymentOfOrder?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve customer:",
        response.status,
        response.message
      );
      throw response.status || response.message;
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
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(fetchDashboard.pending, (state, action) => {
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
        state.ordersDetails = action.payload;
      })
      .addCase(fetchOrdersDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOrderId.fulfilled, (state, action) => {
        state.orderData = action.payload.data;
      })
      .addCase(getOrderDetailId.fulfilled, (state, action) => {
        state.orderData = action.payload.data;
      })
      .addCase(getPaymentId.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(getFeedbackOfOrderId.fulfilled, (state, action) => {
        state.orderData = action.payload.data;
      })
      .addCase(createAcceptOrder.fulfilled, (state, action) => {
        if (Array.isArray(state.orders)) {
          state.orders.push(action.payload);
        } else {
          state.orders = [action.payload]; // Nếu không phải mảng, khởi tạo một mảng mới với action.payload
        }
      })
      .addCase(createAcceptOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAcceptOrder.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createCancelOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(createCancelOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCancelOrder.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createChangeTypeRescue.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(createChangeTypeRescue.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createChangeTypeRescue.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createOrderOffline.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(createOrderOffline.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderOffline.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(sendNotification.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(sendSMS.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(sendSMS.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendSMS.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createOrderOfflineFixing.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(createOrderOfflineFixing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderOfflineFixing.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getFormattedAddressMapbox.fulfilled, (state, action) => {
        state.formattedAddress = action.payload;
      })
      .addCase(getFormattedAddressMapbox.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateServiceForTechnicians.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(updateServiceForTechnicians.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateServiceForTechnicians.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(addServiceForTechnicians.fulfilled, (state, action) => {
        state.orders = action.payload.data;
      })
      .addCase(addServiceForTechnicians.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addServiceForTechnicians.rejected, (state, action) => {
        state.status = "error";
      });
  },
});
export const { setorders } = orderSlice.actions;
export default orderSlice.reducer;
export const { reducer } = orderSlice;
// Thêm fetchOrdersDetail vào danh sách các actions
