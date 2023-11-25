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
export const createModelCar = createAsyncThunk(
  "modelCar/createModelCar",
  async (modelCar) => {
    try {
      console.log(modelCar)
      const id = uuidv4();
      const modelCarData = {
        ...modelCar,
        id: id,
      };
      console.log(modelCarData)
      const res = await axios.post(
        "https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Create",
        modelCarData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to create model Car of customer:", error.response);
      throw error.response.data;
    }
  }
);

export const fetchModelCar = createAsyncThunk(
  "modelCar/fetchModelCar",
  async () => {
    try {
      const response = await axios.get(
        "https://rescuecapstoneapi.azurewebsites.net/api/Model/GetAll"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Failed to retrieve model Car:", error);
      throw error;
    }
  }
);

export const getModelCarId = createAsyncThunk(
  "modelCar/getModelCarId",
  async ({ id }) => {

    try {
      const response = await axios.get(
        `https://rescuecapstoneapi.azurewebsites.net/api/Model/Get?id=${id}`
      );
      const data = response.data;
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to get model car ", error.response);
      throw error.response.data || error.message;
    }
  }
);

// export const editRescueVehicleOwner = createAsyncThunk(
//   "modelCars/edit",
//   async ({ data }) => {
//     try {
//       const res = await axios.put(
//         `https://rescuecapstoneapi.azurewebsites.net/api/RescueVehicleOwner/Update`, // Assuming you need to provide the customer ID for editing
//         data, // Send the edited customer data
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("dữ liệu đã sửa carowner " + data);
//       return res.data;
//     } catch (error) {
//       console.error("Failed to update RescueVehicleOwner:", error.response);
//       throw error.response.data || error.message;
//     }
//   }
// );
export const updateModelCar = createAsyncThunk(
  "modelCars/updateModelCar",
  async ({ data }) => {
    try {
      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Model/Update`, // Assuming you need to provide the customer ID for editing
        data, // Send the edited customer data
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("dữ liệu đã sửa update car model" + data);
      return res.data;
    } catch (error) {
      console.error("Failed to update car model:", error.response);
      throw error.response.data || error.message;
    }
  }
);


const modelCarSlice = createSlice({
  name: "modelCar",
  initialState: {
    modelCar: [],
    status: "",
  },
  reducers: {
    setModelCar: (state, action) => {
      state.modelCar = action.payload.data;
    },
    updateModelCar: (state, action) => {
      const { id, newStatus } = action.payload;
      // Update the status of the specific RescueVehicleOwner
      return state.map((modelCar) => {
        if (modelCar.id === id) {
          return { ...modelCar, status: newStatus };
        }
        return modelCar;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModelCar.fulfilled, (state, action) => {
        state.modelCar= action.payload.data;
      })
      .addCase(fetchModelCar.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createModelCar.fulfilled, (state, action) => {
        state.modelCar.push(action.payload);
      })
      .addCase(createModelCar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createModelCar.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(updateModelCar.fulfilled, (state, action) => {
        state.modelCar = action.payload.data;
      })
      .addCase(updateModelCar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateModelCar.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getModelCarId.fulfilled, (state, action) => {
        state.modelCarData = action.payload.data;
      })
  },
});
export const { updateModalCar } = modelCarSlice.actions;
export const { setModelCar } = modelCarSlice.actions;
export default modelCarSlice.reducer;
export const { reducer } = modelCarSlice;
