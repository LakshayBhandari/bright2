import { useEffect } from 'react';
import './styles.scss';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import devUrls from '../../utils/devUrls';
import { Link } from 'react-router-dom';
import { items, sections } from './constants';
import { useNavigate } from 'react-router-dom';
import { flushRegisterDetails, setAlert, setRegisterDetails } from '../../reducers/mainSlice';
import { Fragment } from 'react';

const Landing = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { main: { isLoggedIn, registerDetails: { mobileNumber } } } = useSelector(
		state => state
	);

	const goToRegister = async event => {
		event.preventDefault();
		if (mobileNumber.length !== 10) return dispatch(setAlert({ text: 'Invalid mobile number', color: '#F75549' }));
		try {
			const response = await axios.post(devUrls.submitMobileNumber, { mobile_number: mobileNumber }, {
				withCredentials: true,
			});
			const data = response.data;
			if(data.user) {
				dispatch(
					setRegisterDetails({
						paymentStatus: data.user.payment_status,
					})
				);
			}
			if (data.redirect.includes('login'))
				navigate('/login');
			else {
				dispatch(setRegisterDetails({ mobileNumber, otpSent: true }));
				navigate('/register');
			}
		} catch (err) {
			dispatch(setAlert({ text: err.response?.data?.message, color: '#F75549' }));
			console.log(err);
		}
	};

	useEffect(
		() => {
			dispatch(flushRegisterDetails());
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<main className="landing" id='home'>
			<div className="hero">
				<div className='hero-heading'>
					<h4>Delhi NCR - Largest</h4>
					<h1>Library - Home Delivered</h1>
				</div>
				<div className='hero-items'>
					{items.map(item => {
						return (
							<div key={item.id} className='hero-item'>
								<h3>{item.title}</h3>
								<span>{item.text}</span>
							</div>
						);
					})}
				</div>
				{!isLoggedIn && 
				<form className="mobile-number">
					<input
						type="number"
						placeholder="Enter Mobile Number..."
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ mobileNumber: value }))}
					/>
					<input type="submit" value="Get Started" onClick={goToRegister} />
				</form>}
			</div>
			<div className='sections'>
				{sections.map(section => {
					return (
						<div key={section.id} className='section'>
							<div className='section-wrapper'>
								<div className='section-info'>
									<div className='section-info-heading'>
										<h2>{section.title}</h2>
										<h2 style={{color: section.color}}>{section.subTitle}</h2>
									</div>
									<p>{section.text}</p>
									<Link to={section.link}>
										{section.icon || <Fragment/>}
										{section.linkText}
									</Link>
								</div>
								<div className='section-image'>
									<img src={section.image} alt='Section'/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
};

export default Landing;
