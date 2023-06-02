import { useState, useEffect, useRef } from 'react';
import './styles.scss';
import arrayShuffle from 'array-shuffle';
import ScrollContainer from 'react-indiana-drag-scroll';
import BookSlider from '../BookSlider';
import { useDispatch, useSelector } from 'react-redux';
import { resetBookSet, setBookSet, setAge, load, stopLoad } from '../../reducers/bookSlice';
import axios from 'axios';
import urls from '../../utils/urls';

const ages = 12;

const MustRead = () => {
	const loadMoreRef = useRef(null);
	const ageScrollRef = useRef(null);
	const dispatch = useDispatch();
	const { book: { loading, age, bookSet } } = useSelector(state => state);
	const [bookSetSize, setBookSetSize] = useState({total: 100, single: 10, categoryLimit: 8});

	const getMustReadBookSet = async () => {
		if(loading) 
			return;
		try {
			dispatch(load());
			const response = await axios.get(urls.getMustReadSet, {
				params: {
					count: bookSetSize.total,
					age: age === '12+' ? 13 : age,
					category_limit: bookSetSize.categoryLimit,
				},
			});
			const {books} = response.data;
			const _bookSet = [];
			for(let i = 0; i < books.length; ++i) {
				if(i % bookSetSize.single === 0) 
					_bookSet.push({category: `Set ${Math.floor(i / bookSetSize.single) + 1}`, books: []});
				_bookSet[Math.floor(i / bookSetSize.single)].books.push(books[i]);
			}
			for(let i = 0; i < _bookSet.length; ++i) 
				_bookSet[i].books = arrayShuffle(_bookSet[i].books);
			dispatch(setBookSet({bookSet: _bookSet}));
		} catch (err) {
			console.log(err);
		}
		dispatch(stopLoad());
	};

	const scrollToCenter = () => {
		if(ageScrollRef.current) 
			ageScrollRef.current.container.current.scrollLeft = (145.5 * (age === '12+' ? 13 : age)) - (ageScrollRef.current.container.current.clientWidth / 2) + 72;
	};

	useEffect(() => {
		scrollToCenter();
	}, [age]);

	useEffect(
		() => {
			getMustReadBookSet();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[bookSetSize, age]
	);

	useEffect(() => {
		dispatch(resetBookSet());
	}, []);

	return (
		<div className="browse-library">
			<h1>Must Read Collection</h1>
			<div className="filters">
				<h3>Select By Age</h3>
				<ScrollContainer vertical={false} ref={ageScrollRef}>
					<div className="filter-list">
						{Array(ages).fill(true).map((_, i) => {
							return (
								<div 
									key={i} 
									className={`filter ${i === age ? 'selected-filter' : ''}`} 
									onClick={() => dispatch(setAge({age: i}))}
								>
									<h2>{i} - {i + 1}</h2>
									<p>Years</p>
								</div>
							);
						})}
						<div 
							className={`filter ${age === '12+' ? 'selected-filter' : ''}`} 
							onClick={() => dispatch(setAge({age: '12+'}))}
						>
							<h2>12+</h2>
							<p>Years</p>
						</div>
					</div>
				</ScrollContainer>
			</div>
			<div className="filters filters-square">
				<ScrollContainer vertical={false}>
					<div className="filter-list">
						<div 
							className={`filter ${bookSetSize.total === 30 ? 'selected-filter' : ''}`} 
							onClick={() => setBookSetSize({total: 30, single: 3, categoryLimit: 3})}
						>
							<h2>30</h2>
							<p>Top Books</p>
						</div>
						<div 
							className={`filter ${bookSetSize.total === 100 ? 'selected-filter' : ''}`} 
							onClick={() => setBookSetSize({total: 100, single: 10, categoryLimit: 8})}
						>
							<h2>100</h2>
							<p>Top Books</p>
						</div>
						<div 
							className={`filter ${bookSetSize.total === 10 ? 'selected-filter' : ''}`} 
							onClick={() => setBookSetSize({total: 10, single: 2, categoryLimit: 2})}
						>
							<h2>10</h2>
							<p>Top Books</p>
						</div>
					</div>
				</ScrollContainer>
			</div>
			{bookSet.map(books => {
				return (
					<BookSlider
						key={books.category}
						title={books.category}
						books={books.books}
						getBooks={getMustReadBookSet}
					/>
				);
			})}
			<div ref={loadMoreRef}></div>
		</div>
	);
};

export default MustRead;
