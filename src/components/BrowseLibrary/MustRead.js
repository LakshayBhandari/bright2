import { Fragment, useState, useEffect, useRef } from 'react';
import './styles.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import BookSlider from '../BookSlider';
import { useDispatch, useSelector } from 'react-redux';
import { resetBookSet, setBookSet, setAge, load, stopLoad } from '../../reducers/bookSlice';
import axios from 'axios';
import urls from '../../utils/urls';
import { mustReadSections, mustReadOptions } from './constants';
import BrowseLibraryLinks from '../Content/BrowseLibraryLinks';

const ages = 12;

const MustRead = () => {
	const ageScrollRef = useRef(null);
	const dispatch = useDispatch();
	const { main: {isLoggedIn}, book: { loading, age, bookSet } } = useSelector(state => state);
	const [section, setSection] = useState('Best Seller Series');

	const getMustReadSet = async () => {
		if(loading) 
			return;
		try {
			dispatch(load());
			const params = {...mustReadOptions[section], age};
			if(!isLoggedIn) 
				params['show_unavailable'] = true;
			const response = await axios.get(urls.getMustReadSet, { params });
			dispatch(setBookSet({bookSet: response.data.book_set}));
		} catch (err) {
			console.log(err);
		}
		dispatch(stopLoad());
	};

	const scrollToCenter = () => {
		if(ageScrollRef.current) 
			ageScrollRef.current.container.current.scrollLeft = (145.5 * age) - (ageScrollRef.current.container.current.clientWidth / 2) + 72;
	};

	useEffect(() => {
		scrollToCenter();
	}, [age]);

	useEffect(
		() => {
			getMustReadSet();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[section, age]
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
					</div>
				</ScrollContainer>
			</div>
			<div className="filters filters-square">
				<ScrollContainer vertical={false}>
					<div className="filter-list">
						{mustReadSections.map(mustReadSection => {
							return (
								<div 
									className={`filter ${mustReadSection.title === section ? 'selected-filter' : ''}`} 
									onClick={() => setSection(mustReadSection.title)}
								>
									<h2>{mustReadSection.largeText}</h2>
									<p>{mustReadSection.smallText}</p>
								</div>
							);
						})}
					</div>
				</ScrollContainer>
			</div>
			{bookSet.map(books => {
				if(books.books.length < mustReadOptions[section].book_count) 
					return <Fragment key={books.category}/>
				return (
					<BookSlider
						key={books.category}
						title={books.category}
						books={books.books}
						getBooks={getMustReadSet}
					/>
				);
			})}
			<BrowseLibraryLinks/>
		</div>
	);
};

export default MustRead;
