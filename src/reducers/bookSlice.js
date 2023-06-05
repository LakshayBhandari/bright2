import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	bookSet: [],
	bookSetLimit: 5,
	age: 5,
	searchedBookSet: [],
	searchQuery: '',
	loading: false,
};

export const bookSlice = createSlice({
	name: 'book',
	initialState,
	reducers: {
		setBookSet: (state, action) => {
			state.bookSet = action.payload.bookSet;
		},
		appendBookSet: (state, action) => {
			state.bookSet = [...state.bookSet, ...action.payload.bookSet];
		},
		setSearchQuery: (state, action) => {
			state.searchQuery = action.payload.searchQuery;
		},
		increaseBookSetLimit: (state) => {
			if(!state.loading) 
				state.bookSetLimit = state.bookSetLimit + 5;
		},
		resetBookSet: (state) => {
			state.bookSetLimit = initialState.bookSetLimit;
			state.age = initialState.age;
		},
		setAge: (state, action) => {
			state.bookSetLimit = initialState.bookSetLimit;
			state.age = action.payload.age;
		},
		load: (state) => {
			state.loading = true;
		},
		stopLoad: (state) => {
			state.loading = false;
		},
		setSearchedBookSet: (state, action) => {
			state.searchedBookSet = action.payload.searchedBookSet;
		},
	},
});

export const {
	stopLoad,
	load,
	setAge,
	resetBookSet,
	increaseBookSetLimit,
	appendBookSet,
	setBookSet,
	setSearchQuery,
	setSearchedBookSet,
} = bookSlice.actions;

export default bookSlice.reducer;
