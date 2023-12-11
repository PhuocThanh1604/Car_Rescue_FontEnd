import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { managerDataService } from '../services/managerService';
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const accessToken = localStorage.getItem("access_token");
export const createManager = createAsyncThunk(
  "managers/create",
  async (manager) => {
    try {
      const id = uuidv4();
      const managerData = {
        ...manager,
        id: id,
      };
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Manager/Create",
        managerData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create manager:", error.response);
      throw error.response.data;
    }
  }
);
export const fetchManagers = createAsyncThunk(
  "managers/fetchManagers",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Manager/GetAll",
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
      console.error("Failed to retrieve manager:", error);
      throw error;
    }
  }
);

export const getManagerId = createAsyncThunk(
  "manager/getManagerId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Manager/Get?id=${id}`,
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
      console.error("Failed to get Manager:", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const editManager = createAsyncThunk(
  "managers/edit",
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Manager/Update`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to update manager: ", error.response);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const updateStatusManager= createAsyncThunk(
  "managers/updateStatus",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Manager/Update`, // Assuming you need to provide the customer ID for editing
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to update status manager:", error.response);
      throw error.response.data;
    }
  }
);
const managerSlice = createSlice({
  name: "manager",
  initialState: {
    managers: [],
    status: "",
  },
  reducers: {
    setmanagers: (state, action) => {
      state.managers = action.payload.data;
    },
    updateManagerStatus: (state, action) => {
      const { id, newStatus } = action.payload;
      // Update the status of the specific RescueVehicleOwner
      return state.map((manager) => {
        if (manager.id === id) {
          return { ...manager, status: newStatus };
        }
        return manager;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.managers = action.payload.data;
      })
      .addCase(fetchManagers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(editManager.fulfilled, (state, action) => {
        state.managers = action.payload.data;
      })
      .addCase(editManager.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getManagerId.fulfilled, (state, action) => {
        state.managerData = action.payload.data;
      })
      .addCase(createManager.fulfilled, (state, action) => {
        state.managers.push(action.payload.data);
      })
      .addCase(createManager.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createManager.rejected, (state, action) => {
        state.status = "error";
      }).addCase(updateStatusManager.fulfilled, (state, action) => {
        state.rescueVehicleOwners = action.payload.data;
      })
      .addCase(updateStatusManager.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStatusManager.rejected, (state, action) => {
        state.status = "error";
      })
  },
});
export const { setmanagers } = managerSlice.actions;
export default managerSlice.reducer;
export const { reducer } = managerSlice;
