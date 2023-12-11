import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const accessToken = localStorage.getItem("access_token");

export const createAcceptWithdrawRequest = createAsyncThunk(
  "vehicles/createAcceptWithdrawRequest",
  async ({ id, boolean }) => {
    try {
      console.log(id, boolean);
      const response = await axios.post(
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/AcceptWithdrawRequest?id=${id}&boolean=${boolean}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetNewTransactions",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetAll",
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
      );
      console.log(response.data)
      const data = response.data;
      console.log(data.walletId);
      return data;
    } catch (error) {
      console.error("Failed to retrieve fetch Transactions All:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getTransactionOfWalletId = createAsyncThunk(
  "transaction/getTransactionOfWalletId",
  async ({ id }) => {
    if (!id) {
      return null; // Không cần gọi API nếu không có id
    }
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetTransactionOfWallet?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetByID?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
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
export const getRVOOfWallet = createAsyncThunk(
  "transaction/getRVOOfWallet",
  async ({ id }) => {
  
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Wallet/GetRVOOfWallet?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to get rescue car owner of wallet ", error.response);
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
      .addCase(fetchTransactionsAll.fulfilled, (state, action) => {
        state.transactions = action.payload.data;
      })
      .addCase(fetchTransactionsAll.pending, (state, action) => {
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
      })
      .addCase(getRVOOfWallet.fulfilled, (state, action) => {
        state.transactionsData = action.payload.data;
      });
  },
});
export const { setTransactions } = TransactionSlice.actions;
export default TransactionSlice.reducer;
export const { reducer } = TransactionSlice;
