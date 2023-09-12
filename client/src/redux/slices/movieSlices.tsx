import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    popularMovies: [], // список популярных фильмов
    trendingMovies: [], // список фильмов в тренде
    searchResults: [], // результаты поиска
}

const moviesSlice = createSlice({
    name: "movie",
    initialState,
    reducers: {
        setPopularMovies: (state, action) => {
            state.popularMovies = action.payload;
        },
        setTrendingMovies: (state, action) => {
            state.trendingMovies = action.payload;
        },
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
    },
});

export const { setPopularMovies, setTrendingMovies, setSearchResults } = moviesSlice.actions;
export default moviesSlice.reducer;