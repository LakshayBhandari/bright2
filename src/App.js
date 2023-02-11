import { useEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BrowseLibrary from './components/BrowseLibrary';
import MustRead from './components/BrowseLibrary/MustRead';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Register from './components/Register';
import Content from './components/Content';
import HowItWorks from './components/Content/HowItWorks';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetAlert } from './reducers/mainSlice';
import axios from 'axios';
import devUrls from './utils/devUrls';

const App = () => {
	const { main: { alert, user, isLoggedIn } } = useSelector(state => state);
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
			<Header />
			<Routes>
				<Route path="/must-read" element={<MustRead />} />
				<Route path="/browse-library" element={<BrowseLibrary />} />
				<Route path="/register" element={isLoggedIn ? <Navigate to='/'/> : <Register />} />
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
