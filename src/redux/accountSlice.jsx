import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const accessToken = localStorage.getItem("access_token");
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchaccounts",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Account/GetAll", // Send the account data with UUID
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      console.log("API Response:", response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error("Failed to retrieve accounts:", error);
      throw error;
    }
  }
);

export const createAccount = createAsyncThunk(
  "account/createAccounts",
  async (accountData) => {
    try {
      // Generate a UUID for the account
      const accountId = uuidv4();

      const accountWithId = {
        ...accountData,
        id: accountId, 
      };

      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Account/Create",
        accountWithId, 
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create account:", error.response);
      throw error.response.data;
    }
  }
);

export const getAccountEmail = createAsyncThunk(
  "account/getAccount",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Account/GetAll", 
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
      console.error("Failed to get emails:", error.response);
      throw error.response.data;
    }
  }
);

export const getAccountId = createAsyncThunk(
  "account/getAccountId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Account/Get?id=${id}`, // Send the account data with UUID
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
      console.error("Failed to get accounts ", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const editAccount = createAsyncThunk(
  "account/editAccount",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Account/Update`, 
        data, // Send the account data with UUID
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to update account:", error.response);
      throw error.response.data;
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState: {
    accounts: [], // Make sure this property is defined
    status: "",
  },
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
    })
      .addCase(fetchAccounts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.concat(action.payload);
      })
      .addCase(getAccountId.fulfilled, (state, action) => {
        state.accounts = action.payload.data;
      })
      .addCase(getAccountEmail.fulfilled, (state, action) => {
        state.accounts = action.payload.data;
      }).addCase(editAccount.fulfilled, (state, action) => {
        state.accounts = action.payload.data;
      })
  },
});
export const { setAccounts } = accountSlice.actions;
export default accountSlice.reducer;
export const { reducer } = accountSlice;
