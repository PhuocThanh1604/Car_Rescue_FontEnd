import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const accessToken = localStorage.getItem("access_token");
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Model/Create",
        modelCarData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
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
        "https://rescuecapstoneapi.azurewebsites.net/api/Model/GetAll",
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Model/Get?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;

      return data;
    }  catch (response) {
      console.error(
        "Failed to retrieve car:",
        response.status,
        response.message
      );
      throw response.status || response.message;
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
      console.error("Failed to update car model:", error.response);
      throw error.response.data || error.message;
    }
  }
);


const modelCarSlice = createSlice({
  name: "modelCar",
  initialState: {
    modelCars: [],
    status: "",
  },
  reducers: {
    setModelCar: (state, action) => {
      state.modelCars = action.payload.data;
    },
    // updateModelCar: (state, action) => {
    //   const { id, newStatus } = action.payload;
    //   // Update the status of the specific RescueVehicleOwner
    //   return state.map((modelCar) => {
    //     if (modelCar.id === id) {
    //       return { ...modelCar, status: newStatus };
    //     }
    //     return modelCar;
    //   });
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModelCar.fulfilled, (state, action) => {
        state.modelCars= action.payload.data;
      })
      .addCase(fetchModelCar.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createModelCar.fulfilled, (state, action) => {
        state.modelCars.push(action.payload);
      })
      .addCase(createModelCar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createModelCar.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(updateModelCar.fulfilled, (state, action) => {
        state.modelCars = action.payload.data;
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
