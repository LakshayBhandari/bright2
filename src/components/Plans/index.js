import { Fragment, useEffect, useState } from 'react';
import './styles.scss';
import { plans } from './constants';
import { useSelector, useDispatch } from 'react-redux';
import { setRegisterDetails } from '../../reducers/mainSlice';
import {Link} from 'react-router-dom';

const Plans = ({ select = false }) => {
	const dispatch = useDispatch();
	const [ hoveringPlan, setHoveringPlan ] = useState(-1);
	const {registerDetails: {selectedPlan}, isLoggedIn, user} = useSelector(state => state.main);
	const [currentPlan, setCurrentPlan] = useState({});

	useEffect(() => {
		if(user.books_per_week) {

		setCurrentPlan(plans.find(plan => {
			return plan.bookCount === user.books_per_week.toString()}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const getPlan = (plan, i) => {
		if(!plan)
			return <Fragment/>
		return (
			<Link to='/#home'>
				<div
					className="plan"
					key={i}
					style={{ ...plan }}
					onMouseOver={() => setHoveringPlan(i)}
					onMouseLeave={() => setHoveringPlan(-1)}
					onClick={() => dispatch(setRegisterDetails({ selectedPlan: plan }))}
				>
					<h1
						style={{
							color: hoveringPlan === i || (select && selectedPlan.bookCount === plan.bookCount)
								? plan.backgroundColor
								: plan.borderColor,
							backgroundColor: hoveringPlan === i || (select && selectedPlan.bookCount === plan.bookCount)
								? plan.borderColor
								: 'transparent',
						}}
					>
						{plan.bookCount}
					</h1>
					<h3
						style={{
							color: hoveringPlan === i || (select && selectedPlan.bookCount === plan.bookCount)
								? plan.backgroundColor
								: plan.borderColor,
							backgroundColor: hoveringPlan === i || (select && selectedPlan.bookCount === plan.bookCount)
								? plan.borderColor
								: 'transparent',
						}}
					>
						Book/week
					</h3>
					<div className="price-container">
						<img alt="Plan" src={plan.image} />
						<div className="price">
							<h3>Rs.{plan.price}/-</h3>
							<p>per month</p>
						</div>
					</div>
				</div>
			</Link>
		);
	};

	return (
		<div className="plans">
			<h2>
				{isLoggedIn ? 'Your Current Plan' : 'Choose your Plan'}
			</h2>
			<div className="plan-list" style={isLoggedIn ? {gridTemplateColumns: '1fr', width: '200px'} : {}}>
				{isLoggedIn
					?
					getPlan(currentPlan, 0)
					:
					plans.map((plan, i) => {
						return getPlan(plan, i)
				})}
			</div>
			{isLoggedIn && <button className='gold-button'>Upgrade Plan</button>}
		</div>
	);
};

export default Plans;
