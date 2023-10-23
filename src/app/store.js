import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import accountReducer from "../redux/accountSlice"
import orderReducer from "../redux/orderSlice";
import productReducer from "../redux/productSlice";
import customerReducer from "../redux/customerSlice";
import managerReducer from "../redux/managerSlice";
import rescueVehicleOwnerReducer from "../redux/rescueVehicleOwnerSlice";
import technicianReducer from "../redux/technicianSlice";
import serviceReducer from "../redux/serviceSlice";
import vehicleReducer from "../redux/vehicleSlice";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    product: productReducer,
    order: orderReducer,
    account: accountReducer,
    customer: customerReducer,
    manager: managerReducer,
    rescueVehicleOwner: rescueVehicleOwnerReducer,
    technician:technicianReducer,
    service: serviceReducer,
    vihicle: vehicleReducer,
    // auth:authSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

