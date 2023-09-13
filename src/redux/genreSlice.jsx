import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createGenres = createAsyncThunk(
  'products/createGenres',
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

export const getGenres = createAsyncThunk('products/getGenres', async () => {
  try {
    const response = await axios.get('https://secondhandbookstoreapi.azurewebsites.net/api/Genres');
    const data = response.data;
    const genreNames = data.map((genre) => genre.genreName); // Lấy giá trị genreName từ mỗi object trong mảng
    console.log(genreNames);
    return genreNames;
  } catch (error) {
    console.error('Failed to get genres:', error.response);
    throw error.response.data;
  }
});
// export const getGenresId = createAsyncThunk('products/getGenres', async ({id}) => {
//   try {
//     const response = await axios.get(`https://secondhandbookstoreapi.azurewebsites.net/api/Genres/${id}`);
//     const data = response.data;
//     const genreNames = data.map((genre) => genre.genreName); // Lấy giá trị genreName từ mỗi object trong mảng
//     console.log(genreNames);
//     return genreNames;
//   } catch (error) {
//     console.error('Failed to get genres:', error.response);
//     throw error.response.data;
//   }
// });
export const getGenresId = createAsyncThunk('products/getGenres', async ({ id }) => {
  try {
    const response = await axios.get(`https://secondhandbookstoreapi.azurewebsites.net/api/Genres/${id}`);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Failed to get genres:', error.response);
    throw error.response.data || error.message;
  }
});


const genreSlice = createSlice({
  name: 'genres',
  initialState: {
    genres: [],
    status: '',
  },
  reducers: {
    setGenres: (state, action) => {
      state.genres = action.payload;
    },
    updateGenres: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(
        (genre) => genre.bookId === updatedProduct.bookId
      );
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGenres.fulfilled, (state, action) => {
        state.products = state.products.concat(action.payload);
      })
      .addCase(getGenresId.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
  
  },
});
export const { setGenres, } = genreSlice.actions;
export default genreSlice.reducer;
export const { reducer } = genreSlice;
