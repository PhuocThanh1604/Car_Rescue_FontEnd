import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import accountReducer from "../redux/accountSlice"
import orderReducer from "../redux/orderSlice";
import customerReducer from "../redux/customerSlice";
import managerReducer from "../redux/managerSlice";
import rescueVehicleOwnerReducer from "../redux/rescueVehicleOwnerSlice";
import technicianReducer from "../redux/technicianSlice";
import serviceReducer from "../redux/serviceSlice";
import vehicleReducer from "../redux/vehicleSlice";
import transactionReducer from "../redux/transactionsSlice";
import paymentReducer from "../redux/transactionsSlice";
import scheduleReducer from "../redux/transactionsSlice";
import modelCarReducer from "../redux/transactionsSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    order: orderReducer,
    account: accountReducer,
    customer: customerReducer,
    manager: managerReducer,
    rescueVehicleOwner: rescueVehicleOwnerReducer,
    technician:technicianReducer,
    service: serviceReducer,
    vehicle: vehicleReducer,
    transaction: transactionReducer,
    payment: paymentReducer,
    schedule: scheduleReducer,
    modelCar: modelCarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

