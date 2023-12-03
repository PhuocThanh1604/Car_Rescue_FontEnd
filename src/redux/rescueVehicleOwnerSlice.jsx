import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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
export const createRescueVehicleOwner = createAsyncThunk(
  "rescueVehicleOwners/createRescueVehicleOwners",
  async (rescueVehicleOwner) => {
    try {
      const id = uuidv4();
      const rescueVehicleOwnerData = {
        ...rescueVehicleOwner,
        id: id,
      };
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Create",
        rescueVehicleOwnerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create rescueVehicleOwner:", error.response);
      throw error.response.data;
    }
  }
);

export const fetchRescueVehicleOwners = createAsyncThunk(
  "rescueVehicleOwners/fetchRescueVehicleOwners",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/GetAll"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve rescueVehicleOwner:", error);
      throw error;
    }
  }
);

export const getRescueVehicleOwnerId = createAsyncThunk(
  "rescueVehicleOwner/getRescueVehicleOwnerId",
  async ({ id }) => {
    const storageKey = "getRescueVehicleOwnerId_" + id;
    const storedData = getFromStorage(storageKey);
    if (storedData) {
      return storedData;
    }
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Get?id=${id}`
      );
      const data = response.data;
      saveToStorage(storageKey, data);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get Rescue Vehicle Owner ", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const editRescueVehicleOwner = createAsyncThunk(
  "rescueVehicleOwners/edit",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Update`, // Assuming you need to provide the customer ID for editing
        data, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("dữ liệu đã sửa carowner " + data);
      return res.data;
    } catch (error) {
      console.error("Failed to update RescueVehicleOwner:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const updateStatusRescueVehicleOwner = createAsyncThunk(
  "rescueVehicleOwners/updateStatus",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Update`, // Assuming you need to provide the customer ID for editing
        data, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("dữ liệu đã sửa updateStatusRescueVehicleOwner " + data);
      return res.data;
    } catch (error) {
      console.error("Failed to update RescueVehicleOwner:", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const getReportAllNew = createAsyncThunk(
  "rescueVehicleOwners/getReportAllNew",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Report/GetAllNew"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve get all report new:", error);
      throw error;
    }
  }
);
export const getReportAll = createAsyncThunk(
  "rescueVehicleOwners/getReportAll",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Report/GetAll"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve get all report:", error);
      throw error;
    }
  }
);
export const getReportById = createAsyncThunk(
  "rescueVehicleOwner/getReportById",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Report/Get?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error(
        "Failed to get report Rescue Vehicle Owner by Id ",
        error.response
      );
      throw error.response.data || error.message;
    }
  }
);
export const acceptReport = createAsyncThunk(
  "vehicles/acceptReport",
  async ({ id, boolean }) => {
    try {
      console.log(id, boolean);
      const response = await axios.post(
        `https://rescuecapstoneapi.azurewebsites.net/api/Report/Accept?id=${id}&boolean=${boolean}`,
      );

      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error(
        "Failed to create Accept Report of RVO:",
        error.response
      );
      throw error.response.data || error.message;
    }
  }
);
const rescueVehicleOwnerSlice = createSlice({
  name: "rescueVehicleOwner",
  initialState: {
    rescueVehicleOwners: [],
    status: "",
  },
  reducers: {
    setRescueVehicleOwners: (state, action) => {
      state.rescueVehicleOwners = action.payload.data;
    },
    updateRescueVehicleOwnerStatus: (state, action) => {
      const { id, newStatus } = action.payload;
      // Update the status of the specific RescueVehicleOwner
      return state.map((rescueVehicleOwner) => {
        if (rescueVehicleOwner.id === id) {
          return { ...rescueVehicleOwner, status: newStatus };
        }
        return rescueVehicleOwner;
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRescueVehicleOwners.fulfilled, (state, action) => {
        state.rescueVehicleOwners = action.payload.data;
      })
      .addCase(fetchRescueVehicleOwners.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReportAll.fulfilled, (state, action) => {
        state.rescueVehicleOwners = action.payload.data;
      })
      .addCase(getReportAll.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getReportAllNew.fulfilled, (state, action) => {
        state.rescueVehicleOwners = action.payload.data;
      })
      .addCase(getReportAllNew.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createRescueVehicleOwner.fulfilled, (state, action) => {
        state.rescueVehicleOwners.push(action.payload);
      })
      .addCase(createRescueVehicleOwner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRescueVehicleOwner.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(editRescueVehicleOwner.fulfilled, (state, action) => {
        state.rescueVehicleOwners = action.payload.data;
      })
      .addCase(editRescueVehicleOwner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editRescueVehicleOwner.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(updateStatusRescueVehicleOwner.fulfilled, (state, action) => {
        state.rescueVehicleOwners = action.payload.data;
      })
      .addCase(updateStatusRescueVehicleOwner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStatusRescueVehicleOwner.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getRescueVehicleOwnerId.fulfilled, (state, action) => {
        state.rescueVehicleOwnerData = action.payload.data;
      })
      .addCase(getReportById.fulfilled, (state, action) => {
        state.rescueVehicleOwnerData = action.payload.data;
      });
  },
});
export const { updateRescueVehicleOwnerStatus } =
  rescueVehicleOwnerSlice.actions;
export const { setRescueVehicleOwners } = rescueVehicleOwnerSlice.actions;
export default rescueVehicleOwnerSlice.reducer;
export const { reducer } = rescueVehicleOwnerSlice;
