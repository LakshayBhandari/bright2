import { useEffect, useRef } from 'react';
import './styles.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import BookSlider from '../BookSlider';
import { useDispatch, useSelector } from 'react-redux';
import { increaseBookSetLimit, resetBookSet, appendBookSet, setBookSet, setAge, load, stopLoad } from '../../reducers/bookSlice';
import axios from 'axios';
import urls from '../../utils/urls';

const ages = 15;

const MustRead = () => {
	const loadMoreRef = useRef(null);
	const ageScrollRef = useRef(null);
	const dispatch = useDispatch();
	const { book: { loading, age, bookSet, bookSetLimit } } = useSelector(state => state);

	const getMustReadBookSet = async () => {
		if(loading) 
			return;
		try {
			dispatch(load());
			const response = await axios.get(urls.getBookSet, { params: { 
				age, 
				section_name: 'Must Read', 
				start: bookSetLimit - 3,
				end: bookSetLimit
			}});
			if(bookSetLimit === 3) 
				dispatch(setBookSet({bookSet: response.data.book_set}));
			else 
				dispatch(appendBookSet({bookSet: response.data.book_set}));
			console.log(response.data.book_set);
		} catch (err) {
			console.log(err);
		}
		dispatch(stopLoad());
	};

	const scrollToCenter = () => {
		if(ageScrollRef.current) {
			console.log(ageScrollRef.current.container)
			ageScrollRef.current.container.current.scrollLeft = 1160 - (ageScrollRef.current.container.current.clientWidth / 2) + 72;
		}
	};

	const loadMore = () => {
		if (loadMoreRef.current) {
			if (window.innerHeight + window.scrollY >= loadMoreRef.current.offsetTop) dispatch(increaseBookSetLimit());
		}
	};

	useEffect(
		() => {
			getMustReadBookSet();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[age, bookSetLimit]
	);

	useEffect(() => {
		dispatch(resetBookSet());
		scrollToCenter();
		window.addEventListener('resize', scrollToCenter);
		window.addEventListener('scroll', loadMore);
		return () => {
			window.removeEventListener('scroll', loadMore);
			window.removeEventListener('resize', scrollToCenter);
		};
	}, []);

	return (
		<div className="browse-library">
			<h1>Must Read Collection</h1>
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
