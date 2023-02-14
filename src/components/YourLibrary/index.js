import { useEffect, useState } from 'react';
import BookSlider from '../BookSlider';
import './styles.scss';
import { suggestedCategories, bookArchives } from './constants';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	setBucket,
	setWishlist,
	setSuggestedBooks,
	setDumpedBooks,
	setPreviousBooks,
	setCurrentBooks,
} from '../../reducers/wishlistSlice';
import { getAgeGroupColor, getDay, getDate } from '../../utils';
import { FaCalendar } from 'react-icons/fa';
import axios from 'axios';
import devUrls from '../../utils/devUrls';

const YourLibrary = () => {
	const state = useSelector(state => state);
	const { main: { user }, wishlist: { bucket, wishlist, suggestedBooks } } = useSelector(state => state);
	const dispatch = useDispatch();

	const getBucket = async () => {
		try {
			const response = await axios.get(devUrls.getOrderBucket, {
				withCredentials: true,
				params: { guid: user.guid },
			});
			dispatch(setBucket({ bucket: response.data.wishlists }));
		} catch (err) {
			console.log(err);
		}
	};

	const getWishlist = async () => {
		try {
			const response = await axios.get(devUrls.getWishlist, {
				withCredentials: true,
				params: { guid: user.guid },
			});
			dispatch(setWishlist({ wishlist: response.data.wishlists }));
		} catch (err) {
			console.log(err);
		}
	};

	const getCurrentBooks = async () => {
		try {
			const response = await axios.get(devUrls.getCurrentBooks, {
				withCredentials: true,
				params: { guid: user.guid },
			});
			dispatch(setCurrentBooks({ currentBooks: response.data.books }));
		} catch (err) {
			console.log(err);
		}
	};

	const getPreviousBooks = async () => {
		try {
			const response = await axios.get(devUrls.getPreviousBooks, {
				withCredentials: true,
				params: { guid: user.guid },
			});
			dispatch(setPreviousBooks({ previousBooks: response.data.books }));
		} catch (err) {
			console.log(err);
		}
	};

	const getDumpedBooks = async () => {
		try {
			const response = await axios.get(devUrls.getDumpedBooks, {
				withCredentials: true,
				params: { guid: user.guid },
			});
			dispatch(setDumpedBooks({ dumpedBooks: response.data.dumps }));
		} catch (err) {
			console.log(err);
		}
	};

	const getSuggestions = async () => {
		if (user.children?.length) {
			const newSuggestedBooks = [];
			for (const child of user.children) {
				try {
					const response = await axios.get(devUrls.getSuggestedBooks, {
						withCredentials: true,
						params: { guid: child.guid },
					});
					newSuggestedBooks.push(response.data.suggestions);
				} catch (err) {
					console.log(err);
				}
			}
			dispatch(setSuggestedBooks({ suggestedBooks: newSuggestedBooks }));
		}
	};

	useEffect(() => {
		getWishlist();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bucket]);

	useEffect(
		() => {
			getSuggestions();
			getPreviousBooks();
			getBucket();
			getDumpedBooks();
			getCurrentBooks();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<div className="your-library">
			<h3>Your Library</h3>
			<div className="bucket">
				<h3>Next Delivery Bucket</h3>
				{bucket.length
					?
					<div className="bucket-details">
						<div className="bucket-list">
							{bucket.map((book, i) => {
								return (
									<div className="bucket-book" key={i}>
										<img src={book.image} alt="Book" />
									</div>
								);
							})}
						</div>
						<button className="date-button">
							<span>Delivery Date{user.next_delivery_date && ` - ${getDate(user.next_delivery_date)}`}</span>
						</button>
						{user.next_delivery_date && <div className="time-date">
							<div className="time-date-column">
								<img src="/icons/time.png" alt="Time" />
								<p>Time - {user.delivery_time}</p>
							</div>
							<div className="time-date-column">
								<FaCalendar />
								<p>Day - {getDay(user.next_delivery_date)}</p>
							</div>
						</div>}
					</div>
					:
					<p className='blue-button create-bucket'>No Bucket Created</p>
				}
			</div>
			<div className="wishlist">
				<h3>Wishlist</h3>
				{wishlist.length > 0
					? <BookSlider books={wishlist} showTags={false} overlay="wishlist" />
					: <div className="empty-wishlist">
							<h2><span>Like Books</span> to add<br />them in your wishlist</h2>
							<img src="/icons/wishlist.png" alt="Wishlist" />
						</div>}
			</div>
			{user.children?.map((child, i) => {
				return (
					<div className="suggestions" key={i}>
						<BookSlider
							books={suggestedBooks.length ? suggestedBooks[i] : []}
							color={getAgeGroupColor(child.dob)}
							categories={suggestedCategories}
							title={`Suggested for ${child.name}`}
							overlay="suggested"
						/>
					</div>
				);
			})}
			<div className="archives">
				{bookArchives.map((archive, i) => {
					return (
						<div className="archive" key={i}>
							<h3>{archive.title}</h3>
							{state.wishlist[archive.name]?.length
								? <BookSlider
										books={state.wishlist[archive.name]}
										bookBackground="#F1F1F0"
										showTags={false}
										overlay={archive.overlay}
									/>
								: <div className="archive-empty">
										{archive.emptyText}
										<img src={archive.emptyImage} alt="Archive" />
									</div>}
						</div>
					);
				})}
			</div>
			<div className="wish-more-books">
				<h2>Wish to see more Books!</h2>
				<Link to="/browse-library" className="blue-button">Browse Library</Link>
			</div>
		</div>
	);
};

export default YourLibrary;
