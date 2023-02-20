import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	bookSet: [],
	bookSetLimit: 3,
	age: 8,
	searchedBooks: [],
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
				state.bookSetLimit = state.bookSetLimit + 3;
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
		setSearchedBooks: (state, action) => {
			state.searchedBooks = action.payload.searchedBooks;
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
	setSearchedBooks,
} = bookSlice.actions;

export default bookSlice.reducer;
