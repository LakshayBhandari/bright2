import {useState, useEffect, useRef} from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'
import './styles.scss';
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai';
import Loading from '../Loading';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const BookSlider = ({
	title,
	books,
	booksTitle,
	getBooks = () => {},
}) => {
	const [booksLoading, setBooksLoading] = useState(false);
	const [sectionBooks, setSectionBooks] = useState(books.length ? books : ['No books to show']);
	const [booksScroll, setBooksScroll] = useState(0);
	const booksRef = useRef(null);

	const updateBooks = async () => {
		const element = booksRef.current.container.current;
		setBooksScroll(element.scrollLeft);
		if(!booksLoading && element.scrollLeft === element.scrollWidth - element.clientWidth) {
			setBooksLoading(true);
			await getBooks({
				start: element.children[0].children.length + 10,
				end: element.children[0].children.length + 20,
				type: 'a'
			});
			setBooksLoading(false);
		}
	};

	const slide = (direction, ref, update) => {
		const element = ref.current.container.current;
		setBooksScroll(element.scrollLeft)
		if(direction === 'right')
			element.scrollTo(element.scrollLeft + element.clientWidth - 100, 0);
		else
			element.scrollTo(element.scrollLeft - element.clientWidth - 100, 0);
		if(update)
			updateBooks();
	};

	useEffect(() => {
		if(books.length)
			setSectionBooks(books);
		else
			setSectionBooks(['No books to show']);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [books]);

	useEffect(() => {
		if(booksRef?.current)
			booksRef.current.container.current.addEventListener('scroll', updateBooks);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [booksRef]);

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
						<h3 className='no-books-text'>No books to show</h3>
						:
						<div className="book-list">
							{sectionBooks?.map((book, i) => {
								return (
									<div className="book" key={i}>
										<div className='book-image'>
											<img src={book.image} alt='Book'/>
										</div>
										<p>{book.name.split(':')[0]}</p>
										<div className='book-details'>
											<div className='book-detail'>
												<p>{book.rating}</p>
												<img src='/icons/star.png' alt='Rating'/>
											</div>
											<div className='book-detail'>
												<img src='/icons/reviews.png' alt='Reviews'/>
												<p>{Number(book.review_count).toLocaleString()}</p>
											</div>
										</div>
									</div>
								);
							})}
							{booksLoading && <Loading/>}
						</div>
					}
				</ScrollContainer>
			</div>
		</div>
	);
};

export default BookSlider;

/*
{book === 'skeleton'
	?
	<Skeleton height={'12rem'}/>
	:
	<LazyLoadImage
		alt='Book'
		src={book.image}
		width={125}
		visibleByDefault={true}
	/>
}
*/