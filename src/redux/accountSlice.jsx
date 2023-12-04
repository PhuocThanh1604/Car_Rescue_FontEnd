import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchaccounts',
  async () => {
    try {
      const response = await axios.get(
        'https://secondhandbookstoreapi.azurewebsites.net/api/accounts'
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (error) {
      console.error('Failed to retrieve accounts:', error);
      throw error;
    }
  }
);

export const createAccount = createAsyncThunk('account/createAccounts', async (accountData) => {
  try {
    // Generate a UUID for the account
    const accountId = uuidv4();
    
    // Create an object with the UUID and other data
    const accountWithId = {
      ...accountData,
      id: accountId, // Add the UUID to your account data
    };

    const res = await axios.post(
      'https://rescuecapstoneapi.azurewebsites.net/api/Account/Create',
      accountWithId, // Send the account data with UUID
      {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization':`Bearer ${}`
        },
      }
    );
    console.log("test"+accountWithId)
    return res.data;
  } catch (error) {
    console.error('Failed to create account:', error.response);
    throw error.response.data;
  }
});

export const getAccountEmail = createAsyncThunk('account/getAccount', async () => {
  try {
    const response = await axios.get('https://rescuecapstoneapi.azurewebsites.net/api/Account/GetAll');
    const data = response.data;
    console.log(response.data);
    return data;
  } catch (error) {
    console.error('Failed to get emails:', error.response);
    throw error.response.data;
  }
});



export const getAccountId = createAsyncThunk(
  "account/getAccountId",
  async ({ id }) => {

    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Account/Get?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get accounts ", error.response);
      throw error.response.data || error.message;
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [], // Make sure this property is defined
    status: '',
  },
  reducers: {
    setaccounts: (state, action) => {
      state.accounts = action.payload.data;
    },
    // updateaccount: (state, action) => {
    //   const updatedaccount = action.payload;
    //   const index = state.accounts.findIndex(
    //     (account) => account.bookId === updatedaccount.bookId
    //   );
    //   if (index !== -1) {
    //     state.accounts[index] = updatedaccount;
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAccounts.fulfilled, (state, action) => {
      state.accounts = action.payload;
    })
      .addCase(fetchAccounts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.concat(action.payload);
      })
      .addCase(getAccountId.fulfilled, (state, action) => {
        state.accounts = action.payload.data;
      })
      .addCase(getAccountEmail.fulfilled, (state, action) => {
        state.accounts = action.payload.data;
      });
  },
});
export const { setaccounts, } = accountSlice.actions;
export default accountSlice.reducer;
export const { reducer } = accountSlice;


