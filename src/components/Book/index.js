import { Fragment, useEffect, useState } from 'react';
import './styles.scss';
import { FaStar } from 'react-icons/fa';
import BookSlider from '../BookSlider';
import { AiOutlineHeart } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import ReadMore from "react-read-more-read-less";
import { productDetails, stats } from './constants';
import {setAlert} from '../../reducers/mainSlice';
import {useDispatch} from 'react-redux';
import {addToWishlist} from '../../reducers/wishlistSlice';
import axios from 'axios';
import urls from '../../utils/urls';
import randomInteger from 'random-int';
import moment from 'moment';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Book = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isbn } = useParams();
	const [ book, setBook ] = useState(null);
	const [similarBooks, setSimilarBooks] = useState([]);
	const [categories, setCategories] = useState([]);

	const getBook = async () => {
		try {
			const response = await axios.get(urls.getBooks, {params: {search_query: String(isbn)}});
			const newBook = response.data.books[0]
			setBook({
				...newBook, 
				stars: Math.round(Number(newBook.rating)),
				pages: newBook.pages && `${newBook.pages} pages`,
				price: newBook.price && `₹ ${newBook.price}/-`,
				for_age: newBook.for_age || `${newBook.min_age} - ${newBook.max_age} years`,
				publication_date: newBook.publication_date && moment(newBook.publication_date).format("MMM Do YY"),
			});
			setCategories(Array.from(new Set(newBook.categories.map(({category}) => category.name))));
		} catch(err) {
			console.log(err);
			navigate('/');
		}
	};

	const getSimilarBooks = async () => {
		const response = await axios.get(urls.getBooks, {
			params: {
				start: 0, end: 10, age: randomInteger(book.min_age, book.max_age)
			}
		});
		setSimilarBooks(response.data.books);
	};

	useEffect(() => {
		console.log(book);
		if(book)
			getSimilarBooks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [book]);

	useEffect(() => {
		getBook();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isbn]);


	if (!book) return <h1 style={{ margin: '10rem', textAlign: 'center', padding: '1rem' }}>Loading...</h1>;
	return (
		<div className="single-book">
			<div className="book">
				<div className="book-main-details">
					<h1>{book.name}</h1>
					<div className="rating">
						{Array(book.stars).fill(true).map((_, i) => {
							if (i > Number(book.stars - 1 || -1)) 
								return <FaStar style={{ color: '#F2F2F2' }} key={i}/>;
							return <FaStar style={{ color: '#DFB300' }} />;
						})}
						<p>{book.rating}</p>
					</div>
					<div className="stats">
						{stats.map((stat, i) => {
							if(!book[stat.name] && !stat.default) 
								return <Fragment key={i}/>
							return (
								<div className='stat' key={i}>
									<img alt="Stat" src={stat.image} />
									<p>{book[stat.name] ? `${book[stat.name]}` : stat.default}</p>
								</div>
							);
						})}
						<a href="#product-details">View More</a>
					</div>
					<div className='categories'>
						{categories.map(category => {
							return (
								<div key={category.id} className='category'>
									{category}
								</div>
							);
						})}
					</div>
					{/* <div className="description">
						<h4>Description</h4>
						<ReadMore
							readMoreText={<b>Read More</b>}
							readLessText={<b>Read Less</b>}
							charLimit={150}
						>
							At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
						</ReadMore>
					</div> */}
				</div>
				<div className="book-image">
					<div className="image">
						<img alt="Book" src={book.image.replace('SY2', 'SY8').replace('SX2', 'SX8').replace('US2', 'US4')}/>
					</div>
					<button onClick={() => {
						dispatch(setAlert({ text: `${book.name} added to wishlist`, color: '#33A200' }));
						dispatch(addToWishlist({book}))
					}}>
						<AiOutlineHeart />
						<p>Add to Wishlist</p>
					</button>
				</div>
			</div>
			<BookSlider books={similarBooks} title="More Like This" bookBackground="#F1F1F0" />
			<div className="product-details" id="product-details">
				<h3>Product Details</h3>
				<div className="product-detail-list">
					{productDetails.map((detail, i) => {
						return (
							<div className="product-detail" key={i}>
								<b>{detail.title}</b>
								<p>{book[detail.name] || detail.default}</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Book;