import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./slices/alert.slice";
import authReducer from "./slices/auth.slice";

const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => store.dispatch as AppDispatch;

export const dispatch = store.dispatch;
export default store;