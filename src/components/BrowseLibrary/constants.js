export const ageGroups = [
	{ id: 1, color: '#F75549', age: '0-2' },
	{ id: 2, color: '#FF8513', age: '3-5' },
	{ id: 3, color: '#F8B200', age: '6-8' },
	{ id: 4, color: '#33A200', age: '9-11' },
	{ id: 5, color: '#1596DC', age: '12-14' },
	{ id: 6, color: '#CB85C2', age: '15+' },
];

export const mustReadSections = [
	{
		title: 'Most Popular Series',
		largeText: 'Series',
		smallText: 'Most Popular',
	},
	{
		title: 'Best Seller Series',
		largeText: 'Bestseller',
		smallText: 'Series',
	},
	{
		title: 'Most Searched Tags',
		largeText: 'Tags',
		smallText: 'Most Searched',
	}, 
];

export const mustReadOptions = {
	'Most Popular Series': {
		category_count: 7,
		book_count: 4,
		section_name: 'Most Popular Series',
		randomize_categories: true
	},
	'Best Seller Series': {
		category_count: 4,
		book_count: 7,
		section_name: 'Best Seller Series',
		randomize_books: true
	},
	'Most Searched Tags': {
		category_count: 7,
		book_count: 4,
		section_name: 'Most Searched Tags',
		randomize_categories: true
	},
};