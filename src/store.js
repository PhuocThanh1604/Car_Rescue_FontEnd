import { configureStore } from '@reduxjs/toolkit';
import  productReducer from './redux/productSlice';
import  orderReducer from './redux/orderSlice';
import  userReducer from './redux/userSlice';
import  genreReducer from './redux/genreSlice';
import authSlice from './redux/authSlice';


const store = configureStore({
  reducer: {
    product: productReducer,
    order: orderReducer,
    user: userReducer,
    genre: genreReducer,
    auth:authSlice
  },
});

export default store;
