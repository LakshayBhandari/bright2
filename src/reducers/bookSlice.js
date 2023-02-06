import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	bookSet: [],
	searchedBooks: [],
	searchQuery: '',
};

export const bookSlice = createSlice({
	name: 'book',
	initialState,
	reducers: {
		setBookSet: (state, action) => {
			state.bookSet = action.payload.bookSet;
		},
		setSearchQuery: (state, action) => {
			state.searchQuery = action.payload.searchQuery;
		},
		setSearchedBooks: (state, action) => {
			state.searchedBooks = action.payload.searchedBooks;
		},
	},
});

export const {
	setBookSet,
	setSearchQuery,
	setSearchedBooks,
} = bookSlice.actions;

export default bookSlice.reducer;
