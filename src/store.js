import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './reducers/wishlistSlice';
import mainReducer from './reducers/mainSlice';
import bookReducer from './reducers/bookSlice';

export const store = configureStore({
	reducer: {
		main: mainReducer,
		wishlist: wishlistReducer,
		book: bookReducer,
	},
});
