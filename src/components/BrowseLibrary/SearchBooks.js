import { Fragment, useRef, useEffect } from 'react';
import BookSlider from '../BookSlider';
import { useDispatch, useSelector } from 'react-redux';
import './styles.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import { setAge } from '../../reducers/bookSlice';

const ages = 12;

const SearchBooks = () => {
	const dispatch = useDispatch();
	const ageScrollRef = useRef(null);
	const { book: {searchedBookSet}, book: {age} } = useSelector(state => state);

	const scrollToCenter = () => {
		if(ageScrollRef.current) 
			ageScrollRef.current.container.current.scrollLeft = (145.5 * (age === '12+' ? 13 : age)) - (ageScrollRef.current.container.current.clientWidth / 2) + 72;
	};

	useEffect(() => {
		scrollToCenter();
	}, [age]);

	return (
		<div className="search-books">
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
			{!searchedBookSet?.length && <h3 className="info">Enter a query of atleast 3 characters to search</h3>}
			{searchedBookSet?.length ? 
				searchedBookSet.map(books => {
					if(books.category === 'Best Seller - Most Popular')  
						return <Fragment key={books.category}/>
					return (
						<BookSlider
							key={books.category}
							title={books.category}
							books={books.books}
						/>
					);
				})
				: searchedBookSet && <p>No books found</p>
            }
		</div>
	);
};

export default SearchBooks;
