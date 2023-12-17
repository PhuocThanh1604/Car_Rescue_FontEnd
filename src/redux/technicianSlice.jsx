import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const accessToken = localStorage.getItem("access_token");
export const createTechnician = createAsyncThunk(
  "technicians/createTechnicians",
  async (technician) => {
    try {
      const id = uuidv4();
      const technicianData = {
        ...technician,
        id: id,
      };
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/Technician/Create",
        technicianData,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept ",
            "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE",
            "Access-Control-Max-Age": 3600,
            'Authorization':`${accessToken}`
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create technician :", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const fetchTechnicians = createAsyncThunk(
  "technicians/fetchTechnicians",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Technician/GetAll",
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
      console.error("Failed to retrieve technician:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getTechnicianId = createAsyncThunk(
  "technician/getTechnicianId",
  async ({ id }) => {

    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Technician/Get?id=${id}`,
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
export const getScheduleOfTechinciansAWeek = createAsyncThunk(
  "technician/getScheduleOfTechinciansAWeek",
  async ({ year }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Schedule/GetWeeksByYear?year=${year}`,
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
      console.error(
        "Failed to get Schedule Of Techincians A Week:",
        error.response
      );
      throw error.response.data || error.message;
    }
  }
);
export const editTechnician = createAsyncThunk(
  "technicians/edit",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Technician/Update`, // Assuming you need to provide the customer ID for editing
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
      console.error("Failed to update Technicians:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getLocationTechnician = createAsyncThunk(
  "technicians/getLocationTechnician",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Location/GetLocation?id=${id}`,
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
      console.error("Failed to get location of technician:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getAllLocationTechnician = createAsyncThunk(
  "technicians/getAllLocationTechnician",
  async () => {
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Location/GetAllLocation`,
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
      console.error("Failed to get location of technician:", error.response);
      throw error.response.data || error.message;
    }
  }
);

const technicianSlice = createSlice({
  name: "technician",
  initialState: {
    technicians: [],
    status: "",
  },
  reducers: {
    setTechnicians: (state, action) => {
      state.technicians = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTechnicians.fulfilled, (state, action) => {
        state.technicians = action.payload.data;
      })
      .addCase(fetchTechnicians.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getScheduleOfTechinciansAWeek.fulfilled, (state, action) => {
        state.technicians = action.payload.data;
      })
      .addCase(getScheduleOfTechinciansAWeek.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createTechnician.fulfilled, (state, action) => {
        state.technicians.push(action.payload.data);
      })
      .addCase(createTechnician.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTechnician.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(editTechnician.fulfilled, (state, action) => {
        state.technicians = action.payload.data;
      })
      .addCase(editTechnician.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getTechnicianId.fulfilled, (state, action) => {
        state.technicianData = action.payload.data;
      })
      .addCase(getLocationTechnician.fulfilled, (state, action) => {
        state.technicianData = action.payload.data;
      }).addCase(getAllLocationTechnician.fulfilled, (state, action) => {
        state.technicianData = action.payload.data;
      });
  },
});
export const { setTechnicians } = technicianSlice.actions;
export default technicianSlice.reducer;
export const { reducer } = technicianSlice;
