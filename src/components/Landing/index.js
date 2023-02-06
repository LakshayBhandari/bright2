import { useState, useEffect } from 'react';
import Plans from '../Plans';
import './styles.scss';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import devUrls from '../../utils/devUrls';
import { Link } from 'react-router-dom';
import { faqs, illustrations, process } from './constants';
import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { flushRegisterDetails, setAlert, setRegisterDetails } from '../../reducers/mainSlice';

const Landing = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { main: { isLoggedIn, registerDetails: { mobileNumber } } } = useSelector(
		state => state
	);
	const [ isShowingFaq, setIsShowingFaq ] = useState(Array(faqs.length).fill(false));

	const toggleFaq = (i, showing) => {
		const newIsShowingFaqs = isShowingFaq.map((showingFaq, j) => {
			if (i === j) return showing;
			return showingFaq;
		});
		setIsShowingFaq(newIsShowingFaqs);
	};

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
			<div className="hero" style={{ backgroundImage: 'url(/hero.png)' }}>
				<h3>Delhi-NCR’s Largest Online Library Service</h3>
				<h1>Online Book Library</h1>
				<h2>You Order - We Deliver</h2>
				{!isLoggedIn && <form className="mobile-number">
					<input
						type="number"
						placeholder="Enter Mobile Number..."
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ mobileNumber: value }))}
					/>
					<input type="submit" value="Go" onClick={goToRegister} />
				</form>}
			</div>
			<div className="process">
				{process.map((step, i) => {
					return (
						<div className="step" key={i}>
							{step.text}
							<h1 className="step-count">{i + 1}</h1>
							<img src={step.image} alt="Process" loading="lazy"/>
							<h2>{step.title}</h2>
						</div>
					);
				})}
			</div>
			<div className="illustrations">
				{illustrations.map((illustration, i) => {
					return (
						<div
							className="illustration"
							style={{ backgroundColor: illustration.color, borderColor: illustration.borderColor }}
							key={i}
						>
							<div className="illustration-text">
								<h1>{illustration.title}</h1>
								<p>{illustration.text}<br />Leave it to us!</p>
							</div>
							<img src={illustration.image} alt="Illustration"  loading="lazy"/>
						</div>
					);
				})}
			</div>
			<Link to="/browse-library" className="gold-button">Browse Library</Link>
			<div className="faqs" id='faqs'>
				<h1>Frequently Asked Questions</h1>
				<div className="faq-accordion">
					{faqs.map((faq, i) => {
						return (
							<div className="faq" key={i}>
								<div className="question">
									<p>{faq.question}</p>
									{isShowingFaq[i]
										? <AiOutlineUp onClick={() => toggleFaq(i, false)} />
										: <AiOutlineDown onClick={() => toggleFaq(i, true)} />}
								</div>
								{isShowingFaq[i] && <p className="answer">{faq.answer}</p>}
							</div>
						);
					})}
				</div>
			</div>
			<Plans />
		</main>
	);
};

export default Landing;
