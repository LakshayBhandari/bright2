import { Link } from 'react-router-dom';
import { AiOutlineHeart } from 'react-icons/ai';
import {
	addToWishlist,
	increasePriority,
	decreasePriority,
	removeFromWishlist,
	removeFromDump,
	addToPreviousBooks,
	ratePreviousBooks,
	removeFromSuggestedBooks,
	retainBook,
} from '../../reducers/wishlistSlice';
import { setAlert } from '../../reducers/mainSlice';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';
import { HiThumbDown, HiOutlineBookOpen } from 'react-icons/hi';
import axios from 'axios';
import devUrls from '../../utils/devUrls';

const wishlistAdd = async (book, dispatch) => {
	dispatch(setAlert({ text: `${book.name} added to wishlist`, color: '#33A200' }));
	dispatch(addToWishlist({ book }));
	try {
		await axios.post(devUrls.addToWishlist, {guid: book.guid}, {withCredentials: true});
	} catch (err) {
		console.log(err);
	}
};

const wishlistRemove = async (book, dispatch) => {
	dispatch(setAlert({ text: `${book.name} removed from wishlist`, color: '#F75549' }));
	dispatch(removeFromWishlist({ book }));
	try {
		await axios.post(devUrls.removeFromWishlist, {guid: book.guid}, {withCredentials: true});
	} catch (err) {
		console.log(err);
	}
};

const suggestionDump = async (book, dispatch) => {
	dispatch(setAlert({ text: `${book.name} removed from suggestions`, color: '#F75549' }));
	dispatch(removeFromSuggestedBooks({ book }));
	try {
		await axios.post(devUrls.dumpBook, {guid: book.guid}, {withCredentials: true});
	} catch (err) {
		console.log(err);
	}
};

const wishlistPrevious = async (book, dispatch, i) => {
	dispatch(increasePriority({ i }));
	try {
		await axios.post(devUrls.wishlistPrevious, {guid: book.guid}, {withCredentials: true});
	} catch (err) {
		console.log(err);
	}
};

const wishlistNext = async (book, dispatch, i) => {
	dispatch(decreasePriority({ i }));
	try {
		await axios.post(devUrls.wishlistNext, {guid: book.guid}, {withCredentials: true});
	} catch (err) {
		console.log(err);
	}
};

const readBefore = async (book, dispatch) => {
	dispatch(addToPreviousBooks({ book }));
	try {
		await axios.post(devUrls.dumpRead, {guid: book.guid}, {withCredentials: true});
	} catch (err) {
		console.log(err);
	}
};

const dislike = async (book, dispatch) => {
	dispatch(removeFromDump({ book }));
	try {
		await axios.post(devUrls.dumpDislike, {guid: book.guid}, {withCredentials: true});
	} catch (err) {
		console.log(err);
	}
};

const retain = async (book, dispatch) => {
	dispatch(retainBook({ book }));
	try {
		await axios.post(devUrls.retainBook, {guid: book.guid}, {withCredentials: true});
	} catch (err) {
		console.log(err);
	}
};

export const getOverlay = (overlay, sectionBooks, book, i, dispatch, plan) => {
	if (!overlay) {
		return (
			<div className="book-overlay">
				<button onClick={() => wishlistAdd(book, dispatch)}>
					<AiOutlineHeart />
					<p>Add to Wishlist</p>
				</button>
				<Link to={`/book/${book.guid}`}>View Details</Link>
			</div>
		);
	} else if (overlay === 'wishlist') {
		return (
			<div className="book-overlay">
				{i > 0 &&
					<button className="high-priority" onClick={() => wishlistPrevious(book, dispatch, i)} style={{width: '100px'}}>
					<BsArrowLeft />
					<p>High</p>
				</button>}
				<div className="vertical-button" onClick={() => wishlistRemove(book, dispatch)}>
					<MdClose />
					<p>Remove</p>
				</div>
				{i < sectionBooks.length - 1 &&
					<button
						className="low-priority"
						onClick={() => wishlistNext(book, dispatch, i)}
						style={{ backgroundColor: 'red', width: '100px' }}
					>
						<p>Low</p>
						<BsArrowRight />
					</button>}
			</div>
		);
	} else if (overlay === 'current') {
		return (
			<div className="book-overlay">
				<button style={{ backgroundColor: '#FF8513' }} onClick={() => retain(book, dispatch)}>
					<HiOutlineBookOpen />
					<p>Retain</p>
				</button>
			</div>
		);
	} else if (overlay === 'previous') {
		return (
			<div className="book-overlay">
				<div className="rating">
					{Array(5).fill(true).map((star, j) => {
						const rateBook = () => dispatch(ratePreviousBooks({ book, userRating: j + 1 }));
						if (j < book.userRating)
							return (
								<FaStar
									style={{ fontSize: '1.5rem', color: '#FF8513', marginLeft: '0.25rem' }}
									key={j}
									onClick={rateBook}
								/>
							);
						return (
							<FaStar
								style={{ fontSize: '1.5rem', color: '#B0AFAF', marginLeft: '0.25rem' }}
								key={j}
								onClick={rateBook}
							/>
						);
					})}
				</div>
			</div>
		);
	} else if (overlay === 'dump') {
		return (
			<div className="book-overlay">
				<button style={{ backgroundColor: '#B0AFAF' }} onClick={() => readBefore(book, dispatch)}>
					Read Before
				</button>
				<button style={{ backgroundColor: 'red' }} onClick={() => dislike(book, dispatch)}>
					<HiThumbDown />
					<p>Dislike</p>
				</button>
			</div>
		);
	} else if (overlay === 'suggested') {
		return (
			<div className="book-overlay">
				<button onClick={() => wishlistAdd(book, dispatch)}>
					<AiOutlineHeart />
					<p>Add to Wishlist</p>
				</button>
				<button
					style={{ backgroundColor: 'red' }}
					onClick={() => suggestionDump(book, dispatch)}
				>
					<MdClose />
					<p>Remove</p>
				</button>
			</div>
		);
	}
};
