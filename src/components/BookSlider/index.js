import {useState, useEffect, useRef} from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'
import './styles.scss';
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai';
import 'react-loading-skeleton/dist/skeleton.css'
import { getOverlay } from './utils';
import { useSelector, useDispatch } from 'react-redux';
import {getDate} from '../../utils';
import moment from 'moment';

const BookSlider = ({
	title,
	books,
	booksTitle,
	overlay,
	showOverlay = true
}) => {
	const {main: {user, isLoggedIn}, wishlist: {bucket}} = useSelector(state => state);
	const dispatch = useDispatch();
	const [sectionBooks, setSectionBooks] = useState(books.length ? books : ['No books to show']);
	const [booksScroll, setBooksScroll] = useState(0);
	const booksRef = useRef(null);

	const slide = (direction, ref) => {
		const element = ref.current.container.current;
		setBooksScroll(element.scrollLeft)
		if(direction === 'right')
			element.scrollTo(element.scrollLeft + element.clientWidth - 100, 0);
		else
			element.scrollTo(element.scrollLeft - element.clientWidth - 100, 0);
	};

	const getWishlistDeliveryDate = (i, date) => {
		if(bucket.length) 
			return getDate(moment(date).add(7 * (Math.round((i + 1) / user.books_per_week)), 'days'));
		return getDate(moment(date).add(7 * (Math.round((i + 1) / user.books_per_week) - 1), 'days'));
	};

	useEffect(() => {
		if(books.length)
			setSectionBooks(books);
		else
			setSectionBooks(['No books to show']);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [books]);

	return (
		<div className="book-slider">
			{title && <h3 className='title'>{title}</h3>}
			<div className="books">
				{sectionBooks?.length && sectionBooks[0] !== 'No books to show' && booksScroll !== 0 &&
					<AiOutlineLeft
						className='left-arrow'
						onClick={() => slide('left', booksRef)}
					/>
				}
				{(sectionBooks?.length && sectionBooks[0] !== 'No books to show') && booksRef?.current?.container.current.scrollWidth > booksRef?.current?.container.current.clientWidth &&
					<AiOutlineRight
						className='right-arrow'
						onClick={() => slide('right', booksRef, true)}
					/>
				}
				{booksTitle && <h3>{booksTitle}</h3>}
				<ScrollContainer vertical={false} ref={booksRef}>
					{(!sectionBooks?.length || sectionBooks[0] === 'No books to show')
						?
						<h3 style={{textAlign: 'center', fontSize: '0.9rem'}} className='no-books-text'>No books to show</h3>
						:
						<div className="book-list">
							{sectionBooks?.map((book, i) => {
								console.log(book.name, book.stock_available);
								return (
									<div 
										className={`book ${isLoggedIn && !book.stock_available ? 'book-not-available' : ''}`} 
										key={i}
									>
										<div className='book-image'>
											<img src={book.image} alt='Book'/>
										</div>
										<p>{book.name.split(':')[0]}</p>
										<div className='book-details'>
											{book.rating && 
											<div className='book-detail'>
												<p>{book.rating}</p>
												<img src='/icons/star.png' alt='Rating'/>
											</div>}
											{book.review_count && !isNaN(book.review_count) && 
											<div className='book-detail'>
												<img src='/icons/reviews.png' alt='Reviews'/>
												<p>{Number(book.review_count).toLocaleString()}</p>
											</div>}
										</div>
										{isLoggedin && (overlay === 'wishlist' || !overlay) && !book.stock_available &&
											<p className='all-copies-booked'>
												All Copies Booked
											</p>										
										}
										{showOverlay && getOverlay(overlay, sectionBooks, book, i, dispatch, isLoggedIn)}
									</div>
								);
							})}
						</div>
					}
				</ScrollContainer>
			</div>
		</div>
	);
};

export default BookSlider;