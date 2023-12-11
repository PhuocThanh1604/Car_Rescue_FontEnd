import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
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

const accessToken = localStorage.getItem("access_token");

export const fetchPayments = createAsyncThunk(
  "transactions/fetchPayments",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Payment/GetPayments",
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
      console.error("Failed to retrieve fetch payment New:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getPaymentOfOrder = createAsyncThunk(
  "transaction/getTransactionOfWalletId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetTransactionOfWallet?id=${id}`,
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
      console.error("Failed to get Transaction Of Wallet Id:", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const getTransactionById = createAsyncThunk(
  "transaction/getTransactionById",
  async ({ id }) => {
  
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetByID?id=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get Transaction By Id ", error.response);
      throw error.response.data || error.message;
    }
  }
);




const PaymentSlice = createSlice({
  name: "payment",
  initialState: {
  payments: [],
    status: "",
  },
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload.data;
      })
      .addCase(fetchPayments.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPaymentOfOrder.fulfilled, (state, action) => {
        state.paymentsData = action.payload.data;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.paymentsData = action.payload.data;
      });
  },
});
export const { setPayments } = PaymentSlice.actions;
export default PaymentSlice.reducer;
export const { reducer } = PaymentSlice;
