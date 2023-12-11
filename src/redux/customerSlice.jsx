import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { customerDataService } from '../services/customerService';
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const accessToken = localStorage.getItem("access_token");
export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (customer) => {
    try {
      const id = uuidv4();
      const customerData = {
        ...customer,
        id: id,
      };
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Customer/Create",
        customerData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create customer:", error.response);
      throw error.response.data;
    }
  }
);

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Customer/GetAll",
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
      console.error("Failed to retrieve customer:", error.response);
      throw error.response.data || error.message;
    }
  }
);

// export const getCustomerId = createAsyncThunk(
//   "customer/getCustomerId",
//   async ({ id }) => {
//     try {
//       const response = await axios.get(
//         `https://rescuecapstoneapi.azurewebsites.net/api/Customer/Get?id=${id}`
//       );
//       const data = response.data;
//       console.log(data);
//       return data;
//     } catch (error) {
//       console.error("Failed to get customer:", error.response);
//       throw error.response.data || error.message;
//     }
//   }
// );

export const getCustomerId = createAsyncThunk(
  "customer/getCustomerId",
  async ({id}) => {
    console.log(id);

    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Customer/Get?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
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

export const getCustomerIdFullName = createAsyncThunk(
  "customer/getCustomerIdFullName",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Customer/Get?id=${id}`,
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
      console.error("Failed to get customer:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const editCustomer = createAsyncThunk(
  "customers/edit",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Customer/Update`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to update customer:", error.response);
      throw error.response.data;
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    status: "",
  },
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload.data;
    },
    updateCustomer: (state, action) => {
      const updatedCustomer = action.payload;
      const index = state.customers.findIndex(
        (customer) => customer.bookId === updatedCustomer.bookId
      );
      if (index !== -1) {
        state.customers[index] = updatedCustomer;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers = action.payload.data;
      })
      .addCase(fetchCustomers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.customers = action.payload.data;
      })
      .addCase(getCustomerId.fulfilled, (state, action) => {
        state.customerData = action.payload.data;
      })
      .addCase(getCustomerIdFullName.fulfilled, (state, action) => {
        state.customerData = action.payload.data;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.status = "error";
      })
  },
});
export const { setcustomers, updateCustomer } = customerSlice.actions;
export default customerSlice.reducer;
export const { reducer } = customerSlice;
