import {useState, useEffect, useRef} from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useDispatch, useSelector } from 'react-redux';
import { setAge } from '../../reducers/bookSlice';
import './styles.scss';
import Hero from '../Content/Hero';
import {platformStats, platforms} from './constants';
import axios from 'axios';
import urls from '../../utils/urls';
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai';

const ages = 15;

const Pricing = () => {
    const [books, setBooks] = useState([]);
    const [booksScroll, setBooksScroll] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
	const { book: { age } } = useSelector(state => state);
	const ageScrollRef = useRef(null);
    const booksRef = useRef(null);
	const dispatch = useDispatch();

    const getMustReadBooks = async () => {
        try {
            const response = await axios.get(urls.getBooks, {params: {age, section_id: 2, start: 0, end: 100}});
            const _books = []
            for(const book of response.data.books) {
                _books.push({
                    ...book,
                    price: book.price || 500
                });
            }
            setTotalPrice(Math.round(_books.reduce((total, book) => total + book.price, 0)));
            setBooks(_books);
        } catch (err) {
            console.log(err);
        }
    };

    const slide = (direction, ref) => {
		const element = ref.current.container.current;
		setBooksScroll(element.scrollLeft)
		if(direction === 'right')
			element.scrollTo(element.scrollLeft + element.clientWidth - 100, 0);
		else
			element.scrollTo(element.scrollLeft - element.clientWidth - 100, 0);
	};

    const scrollToCenter = () => {
		if(ageScrollRef.current) 
			ageScrollRef.current.container.current.scrollLeft = 1160 - (ageScrollRef.current.container.current.clientWidth / 2) + 72;
	};

	useEffect(() => {
		scrollToCenter();
		window.addEventListener('resize', scrollToCenter);
		return () => {
			window.removeEventListener('resize', scrollToCenter);
		};
	}, []);

    useEffect(() => {
        getMustReadBooks();
    }, [age]);

    return (
        <div className='pricing'>
            <h1>Compare Pricing</h1>
            <div className="age-groups">
				<h3>Select By Age</h3>
				<ScrollContainer vertical={false} ref={ageScrollRef}>
					<div className="age-group-list">
						{Array(ages).fill(true).map((_, i) => {
							return (
								<div 
									key={i} 
									className={`age-group ${i === age ? 'selected-age-group' : ''}`} 
									onClick={() => dispatch(setAge({age: i}))}
								>
									<h2>{i} - {i + 1}</h2>
									<p>Years</p>
								</div>
							);
						})}
					</div>
				</ScrollContainer>
			</div>
            <div className='books'>
                {books.length !== 0 && booksScroll !== 0 &&
					<AiOutlineLeft
						className='left-arrow'
						onClick={() => slide('left', booksRef)}
					/>
				}
				{books.length !== 0 && booksRef?.current?.container.current.scrollWidth > booksRef?.current?.container.current.clientWidth &&
					<AiOutlineRight
						className='right-arrow'
						onClick={() => slide('right', booksRef, true)}
					/>
				}
                <h3>Must Read Section</h3>
                <p>Just a suggestive list, you can pick any book in the library service</p>
                <ScrollContainer vertical={false} ref={booksRef}>
                    {!books.length
                        ?
                        <h3 style={{textAlign: 'center', fontSize: '0.9rem'}} className='no-books-text'>No books to show</h3>
                        :
                        <div className="book-list">
                            {books?.map((book, i) => {
                                return (
                                    <div className="book" key={i}>
                                        <div className='book-image'>
                                            <img src={book.image} alt='Book'/>
                                        </div>
                                        <p>{book.name.split(':')[0]}</p>
                                        <div className='book-details'>
                                            {book.price && 
                                            <div className='book-detail'>
                                                <p>₹ {book.price}/-</p>
                                            </div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    }
                </ScrollContainer>
            </div>
            <div className='platforms'>
				{platforms.map((platform, i) => {
					return (
						<div 
							key={platform.id} 
							className={`platform ${i === 1 ? 'selected-platform' : ''}`}
						>
							<img 
								src={platform.image} 
								alt='Platform'
							/>
							<p>{platform.name}</p>
						</div>
					);
				})}
			</div>
            <div className='platform-stats'>
                <div className='platform-stat'>
                    <h3>Annual Cost</h3>
                    <div className='platform-stat-items'>
                        <h3>₹ {totalPrice}/-</h3>
                        <h3 className='selected-platform-stat-item'>₹ 7500/-</h3>
                        <h3>₹ {Math.round(totalPrice * 0.8)}/-</h3>
                    </div>
                </div>
				{platformStats.map((stat, i) => {
					return (
						<div key={i} className='platform-stat'>
							<h3>{stat.title}</h3>
							<div className='platform-stat-items'>
								{stat.items.map((item, j) => {
									const className = j === 1 ? 'selected-platform-stat-item' : '';
									return (
										<p className={className} key={j}>
											{item.text}
										</p>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
            <Hero/>
        </div>
    );
};

export default Pricing;