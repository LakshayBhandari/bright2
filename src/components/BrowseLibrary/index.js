import { useEffect, useState } from 'react';
import './styles.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import BookSlider from '../BookSlider';
import { useDispatch, useSelector } from 'react-redux';
import { setBookSet } from '../../reducers/bookSlice';
import axios from 'axios';
import urls from '../../utils/urls';
const ages = 15;

const MAX = 10;

const BrowseLibrary = () => {
	const dispatch = useDispatch();
	const [ age, setAge ] = useState(0);
	const { book: { bookSet } } = useSelector(state => state);

	const getBookSet = async() => {
		try {
			const response = await axios.get(urls.getBookSet, { params: { age } });
			dispatch(setBookSet({bookSet: response.data.book_set}));
			console.log(response.data.book_set);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(
		() => {
			getBookSet();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[age]
	);

	return (
		<div className="browse-library">
			<div className="age-groups">
				<h2>Select By Age</h2>
				<ScrollContainer vertical={false}>
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
