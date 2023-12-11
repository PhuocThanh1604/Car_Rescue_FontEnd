import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { serviceDataService } from '../services/serviceService';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const accessToken = localStorage.getItem("access_token");
export const createService = createAsyncThunk(
  'services/createservices',
  async (service) => {
    try {
      const id = uuidv4();
      const serviceData = {
        ...service,
        id: id,
      };
      const res = await axios.post('https://rescuecapstoneapi.azurewebsites.net/api/Service/Create', serviceData ,{
        headers: {
          "Content-Type": "application/json",
          'Authorization':`${accessToken}`
        },
      }
      
      );
      return res.data;
    } catch (error) {
      console.error('Failed to create service :', error.response);
      throw error.response.data || error.message;
    }
  }
);
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    try {
      const response = await axios.get(
        'https://rescuecapstoneapi.azurewebsites.net/api/Service/GetAll',{
          headers: {
            "Content-Type": "application/json",
            'Authorization':`${accessToken}`
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Failed to retrieve service:', error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getServiceId = createAsyncThunk('service/getServiceId', async ({ id }) => {
  try {
    const response = await axios.get(`https://rescuecapstoneapi.azurewebsites.net/api/Service/Get?id=${id}`,{
      headers: {
        "Content-Type": "application/json",
        'Authorization':`${accessToken}`
      },
    }
    
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Failed to get service:', error.response);
    throw error.response.data || error.message;
  }
});
export const editService = createAsyncThunk(
  'services/edit',
  async ({ data }) => {
    try {

      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Service/Update`, 
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
      console.error('Failed to update service:', error.response);
      throw error.response.data || error.message;
    }
  }
);

//Symptom
export const createSymptom = createAsyncThunk(
  'services/createSymptom',
  async (symptom) => {
    try {
      const id = uuidv4();
      const symptomData = {
        ...symptom,
        id: id,
      };
      const res = await axios.post('https://rescuecapstoneapi.azurewebsites.net/api/Symptom/Create', symptomData ,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`${accessToken}`
        },
      });
      return res.data;
    } catch (error) {
      console.error('Failed to create symptom :', error.response);
      throw error.response.data || error.message;
    }
  }
);
export const fetchSymptom = createAsyncThunk(
  'services/fetchSymptom',
  async () => {
    try {
      const response = await axios.get(
        'https://rescuecapstoneapi.azurewebsites.net/api/Symptom/GetAllSymptom',
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
      console.error('Failed to retrieve symptom:', error.response);
      throw error.response.data || error.message;
    }
  }
);
export const getSymptomId = createAsyncThunk('service/getServiceId', async ({ id }) => {
  try {
    const response = await axios.get(`https://rescuecapstoneapi.azurewebsites.net/api/Symptom/Get?id=${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`${accessToken}`
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Failed to get Symptom by Id :', error.response);
    throw error.response.data || error.message;
  }
});
export const editSymptom = createAsyncThunk(
  'services/edit',
  async ({ data }) => {
    try {

      const res = await axios.put(
        `https://rescuecapstoneapi.azurewebsites.net/api/Symptom/Update`,
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
      console.error('Failed to update symptom:', error.response);
      throw error.response.data || error.message;
    }
  }
);


const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    services: [],
    status: '',
  },
  reducers: {
    setservices: (state, action) => {
      state.services = action.payload.data;
    }, 
    updateservices: (state, action) => {
      const updatedservice = action.payload;
      const index = state.services.findIndex(
        (service) => service.bookId === updatedservice.bookId
      );
      if (index !== -1) {
        state.services[index] = updatedservice;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload.data;
      })
      .addCase(fetchServices.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload.data);
      })
      .addCase(createService.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createService.rejected, (state, action) => {
        state.status = 'error';
      })
      .addCase(editService.fulfilled, (state, action) => {
        state.services = action.payload.data;
      })
      .addCase(editService.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editService.rejected, (state, action) => {
        state.status = 'error';
      })
      .addCase(getServiceId.fulfilled, (state, action) => {
        state.serviceData = action.payload.data;
      })
.addMatcher(
        (action) => action.type.includes('Symptom'),
        (state, action) => {
          if (action.type.endsWith('/fulfilled')) {
            state.services = action.payload.data;
          } else if (action.type.endsWith('/pending')) {
            state.status = 'loading';
          } else if (action.type.endsWith('/rejected')) {
            state.status = 'error';
          }
        }
      )
  },
});
export const { setServices } = serviceSlice.actions;
export default serviceSlice.reducer;
export const { reducer } = serviceSlice;
