import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
export const fetchusers = createAsyncThunk(
  'users/fetchusers',
  async () => {
    try {
      const response = await axios.get(
        'https://secondhandbookstoreapi.azurewebsites.net/api/Users'
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (error) {
      console.error('Failed to retrieve users:', error);
      throw error;
    }
  }
);



// export const deleteTutorial = createAsyncThunk(
//   'users/delete',
//   async ({ id }) => {
//     await userDataService.delete(id);
//     return { id };
//   }
// );

export const createGenres = createAsyncThunk(
  'users/createGenres',
  async (genres) => {
    try {
      const res = await axios.post(
        'https://secondhandbookstoreapi.azurewebsites.net/api/Genres',
        JSON.stringify(genres),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error('Failed to create genres:', error.response);
      throw error.response.data;
    }
  }
);

export const getUserId = createAsyncThunk('products/getGenres', async ({ id }) => {
  try {
    const response = await axios.get(`https://secondhandbookstoreapi.azurewebsites.net/api/Users/${id}`);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Failed to get users:', error.response);
    throw error.response.data || error.message;
  }
});
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [], // Make sure this property is defined
    status: '',
  },
  reducers: {
    setusers: (state, action) => {
      state.users = action.payload;
    },
    // updateuser: (state, action) => {
    //   const updateduser = action.payload;
    //   const index = state.users.findIndex(
    //     (user) => user.bookId === updateduser.bookId
    //   );
    //   if (index !== -1) {
    //     state.users[index] = updateduser;
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchusers.fulfilled, (state, action) => {
      state.users = action.payload;
    })
      .addCase(fetchusers.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createGenres.fulfilled, (state, action) => {
        state.users = state.users.concat(action.payload);
      })
      .addCase(getUserId.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});
export const { setusers, } = userSlice.actions;
export default userSlice.reducer;
export const { reducer } = userSlice;


