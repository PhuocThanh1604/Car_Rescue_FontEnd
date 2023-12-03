import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const saveToStorage = (key, data) => {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData); 
};

// Hàm lấy dữ liệu từ storage
const getFromStorage = (key) => {
  const jsonData = localStorage.getItem(key); 
  return jsonData ? JSON.parse(jsonData) : null;
};
const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};

export const fetchWordWeeks = createAsyncThunk(
  "transactions/fetchWordWeeks",
  async () => {
    const storageKey = "getShiftOfDate";
    try {
      removeFromStorage(storageKey);
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Schedule/GetWorkWeeks"
      );
      const data = response.data;
      saveToStorage(storageKey, data);
      return data;
    } catch (error) {
      console.error("Failed to retrieve fetch fetchWordWeeks:", error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getShiftOfDate= createAsyncThunk(
  "transaction/getShiftOfDate",
  async ({ date }) => {
    console.log("tesst: "+date)
    const storageKey = "getShiftOfDate";
    try {
      removeFromStorage(storageKey);
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Schedule/GetShiftOfDate?date=${date}`
      );
     
      const data = response.data;
      saveToStorage(storageKey, data);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get getShiftOfDate ", error.response);
      throw error.response.data || error.message;
    }
  }
);

export const GetWorkWeeksByStartDate = createAsyncThunk(
  "transaction/GetWorkWeeksByStartDate",
  async ({ startdate }) => {
  
    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Schedule/GetWorkWeeksByStartDate?startdate=${startdate}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get schedule By startdate ", error.response);
      throw error.response.data || error.message;
    }
  }
);




const ScheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    schedules: [],
    status: "",
  },
  reducers: {
    setSchedules: (state, action) => {
      state.schedules = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWordWeeks.fulfilled, (state, action) => {
        state.schedules = action.payload.data;
      })
      .addCase(fetchWordWeeks.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getShiftOfDate.fulfilled, (state, action) => {
        state.scheduleData = action.payload.data;
      })
      .addCase(GetWorkWeeksByStartDate.fulfilled, (state, action) => {
        state.scheduleData = action.payload.data;
      });
  },
});
export const { setSchedules } = ScheduleSlice.actions;
export default ScheduleSlice.reducer;
export const { reducer } = ScheduleSlice;
