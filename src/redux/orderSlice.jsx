import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiKeyGG = "AIzaSyChI9DuNbyJd4I5Od1hBrs9n3VB-EYEh2E";
const apiKeyGong = "267Zysi7kKypsNGSqcIBzWc3wxpz7rkeWguYkiM4";
// const apiKeyGG = process.env.API_KEY_GG;
const mapboxToken =
  "pk.eyJ1IjoidGhhbmgyazEiLCJhIjoiY2xvZjMxcWppMG5oejJqcnI2M2ZleTJtZiJ9.yvWTA-yYNqTdr2OstpB7bw";
// const apiKey = '';
// Hàm lưu dữ liệu vào storage
const saveToStorage = (key, data) => {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData); 
};
const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};
const accessToken = localStorage.getItem("access_token");
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  try {
    const response = await axios.get(
      "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAll", // Send the edited customer data
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization':`${accessToken}`
        },
      }
    );
    const data = response.data;
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderNew", // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderCompleted", // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Dashboard/GetDashboard", // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve fetch Dashboard:", error); 
      throw error; 
    }
  }
);
export const fetchOrdersInprogress = createAsyncThunk(
  "orders/fetchOrdersInprogress",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderInprogress", // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderAssigned", // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderCancelled", // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve Orders Cancelled:",
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/GetAllOrderAssigning", // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
        "https://secondhandbookstoreapi.azurewebsites.net/api/OrdersDetails", // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Order/GetOrder?id=${id}`, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Feedback/GetFeedbackOfOrder?id=${id}`, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
        `https://rescuecapstoneapi.azurewebsites.net/api/OrderDetail/GetDetailsOfOrder?id=${id}`, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to get  get Order Detail Id ", error.response);
      throw error.response.data || error.message;
    }
  }
);
// export const getFormattedAddressGG = createAsyncThunk(
//   "orders/getFormattedAddress",
//   async ({ lat, lng }) => {
//     console.log("lat"+lat,"lng"+lng);
//     try {
//         // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKeyGG}`

//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`

//       );

//       const data = response.data;
//       console.log(data)
//       return data;
//     } catch (error) {
//       console.error("Failed to get Address ", error.error_message);
//       throw error.response.data || error.message;
//     }
//   }
// );
export const getFormattedAddressGG = createAsyncThunk(
  "orders/getFormattedAddress",
  async ({ lat, lng }) => {

    try {
  
      const response = await axios.get(
        // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKeyGG}`,
        `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${apiKeyGong}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE",
            "Access-Control-Max-Age": 3600,
            "Access-Control-Allow-Credentials":true,
            'Authorization':"AIzaSyChI9DuNbyJd4I5Od1hBrs9n3VB-EYEh2E"
          },
        }
      );
      const data = response.data;
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

// export const getFormattedAddressGG = createAsyncThunk(
//   "orders/getFormattedAddress",
//   async ({ lat, lng }, { rejectWithValue }) => {
//     try {
//       // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`;
//       // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`;
     
//       const response = await axios.get(url);
//       const data = response.data;
 

//       return data;
//     } catch (error) {
//       console.error("Failed to get Address ", error.message);
//       return rejectWithValue(error.response.data || error.message);
//     }
//   }
// );

export const createAcceptOrder = createAsyncThunk(
  "orders/createAcceptOrder",
  async (data) => {
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/ManagerAssignOrder",
        data, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept ",
            "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE",
            "Access-Control-Max-Age": 3600,
            'Authorization':`${accessToken}`
          },
        }
      );
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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept ",
            "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE",
            "Access-Control-Max-Age": 3600,
            'Authorization':`${accessToken}`
          },
        }
      );
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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept ",
            "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE",
            "Access-Control-Max-Age": 3600,
            'Authorization':`${accessToken}`
          },
        }
      );
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
    console.log(data);
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Order/CreateFixingOrderForCustomer",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept ",
            "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE",
            "Access-Control-Max-Age": 3600,
            'Authorization':`${accessToken}`
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
    console.log(data);
    try {
      const res = await axios.post(
        `https://rescuecapstoneapi.azurewebsites.net/api/Order/CreateTowingOrderForCustomer`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept ",
            "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE",
            "Access-Control-Max-Age": 3600,
            'Authorization':`${accessToken}`
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
            'Authorization':`${accessToken}`
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
            'Authorization':`${accessToken}`
          },
        }
      );
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
export const calculatePayment = createAsyncThunk(
  "orders/calculatePayment",
  async ({ id }) => {
    try {
      const response = await axios.post(
        `https://rescuecapstoneapi.azurewebsites.net/api/Order/CalculatePayment?id=${id}`,
        id,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      return response.data; // Chỉ trả về dữ liệu từ response
    } catch (error) {
      console.error("Failed to calculate Payment:", error.response.message);
      throw error.response.status || error.response.message;
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
            
            'Authorization':`${accessToken}`
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
export const getAllNotification = createAsyncThunk(
  "orders/getAllNotification",
  async ({ id }) => {
    
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Notification/Getall?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve car:",
        response.status,
        response.message
      );
      throw response.status || response.message;
    }
  }
);

export const sendSMS = createAsyncThunk("orders/sendSMS", async (data) => {
  try {
    const res = await axios.post(
      "https://rescuecapstoneapi.azurewebsites.net/api/SMS/Send-SMS",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization':`${accessToken}`
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to create send sms to customer:", error.res);
    throw error.res.status || error.res.message;
  }
});
export const getPaymentId = createAsyncThunk(
  "orders/getPaymentId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Payment/GetPaymentOfOrder?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
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
export const getCarById = createAsyncThunk(
  "orders/getCarById",
  async ({ id }) => {
    console.log("carId: " + id);
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Car/Get?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
      return data;
    } catch (response) {
      console.error(
        "Failed to retrieve car:",
        response.status,
        response.message
      );
      throw response.status || response.message;
    }
  }
);

export const createIncidentForFixing = createAsyncThunk(
  "orders/createIncidentForFixing",
  async (data) => {
    try {
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Incident/CreateIncident",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create Incident for Order fixing:", error.response);
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
      .addCase(getCarById.fulfilled, (state, action) => {
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
      .addCase(calculatePayment.fulfilled, (state, action) => {
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
        if (Array.isArray(state.orders)) {
          state.orders.push(action.payload);
        } else {
          state.orders = [action.payload]; // Nếu không phải mảng, khởi tạo một mảng mới với action.payload
        }
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
      .addCase(createIncidentForFixing.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(createIncidentForFixing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createIncidentForFixing.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getFormattedAddressGG.fulfilled, (state, action) => {
        state.formattedAddress = action.payload;
      })
      .addCase(getFormattedAddressGG.pending, (state, action) => {
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
