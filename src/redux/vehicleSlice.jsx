import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
export const createRescueVehicleOwner = createAsyncThunk(
  "vehicles/createRescueVehicleOwners",
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

export const fetchVehicle = createAsyncThunk(
  "vehicles/fetchVehicle",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Vehicle/GetAll"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve fetch Vehicle:", error);
      throw error.response.data || error.message;
    }
  }
);
export const fetchVehicleWatting = createAsyncThunk(
  "vehicles/fetchVehicleWatting",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Vehicle/GetWaiting"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve fetch Vehicle Watting:", error);
      throw error.response.data || error.message;
    }
  }
);

export const getVehicleId = createAsyncThunk(
  "vehicles/getVehicleId",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Vehicle/Get?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get  Vehicle ", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const editRescueVehicleOwner = createAsyncThunk(
  "vehicles/edit",
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
      throw error.response.data;
    }
  }
);
export const updateStatusRescueVehicleOwner = createAsyncThunk(
  "vehicles/updateStatus",
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
      throw error.response.data;
    }
  }
);

export const deleteRescueVehicleOwner = createAsyncThunk(
  "vehicles/delete",
  async ({ id }) => {
    try {
      const response = await axios.post(
        `https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Delete?id=${id}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to delete rescueVehicleOwner:", error);
      throw error;
    }
  }
);
export const createAcceptRegisterVehicle = createAsyncThunk(
  "vehicles/createAcceptRegisterVehicle",
  async ({ id, isAccepted }) => {
    try {
      const response = await axios.post(
        `https://rescuecapstoneapi.azurewebsites.net/api/Vehicle/ApproveVehicle?id=${id}&boolean=${isAccepted}`,
      );

      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error(
        "Failed to create Accept Register Vehicle:",
        error.response
      );
      throw error.response.data || error.message;
    }
  }
);

const rescueVehicleOwnerSlice = createSlice({
  name: "vehicle",
  initialState: {
    vehicles: [],
    status: "",
  },
  reducers: {
    setrescueVehicleOwners: (state, action) => {
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
      .addCase(fetchVehicle.fulfilled, (state, action) => {
        state.vehicles = action.payload.data;
      })
      .addCase(fetchVehicle.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchVehicleWatting.fulfilled, (state, action) => {
        state.technicians = action.payload.data;
      })
      .addCase(fetchVehicleWatting.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createRescueVehicleOwner.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
      })
      .addCase(createRescueVehicleOwner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRescueVehicleOwner.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(editRescueVehicleOwner.fulfilled, (state, action) => {
        state.vehicles = action.payload.data;
      })
      .addCase(editRescueVehicleOwner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editRescueVehicleOwner.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(updateStatusRescueVehicleOwner.fulfilled, (state, action) => {
        state.vehicles = action.payload.data;
      })
      .addCase(updateStatusRescueVehicleOwner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStatusRescueVehicleOwner.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getVehicleId.fulfilled, (state, action) => {
        state.vehicles = action.payload.data;
      })
      .addCase(createAcceptRegisterVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
      })
      .addCase(createAcceptRegisterVehicle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAcceptRegisterVehicle.rejected, (state, action) => {
        state.status = "error";
      });
  },
});
export const { updateRescueVehicleOwnerStatus } =
  rescueVehicleOwnerSlice.actions;
export const { setrescueVehicleOwners } = rescueVehicleOwnerSlice.actions;
export default rescueVehicleOwnerSlice.reducer;
export const { reducer } = rescueVehicleOwnerSlice;
