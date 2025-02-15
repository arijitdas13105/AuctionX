import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState:{
        token: null,
        userId: null,
        isLoggedIn: false,
    },
    reducers: {
        login: (state, action) => {
            // state.token = action.payload;
            // state.userId = action.payload;
            state.token = action.payload.token;
            state.userId=action.payload.userId;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.token = null;
            state.userId = null;
            state.isLoggedIn = false;
        }
    }
})

export const { login, logout } =authSlice.actions;
export default authSlice.reducer
