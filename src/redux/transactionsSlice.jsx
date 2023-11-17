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
export const createTransaction = createAsyncThunk(
  "transactions/createTransactions",
  async (transaction) => {
    try {
      const id = uuidv4();
      const TransactionData = {
        ...transaction,
        id: id,
      };
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Transaction/Create",
        TransactionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create Transaction :", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Transaction/GetAll"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve Transaction:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getTransactionId = createAsyncThunk(
  "transaction/getTransactionId",
  async ({ id }) => {
    const storageKey = "getTransactionId" + id;
    const storedData = getFromStorage(storageKey);
    if (storedData) {
      return storedData;
    }
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Transaction/Get?id=${id}`
      );
      const data = response.data;
      saveToStorage(storageKey, data);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get customer:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getScheduleOfTechinciansAWeek = createAsyncThunk(
  "transaction/getScheduleOfTechinciansAWeek",
  async ({ year }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Schedule/GetWeeksByYear?year=${year}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error(
        "Failed to get Schedule Of Techincians A Week:",
        error.response
      );
      throw error.response.data || error.message;
    }
  }
);



const TransactionSlice = createSlice({
  name: "Transaction",
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
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.data;
      })
      .addCase(fetchTransactions.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getScheduleOfTechinciansAWeek.fulfilled, (state, action) => {
        state.transactions = action.payload.data;
      })
      .addCase(getScheduleOfTechinciansAWeek.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload.data);
      })
      .addCase(createTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getTransactionId.fulfilled, (state, action) => {
        state.transactions = action.payload.data;
      });
  },
});
export const { setTransactions } = TransactionSlice.actions;
export default TransactionSlice.reducer;
export const { reducer } = TransactionSlice;
