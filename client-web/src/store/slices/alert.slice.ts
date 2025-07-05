import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type AppDispatch, type RootState } from '@/store'; // adjust path as needed

export type Alert = {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timeout?: number; // milliseconds
}

type AlertState = {
    alerts: Alert[];
}

const initialState: AlertState = {
    alerts: [],
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<Alert>) => {
            state.alerts.push(action.payload);
        },
        removeAlert: (state, action: PayloadAction<string>) => {
            state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
        },
        clearAlerts: (state) => {
            state.alerts = [];
        },
    },
});

export const { addAlert, removeAlert, clearAlerts } = alertSlice.actions;
export default alertSlice.reducer;

export const alertSelector = (state: RootState) => state.alert;

export const showAlert = createAsyncThunk<void, Omit<Alert, 'id'>>
    ("ui/alert", (payload, { dispatch }) => {
        const id = Math.random().toString(36).substr(2, 9);
        dispatch(addAlert({ ...payload, id }));

        const timeout = payload.timeout ?? 3000;
        setTimeout(() => {
            dispatch(removeAlert(id));
        }, timeout);
    });