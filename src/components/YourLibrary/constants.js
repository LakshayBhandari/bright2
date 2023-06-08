export const bookArchives = [
	{
		title: 'Current Books',
		emptyText: <div><h1>No Books</h1><h3>Borrowed yet</h3></div>,
		emptyImage: '/icons/current-books.png',
		name: 'currentBooks',
		overlay: 'current',
	},
	{
		title: 'Rate Previous Books',
		emptyText: <div><h1>No Books</h1><h3>to rate right now</h3></div>,
		emptyImage: '/icons/rate-previous-books.png',
		name: 'previousBooks',
		overlay: 'previous',
	},
	{
		title: 'Book Dump',
		emptyText: <div><h3>Book Dump</h3><h1>is Empty</h1></div>,
		emptyImage: '/icons/book-dump.png',
		name: 'dumpedBooks',
		overlay: 'dump',
	},
];

export const suggestedCategories = [
	{
		name: 'Beatrix Potter',
		image: '/images/Authors/Beatrix Potter.jpg',
	},
	{
		name: 'Penguin',
		image: './images/Publishers/Penguin.png',
	},
	{
		name: 'Charlie and Lola',
		image: '/images/Series/Charlie and Lola.jpg',
	},
	{
		name: 'First Readers',
		image: './images/Type of Books/First Readers.png',
	},
	{
		name: 'Bill Bryson',
		image: '/images/Authors/Bill Bryson.jpg',
	},
	{
		name: 'Puffin',
		image: './images/Publishers/Puffin.png',
	},
	{
		name: 'Clarice Bean',
		image: '/images/Series/Clarice Bean.jpg',
	},
	{
		name: 'Early Learners',
		image: './images/Type of Books/Early Learners.png',
	},
	{
		name: 'C. S. Lewis',
		image: '/images/Authors/C. S. Lewis.jpg',
	},
	{
		name: 'Scholastic',
		image: './images/Publishers/Scholastic.png',
	},
	{
		name: 'Diary of a Wimpy Kid',
		image: '/images/Series/Diary of a Wimpy Kid.jpg',
	},
	{
		name: 'Novel',
		image: './images/Type of Books/Novel.png',
	},
];

/*
<div className="bucket">
	<h3>Next Delivery Bucket</h3>
	{orderBucket.length > 0 &&
		<div className="bucket-details">
			<div className="bucket-list">
				{orderBucket.map((book, i) => {
					return (
						<div className="bucket-book" key={i}>
							<img src={book.image} alt="Book" />
						</div>
					);
				})}
			</div>
			<p>Order Placed</p>
		</div>}
	{orderBucket.length === 0 && bucket.length > 0 &&
		<div className="bucket-details">
			<div className="bucket-list">
				{bucket.map((book, i) => {
					return (
						<div className="bucket-book" key={i}>
							<img src={book.image} alt="Book" />
							<div
								onClick={() => removeBucket(book)}
								className={`bucket-book-overlay ${changingBucket ? 'show-overlay' : ''}`}
							>
								<MdClose />
								<p>Remove</p>
							</div>
						</div>
					);
				})}
			</div>
			<div className="bucket-actions">
				<button onClick={() => setChangingBucket(_ => !_)}>
					{changingBucket ? 'Confirm' : 'Change'}
				</button>
				<button onClick={placeOrder}>Place Order</button>
			</div>
		</div>}
	{!orderBucket.length && !bucket.length &&
		<button className='blue-button create-bucket' onClick={createBucket}>Create Bucket</button>}
	<button className="blue-button date-button">
		<span>Delivery Date{user.next_delivery_date && ` - ${getDate(user.next_delivery_date)}`}</span>
		<FaEdit/>
		<input type='date' onChange={updateDeliveryDate}/>
	</button>
	{user.next_delivery_date && 
	<div className="time-date">
		<div className="time-date-column">
			<img src="/icons/time.png" alt="Time" />
			<p>Time - {user.delivery_time}</p>
		</div>
		<div className="time-date-column">
			<FaCalendar />
			<p>Day - {getDay(user.next_delivery_date)}</p>
		</div>
	</div>}
</div>
*/