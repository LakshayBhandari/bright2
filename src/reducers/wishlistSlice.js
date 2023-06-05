import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	bucket: [],
	orderBucket: [],
	wishlist: [],
	suggestedBooks: [],
	dumpedBooks: [],
	previousBooks: [],
	currentBooks: [],
};

export const wishlistSlice = createSlice({
	name: 'wishlist',
	initialState,
	reducers: {
		setBucket: (state, action) => {
			state.bucket = action.payload.bucket;
		},
		setOrderBucket: (state, action) => {
			state.orderBucket = action.payload.orderBucket;
		},
		setWishlist: (state, action) => {
			state.wishlist = action.payload.wishlist;
		},
		setCurrentBooks: (state, action) => {
			state.currentBooks = [ ...new Map(action.payload.currentBooks.map(book => [ book.isbn, book ])).values() ];
		},
		setDumpedBooks: (state, action) => {
			state.dumpedBooks = [ ...new Map(action.payload.dumpedBooks.map(book => [ book.isbn, book ])).values() ];
		},
		setPreviousBooks: (state, action) => {
			state.previousBooks = [ ...new Map(action.payload.previousBooks.map(book => [ book.isbn, book ])).values() ];
		},
		setSuggestedBooks: (state, action) => {
			state.suggestedBooks = action.payload.suggestedBooks;
		},
		addToWishlist: (state, action) => {
			state.suggestedBooks = state.suggestedBooks.map(books => {
				return books.filter(book => book.isbn !== action.payload.book.isbn);
			});
			if (!state.wishlist.find(book => book.isbn === action.payload.book.isbn))
				state.wishlist = [ ...state.wishlist, action.payload.book ];
		},
		retainBook: (state, action) => {
			if (!state.wishlist.find(book => book.isbn === action.payload.book.isbn))
				state.wishlist = [ ...state.wishlist, action.payload.book ];
		},
		removeFromBucket: (state, action) => {
			state.wishlist = state.wishlist.filter(book => book.isbn !== action.payload.book.isbn);
			state.wishlist = [ ...state.wishlist, action.payload.book ];
		},
		removeFromSuggestedBooks: (state, action) => {
			state.suggestedBooks = state.suggestedBooks.map(books => {
				return books.filter(book => book.isbn !== action.payload.book.isbn);
			});
			if (!state.dumpedBooks.find(book => book.isbn === action.payload.book.isbn))
				state.dumpedBooks = [ ...state.dumpedBooks, action.payload.book ];
		},
		removeFromWishlist: (state, action) => {
			state.wishlist = state.wishlist.filter(book => book.isbn !== action.payload.book.isbn);
		},
		addToPreviousBooks: (state, action) => {
			state.dumpedBooks = state.dumpedBooks.filter(book => book.isbn !== action.payload.book.isbn);
			if (!state.previousBooks.find(book => book.isbn === action.payload.book.isbn))
				state.previousBooks = [ ...state.previousBooks, { ...action.payload.book, userRating: 0 } ];
		},
		ratePreviousBooks: (state, action) => {
			state.previousBooks = state.previousBooks.map(book => {
				if (book.isbn === action.payload.book.isbn) return { ...book, userRating: action.payload.userRating };
				return book;
			});
		},
		removeFromDump: (state, action) => {
			state.dumpedBooks = state.dumpedBooks.filter(book => book.isbn !== action.payload.book.isbn);
		},
		decreasePriority: (state, action) => {
			let wishlist;
			const i = action.payload.i;
			if (i < state.wishlist.length - 1) {
				wishlist = state.wishlist.map((book, j) => {
					if (i === j) return { ...state.wishlist[i + 1] };
					else if (i + 1 === j) return { ...state.wishlist[i] };
					return { ...book };
				});
			}
			state.wishlist = [ ...wishlist ];
		},
		increasePriority: (state, action) => {
			let wishlist;
			const i = action.payload.i;
			if (i) {
				wishlist = state.wishlist.map((book, j) => {
					if (i === j) return { ...state.wishlist[i - 1] };
					else if (i - 1 === j) return { ...state.wishlist[i] };
					return { ...book };
				});
			}
			state.wishlist = [ ...wishlist ];
		},
	},
});

export const {
	setOrderBucket,
	setBucket,
	setWishlist,
	setPreviousBooks,
	setDumpedBooks,
	addToWishlist,
	removeFromWishlist,
	decreasePriority,
	increasePriority,
	addToPreviousBooks,
	removeFromDump,
	ratePreviousBooks,
	setSuggestedBooks,
	removeFromSuggestedBooks,
	removeFromBucket,
	setCurrentBooks,
	retainBook,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
