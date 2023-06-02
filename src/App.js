import { useEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BrowseLibrary from './components/BrowseLibrary';
import YourLibrary from './components/YourLibrary';
import MostPopular from './components/BrowseLibrary/MostPopular';
import Landing from './components/Landing';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/Login/ForgotPassword';
import Content from './components/Content';
import HowItWorks from './components/Content/HowItWorks';
import SearchBooks from './components/BrowseLibrary/SearchBooks';
import Book from './components/Book';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetAlert } from './reducers/mainSlice';
import devUrls from './utils/devUrls';
import axios from 'axios';

const App = () => {
	const { book: {loading}, main: { alert, user, isLoggedIn } } = useSelector(state => state);
	const location = useLocation();
	const dispatch = useDispatch();

	const refresh = async () => {
		try {
			const response = await axios.get(devUrls.getUser, {withCredentials: true});
			if(response.data.user)
				dispatch(login({user: response.data.user}));
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(
		() => {
			window.scrollTo(0, 0);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ location ]
	);

	useEffect(
		() => {
			if (alert) setTimeout(() => dispatch(resetAlert()), 3000);
		},
		[ dispatch, alert ]
	);

	return (
		<div className="app">
			{alert.text && <p className="alert" style={{ backgroundColor: alert.color }}>{alert.text}</p>}
			{loading && 
				<div className="loading-spinner-container">
					<div className='loading-spinner'></div>
				</div>
			}
			<Header />
			<Routes>
				<Route path="/most-popular" element={<MostPopular />} />
				<Route path="/browse-library" element={<BrowseLibrary />} />
				<Route path="/book/:isbn" element={isLoggedIn ? <Book /> : <Navigate to='/'/>} />
				<Route path="/search-books" element={<SearchBooks />} />
				<Route path='/your-library' element={isLoggedIn ? <YourLibrary /> : <Navigate to='/'/>}/>
				<Route path="/forgot-password" element={isLoggedIn ? <Navigate to='/'/> : <ForgotPassword />} />
				<Route path="/login" element={isLoggedIn ? <Navigate to='/'/> : <Login />} />
				<Route path="/register" element={isLoggedIn ? <Navigate to='/'/> : <Register />} />
				<Route path="/pricing" element={<Pricing/>}/>
				<Route path="/how-it-works" element={<HowItWorks/>} />
				<Route path="/about-us" element={<Content type='About Us'/>} />
				<Route path="/contact-us" element={<Content type='Contact Us'/>} />
				<Route path="/disclaimer" element={<Content type='Disclaimer'/>} />
				<Route path="/privacy-policy" element={<Content type='Privacy Policy'/>} />
				<Route path="/refund-policy" element={<Content type='Refund Policy'/>} />
				<Route path="/terms-and-conditions" element={<Content type='Terms and Conditions'/>} />
				<Route path="/" element={<Landing />} />
			</Routes>
			<Footer />
		</div>
	);
};

export default App;
