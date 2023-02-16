import { useEffect, useRef, useState } from 'react';
import './styles.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import BookSlider from '../BookSlider';
import { useDispatch, useSelector } from 'react-redux';
import { setBookSet } from '../../reducers/bookSlice';
import axios from 'axios';
import urls from '../../utils/urls';

const ages = 15;

const BrowseLibrary = () => {
	const ageScrollRef = useRef(null);
	const dispatch = useDispatch();
	const [ age, setAge ] = useState(8);
	const { book: { bookSet } } = useSelector(state => state);

	const getBookSet = async() => {
		try {
			const response = await axios.get(urls.getBookSet, { params: { age, section_name: 'Browse Library' } });
			dispatch(setBookSet({bookSet: response.data.book_set}));
			console.log(response.data.book_set);
		} catch (err) {
			console.log(err);
		}
	};

	const scrollToCenter = () => {
		if(ageScrollRef.current) {
			console.log(ageScrollRef.current.container)
			ageScrollRef.current.container.current.scrollLeft = 1160 - (ageScrollRef.current.container.current.clientWidth / 2) + 72;
		}
	};

	useEffect(
		() => {
			getBookSet();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[age]
	);

	useEffect(() => {
		window.addEventListener('resize', scrollToCenter);
		return () => {
			window.removeEventListener('resize', scrollToCenter);
		};
	}, []);

	return (
		<div className="browse-library">
			<h1>Browse Library</h1>
			<div className="age-groups">
				<h3>Select By Age</h3>
				<ScrollContainer vertical={false} ref={ageScrollRef}>
					<div className="age-group-list">
						{Array(ages).fill(true).map((_, i) => {
							return (
								<div 
									key={i} 
									className={`age-group ${i === age ? 'selected-age-group' : ''}`} 
									onClick={() => setAge(i)}
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
					/>
				);
			})}
		</div>
	);
};

export default BrowseLibrary;
