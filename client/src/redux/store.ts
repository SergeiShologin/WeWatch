import { configureStore } from "@reduxjs/toolkit"
import moviesReducer from "./slices/movieSlices";
import authReducer from "./slices/authSlice"

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        users: authReducer
    },
})