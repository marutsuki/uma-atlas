import {
    createAsyncThunk,
    createSelector,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";
import {
    type LoginRequest,
    type AuthResponse,
    type User,
    type RegisterRequest,
} from "@/model/auth";
import { api } from "../../lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "..";

type State = {
    user?: User;
};

const authSlice = createSlice({
    name: "auth",
    initialState: {} as State,
    reducers: {
        setCurrentUser: (state, user: PayloadAction<User>) => {
            state.user = user.payload;
        },
        invalidateUser: (state) => {
            state.user = undefined;
        },
    },
});

export const me = createAsyncThunk("/auth/me", async (_, { dispatch }) => {
    const res = await api.get("/api/iam/auth/me");
    if (res.data.user) {
        dispatch(setCurrentUser(res.data.user as User));
    }
});

export const register = createAsyncThunk<void, RegisterRequest>(
    "/auth/register",
    async (payload, { dispatch, rejectWithValue, fulfillWithValue }) => {
        const res = (await api.post("/api/iam/auth/register", payload))
            .data as AuthResponse;

        if (res.token) {
            localStorage.setItem("jwt", res.token);
            dispatch(setCurrentUser(res.user));
            fulfillWithValue(res.user);
        } else {
            rejectWithValue({ message: "Login failed" });
        }
    }
)
export const login = createAsyncThunk<void, LoginRequest>(
    "/auth/login",
    async (payload, { dispatch, rejectWithValue, fulfillWithValue }) => {
        const res = (await api.post("/api/iam/auth/login", payload))
            .data as AuthResponse;

        if (res.token) {
            localStorage.setItem("jwt", res.token);
            dispatch(setCurrentUser(res.user));
            fulfillWithValue(res.user);
        } else {
            rejectWithValue({ message: "Login failed" });
        }
    }
);

export const logout = createAsyncThunk(
    "/iam/logout",
    async (_, { dispatch }) => {
        localStorage.removeItem("jwt");
        dispatch(invalidateUser());
    }
);

export const { setCurrentUser, invalidateUser } = authSlice.actions;
export default authSlice.reducer;

const selector = (store: RootState) => store.auth;

export const useMaybeCurrentUser = () =>
    useSelector(
        createSelector(selector, (state) => {
            return state.user;
        })
    );

export const useCurrentUser = () => {
    const user = useSelector(
        createSelector(selector, (state) => {
            return state.user;
        })
    );
    if (!user) {
        throw new Error("Expected an authenticated user");
    }
    return user;
};