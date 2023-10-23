import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { managerDataService } from '../services/managerService';
import axios from "axios";

export const createManager = createAsyncThunk(
  "managers/create",
  async (manager) => {
    try {
      // Trích xuất genreName từ mảng genres
      const genreName = manager.genres[0]?.genreName;
      // const url = manager.bookImages[0]?.url;
      // Tạo payload mới với genreName đã trích xuất
      const payload = {
        ...manager,
        genres: [{ genreName }],
      };

      const res = await axios.post(
        "https://secondhandbookstoreapi.azurewebsites.net/api/Books/Create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Manager/GetAll"
      );
      const data = response.data;
      console.log(response.data);
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Manager/Get?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get Manager:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const editmanager = createAsyncThunk(
  "managers/edit",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Manager/Update`, // Assuming you need to provide the customer ID for editing
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      return res.data;
    } catch (error) {
      console.error("Failed to update manager:", error.response);
      throw error.response.data;
    }
  }
);

export const updateStatusManager= createAsyncThunk(
  "managers/updateStatus",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Manager/Update`, // Assuming you need to provide the customer ID for editing
        data, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Đã Update status manager " + data);
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
      .addCase(editmanager.fulfilled, (state, action) => {
        state.managers = action.payload.data;
      })
      .addCase(editmanager.rejected, (state, action) => {
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
