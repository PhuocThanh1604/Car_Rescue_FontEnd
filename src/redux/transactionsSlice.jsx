import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const saveToStorage = (key, data) => {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData); 
};

// Hàm lấy dữ liệu từ storage
const getFromStorage = (key) => {
  const jsonData = localStorage.getItem(key); 
  return jsonData ? JSON.parse(jsonData) : null;
};

export const createAcceptWithdrawRequest = createAsyncThunk(
  "vehicles/createAcceptWithdrawRequest",
  async ({ id, boolean }) => {
    try {
      console.log(id, boolean);
      const response = await axios.post(
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/AcceptWithdrawRequest?id=${id}&boolean=${boolean}`,
      );

      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error(
        "Failed to create Accept Withdraw Request:",
        error.response
      );
      throw error.response.data || error.message;
    }
  }
);

export const fetchTransactionsNew = createAsyncThunk(
  "transactions/fetchTransactionsNew",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetNewTransactions"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve fetch Transactions New:", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const fetchTransactionsAll = createAsyncThunk(
  "transactions/fetchTransactionsAll",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetAll"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve fetch Transactions New:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getTransactionOfWalletId = createAsyncThunk(
  "transaction/getTransactionOfWalletId",
  async ({ id }) => {
    console.log("tesst: "+id)
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetTransactionOfWallet?id=${id}`
      );
      
      const data = response.data;
      console.log(data);
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetByID?id=${id}`
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




const TransactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: [],
    status: "",
  },
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsNew.fulfilled, (state, action) => {
        state.transactions = action.payload.data;
      })
      .addCase(fetchTransactionsNew.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createAcceptWithdrawRequest.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(createAcceptWithdrawRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAcceptWithdrawRequest.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getTransactionOfWalletId.fulfilled, (state, action) => {
        state.transactionsData = action.payload.data;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.transactionsData = action.payload.data;
      });
  },
});
export const { setTransactions } = TransactionSlice.actions;
export default TransactionSlice.reducer;
export const { reducer } = TransactionSlice;
