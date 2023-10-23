import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { serviceDataService } from '../services/serviceService';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
export const createService = createAsyncThunk(
  'services/createservices',
  async (service) => {
    try {
      const id = uuidv4();
      const serviceData = {
        ...service,
        id: id,
      };
      const res = await axios.post('https://rescuecapstoneapi.azurewebsites.net/api/Service/Create', serviceData , {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
        'https://rescuecapstoneapi.azurewebsites.net/api/Service/GetAll'
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
    const response = await axios.get(`https://rescuecapstoneapi.azurewebsites.net/api/Service/Get?id=${id}`);
    const data = response.data;
    console.log(data);
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
        `https://rescuecapstoneapi.azurewebsites.net/api/Service/Update`, // Assuming you need to provide the customer ID for editing
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("dữ liệu đã sửa service đã gửi" +data)
      return res.data;
    } catch (error) {
      console.error('Failed to update service:', error.response);
      throw error.response.data || error.message;
    }
  }
);
export const deleteService = createAsyncThunk(
  'services/delete',
  async ({ id }) => {
    try {
      const response = await axios.delete(`https://secondhandbookstoreapi.azurewebsites.net/api/Books/Delete/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Failed to delete service:', error.response);
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
    
  },
});
export const { setservices, } = serviceSlice.actions;
export default serviceSlice.reducer;
export const { reducer } = serviceSlice;
