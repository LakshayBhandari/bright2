import { useDispatch, useSelector } from 'react-redux';
import { nextStepRegister, setAlert, setRegisterDetails } from '../../../reducers/mainSlice';
import './styles.scss';
import axios from 'axios';
import devUrls from '../../../utils/devUrls';
import { planPrices, planStats, plans } from './constants';
import {HiCheckCircle} from 'react-icons/hi';
import {Link} from 'react-router-dom';

const PlanDetails = () => {
	const dispatch = useDispatch();
	const {
		registerDetails: { paymentDone, mobileNumber, selectedPlan, selectedSubscription },
	} = useSelector(state => state.main);

	const selectPlan = async () => {
		if (!selectedPlan.planId) return dispatch(setAlert({ text: 'Please select a plan', color: '#F75549' }));
		try {
			await axios.post(devUrls.choosePlan, { mobile_number: mobileNumber, plan: selectedPlan.planId }, {
				withCredentials: true,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const selectPlanDuration = async () => {
		if (!selectedSubscription) return dispatch(setAlert({ text: 'Please select a subscription', color: '#F75549' }));
		try {
			await axios.post(
				devUrls.chooseSubscription,
				{ mobile_number: mobileNumber, plan_duration: selectedSubscription },
				{
					withCredentials: true,
				}
			);
		} catch (err) {
			console.log(err);
		}
	};

	const initiatePayment = async event => {
		event.preventDefault();
		await selectPlan();
		await selectPlanDuration();
		try {
			const response = await axios.post(
				devUrls.generateOrderId,
				{ mobile_number: mobileNumber, card: selectedSubscription },
				{ withCredentials: true }
			);
			const instance = window.Razorpay({
				...response.data,
				handler: async data => {
					await axios.post(
						devUrls.verifyOrder,
						{
							payment_id: data.razorpay_payment_id,
							order_id: data.razorpay_order_id,
							signature: data.razorpay_signature,
						},
						{ withCredentials: true }
					);
					await axios.post(
						devUrls.orderSuccessful,
						{
							order_id: data.razorpay_order_id,
							payment_id: data.razorpay_payment_id,
							mobile_number: mobileNumber,
						},
						{ withCredentials: true }
					);
					dispatch(setRegisterDetails({ paymentDone: true, paymentStatus: 'Paid' }));
					dispatch(nextStepRegister());
				},
			});
			instance.on('payment.failed', response => {
				dispatch(setAlert({ text: 'Payment failed! Try again later', color: 'F75549' }));
			});
			instance.open();
		} catch (err) {
			console.log(err);
		}
	};

	const getPrice = () => {
		return planPrices[selectedPlan.bookCount][selectedSubscription];
	};

	return (
		<div className='plan-details'>
			<h2>Choose your reading plan today</h2>
			<div className='plan-description'>
				<div className='plan-description-wrapper'>
					<p><HiCheckCircle/> Choose Any Book</p>
					<p><HiCheckCircle/> Free Doorstep Delivery</p>
					<p><HiCheckCircle/> Change/Cancel Anytime</p>
				</div>
			</div>
			<div className='plan-types'>
				{plans.map(plan => {
					return (
						<div 
							key={plan.planId} 
							className={`plan-type ${plan.bookCount === selectedPlan.bookCount ? 'selected-plan-type' : ''}`}
							onClick={() => dispatch(setRegisterDetails({ selectedPlan: plan }))}
						>
							<img 
								src={`/icons/${plan.bookCount}${plan.bookCount === selectedPlan.bookCount ? '-selected' : ''}.png`} 
								alt='Plan'
							/>
							<p>{plan.title}</p>
							<span>{plan.bookCount} {plan.bookCount === "1" ? 'Book' : 'Books'} / Week</span>
						</div>
					);
				})}
			</div>
			<div className='plan-stats'>
				{planStats.map((stat, i) => {
					return (
						<div key={stat.id} className='plan-stat'>
							<h3>{stat.title}</h3>
							<div className='plan-stat-items'>
								{stat.items.map((item, j) => {
									const className = j === selectedPlan.planId - 1 ? 'selected-plan-stat-item' : '';
									if(i === 0) {
										return (
											<h3 className={className} key={item.text}>
												{/* {item.strikedText && <s style={{color: 'red'}}>{item.strikedText}</s>}<br/> */}
												{item[selectedSubscription]}
											</h3>
										);
									}
									return (
										<p className={className} key={item.text}>
											{/* {item.strikedText && <s style={{color: 'red'}}>{item.strikedText}</s>}<br/> */}
											{item.text || item[selectedSubscription]}
										</p>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
			<div className='plan-durations'>
				<h3>Select Plan Duration</h3>
				<div className='plan-duration-list'>
					<div 
						className={`plan-duration ${selectedSubscription === 3 ? 'selected-plan-duration' : ''}`}
						onClick={() => dispatch(setRegisterDetails({ selectedSubscription: 3 }))}
					>
						<h3>Regular</h3>
						<p>₹ {planPrices[selectedPlan.bookCount][3]}/-</p>
					</div>
					<div 
						className={`plan-duration ${selectedSubscription === 6 ? 'selected-plan-duration' : ''}`}
						onClick={() => dispatch(setRegisterDetails({ selectedSubscription: 6 }))}
					>
						<h3>Saver</h3>
						<p>₹ {planPrices[selectedPlan.bookCount][6]}/-</p>
					</div>
					<div 
						className={`plan-duration ${selectedSubscription === 12 ? 'selected-plan-duration' : ''}`}
						onClick={() => dispatch(setRegisterDetails({ selectedSubscription: 12 }))}
					>
						<h3>Annual</h3>
						<p>₹ {planPrices[selectedPlan.bookCount][12]}/-</p>
						<div className='plan-discount'>
							<strong>Save ₹ {selectedPlan.savings}/-</strong>
						</div>
					</div>
				</div>
			</div>
			<div className='pay-button'>
				<button onClick={initiatePayment}>
					Pay ₹
					{Math.round(getPrice())}
					/-
				</button>
				<p className="razorpay">Secured by <img src="/icons/razorpay.png" alt="Razorpay" /></p>
			</div>
			{paymentDone &&
				<div className='backdrop'>
					<div className="payment-done">
						<h1>Congratulations!</h1>
						<b>Your payment was successful</b>
						<p>
							Thank you for subscribing!<br/>
							We will reach you out through WhatsApp soon.
						</p>
						<Link to='/browse-library'>Browse Library</Link>
					</div>
				</div>}
		</div>
	);
};

export default PlanDetails;
