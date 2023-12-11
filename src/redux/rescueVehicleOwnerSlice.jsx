import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const accessToken = localStorage.getItem("access_token");
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
            'Authorization':`${accessToken}`
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
        "https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/GetAll",
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
      console.error("Failed to retrieve rescueVehicleOwner:", error);
      throw error;
    }
  }
);

export const getRescueVehicleOwnerId = createAsyncThunk(
  "rescueVehicleOwner/getRescueVehicleOwnerId",
  async ({ id }) => {

    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Get?id=${id}`,
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
        `https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Update`,
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
        `https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Update`, 
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Report/GetAllNew", // Send the edited customer data
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Report/GetAll", // Send the edited customer data
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Report/Get?id=${id}`, // Send the edited customer data
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
