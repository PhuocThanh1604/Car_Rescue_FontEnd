import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductDataService } from '../services/productService';
import axios from 'axios';
// const { URL } = window;
// export const createProduct = createAsyncThunk(
//   'products/create',
//   async (product) => {
//     try {
//       // Trích xuất genreName từ mảng genres
//       const genreName = product.genres[0]?.genreName;

//       // Tạo payload mới với genreName đã trích xuất
//       const payload = {
//         ...product,
//         genres: [{ genreName }],
//       };

//       // Chuyển đổi các tệp ảnh thành URL
//       // const bookImages = Array.from(payload.bookImages).map((image) => ({
//       //   url: URL.createObjectURL(image),
//       // }));

//       const convertedPayload = {
//         ...payload,
//         bookImages: bookImages,
//       };

//       const res = await axios.post(
//         'https://secondhandbookstoreapi.azurewebsites.net/api/Books/Create',
//         convertedPayload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       return res.data;
//     } catch (error) {
//       console.error('Failed to create product:', error.response);
//       throw error.response.data;
//     }
//   }
// );
export const createProduct = createAsyncThunk(
  'products/create',
  async (product) => {
    try {
      
      // Trích xuất genreName từ mảng genres
      const genreName = product.genres[0]?.genreName;
      // const url = product.bookImages[0]?.url;
      // Tạo payload mới với genreName đã trích xuất
      const payload = {
        ...product,
        genres: [{ genreName }],
      };

      const res = await axios.post(
        'https://secondhandbookstoreapi.azurewebsites.net/api/Books/Create',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error('Failed to create product:', error.response);
      throw error.response.data;
    }
  }
);
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {
      const response = await axios.get(
        'https://secondhandbookstoreapi.azurewebsites.net/api/Books/GetList'
      );
      const data = response.data;
      console.log(response.data);
      return data;
    } catch (error) {
      console.error('Failed to retrieve products:', error);
      throw error;
    }
  }
);
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async ({ id }) => {
    try {
      const response = await axios.delete(`https://secondhandbookstoreapi.azurewebsites.net/api/Books/Delete/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }
);
// export const editProduct = createAsyncThunk(
//   'products/edit',
//   async ({ id, data }) => {
//     try {
//       const { bookImages, ...otherData } = data;

//       const updatedData = {
//         ...otherData,
//         bookImages: bookImages.map(image => image.url),
//       };

//       const res = await axios.put(
//         `https://secondhandbookstoreapi.azurewebsites.net/api/Books/Update/${id}`,
//         JSON.stringify(updatedData),
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       return res.data;
//     } catch (error) {
//       console.error('Failed to update product:', error);
//       throw error;
//     }
//   }
// );


export const editProduct = createAsyncThunk(
  'products/edit',
  async ({ id, data }) => {
    try {
      
      const res = await axios.put(
        `https://secondhandbookstoreapi.azurewebsites.net/api/Books/Update/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }
);
export const getBookById = createAsyncThunk('products/getProductId', async ({ id }) => {
  try {
    const response = await axios.get(
      `https://secondhandbookstoreapi.azurewebsites.net/api/Books/GetBook/${id}`
    );
    const bookData = response.data;
    return bookData;
  } catch (error) {
    console.error('Failed to fetch book data:', error);
    throw error;
  }
});

export const deleteAllproducts = createAsyncThunk(
  'products/deleteAll',
  async () => {
    const res = await ProductDataService.deleteAll();
    return res.data;
  }
);

export const findproductsByTitle = createAsyncThunk(
  'products/findByBookName',
  async ({ bookname }) => {
    const res = await ProductDataService.findByTitle(bookname);
    return res.data;
  }
);
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


const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    status: '',
     bookData: null, 
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(
        (product) => product.bookId === updatedProduct.bookId
      );
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products = state.products.concat(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product.bookId === updatedProduct.bookId
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const deletedProductId = action.payload;
        state.products = state.products.filter(
          (product) => product.bookId !== deletedProductId
        );
      })
      .addCase(deleteAllproducts.fulfilled, (state, action) => {
        state.products = [];
      })
      .addCase(findproductsByTitle.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(createGenres.fulfilled, (state, action) => {
        state.products = state.products.concat(action.payload);
      })
      .addCase(getGenresId.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.bookData = action.payload; 
      });
  },
});
export const { setProducts, } = productSlice.actions;
export default productSlice.reducer;
export const { reducer } = productSlice;
