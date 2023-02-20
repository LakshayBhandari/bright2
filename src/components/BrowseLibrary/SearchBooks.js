import BookSlider from '../BookSlider';
import { useSelector } from 'react-redux';
import './styles.scss';

const SearchBooks = () => {
	const { book: {searchedBooks} } = useSelector(state => state);

	return (
		<div className="search-books">
			{!searchedBooks?.length && <h3 className="info">Enter a query of atleast 3 characters to search</h3>}
			{searchedBooks?.length
				? <BookSlider books={searchedBooks} title="Books" showOverlay={true}/>
				: searchedBooks && <p>No books found</p>
            }
		</div>
	);
};

export default SearchBooks;
