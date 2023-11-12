import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { customerDataService } from '../services/customerService';
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
// Hàm lưu dữ liệu vào storage
const saveToStorage = (key, data) => {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData); // Dùng Local Storage
  // sessionStorage.setItem(key, jsonData); // Hoặc dùng Session Storage
};

// Hàm lấy dữ liệu từ storage
const getFromStorage = (key) => {
  const jsonData = localStorage.getItem(key); // Dùng Local Storage
  // const jsonData = sessionStorage.getItem(key); // Hoặc dùng Session Storage
  return jsonData ? JSON.parse(jsonData) : null;
};
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
            "Content-Type": "application/json",
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Customer/GetAll"
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
    
    const storageKey = "getCustomerId_" + id;;
    const storedData = getFromStorage(storageKey);

    if (storedData) {
      return storedData;
    }

    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Customer/Get?id=${id}`
      );
      const data = response.data;
      saveToStorage(storageKey, data); // Lưu dữ liệu mới vào Local Storage
      console.log(data)
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Customer/Get?id=${id}`
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Customer/Update`, // Assuming you need to provide the customer ID for editing
        data, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
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

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async ({ id }) => {
    try {
      const response = await axios.delete(
        `https://secondhandbookstoreapi.azurewebsites.net/api/Books/Delete/${id}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to delete customer:", error);
      throw error;
    }
  }
);

export const getBookById = createAsyncThunk(
  "customers/getcustomerId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://secondhandbookstoreapi.azurewebsites.net/api/Books/GetBook/${id}`
      );
      const bookData = response.data;
      return bookData;
    } catch (error) {
      console.error("Failed to fetch book data:", error);
      throw error;
    }
  }
);

// export const deleteAllcustomers = createAsyncThunk(
//   'customers/deleteAll',
//   async () => {
//     const res = await customerDataService.deleteAll();
//     return res.data;
//   }
// );

// export const findcustomersByTitle = createAsyncThunk(
//   'customers/findByBookName',
//   async ({ bookname }) => {
//     const res = await customerDataService.findByTitle(bookname);
//     return res.data;
//   }
// );
export const createGenres = createAsyncThunk(
  "customers/createGenres",
  async (genres) => {
    try {
      const res = await axios.post(
        "https://secondhandbookstoreapi.azurewebsites.net/api/Genres",
        JSON.stringify(genres),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create genres:", error.response);
      throw error.response.data;
    }
  }
);

export const getGenres = createAsyncThunk("customers/getGenres", async () => {
  try {
    const response = await axios.get(
      "https://secondhandbookstoreapi.azurewebsites.net/api/Genres"
    );
    const data = response.data;
    const genreNames = data.map((genre) => genre.genreName); // Lấy giá trị genreName từ mỗi object trong mảng
    console.log(genreNames);
    return genreNames;
  } catch (error) {
    console.error("Failed to get genres:", error.response);
    throw error.response.data;
  }
});

export const getGenresId = createAsyncThunk(
  "customers/getGenres",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://secondhandbookstoreapi.azurewebsites.net/api/Genres/${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get genres:", error.response);
      throw error.response.data || error.message;
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
