import { useDispatch, useSelector } from 'react-redux';
import { goToStepRegister, nextStepRegister } from '../../../reducers/mainSlice';
import { GoCheck } from 'react-icons/go';
import './styles.scss';

const TaskDetails = () => {
	const dispatch = useDispatch();
	const { main: { registerDetails: { paymentDone, registrationDone, paymentStatus } } } = useSelector(
		state => state
	);

	const getButtonText = () => {
		if (registrationDone) return 'Finish';
		else if (paymentDone || paymentStatus === 'Paid') return 'Add Details';
		return 'Choose Plan';
	};

	const handleSubmit = event => {
		event.preventDefault();
		if(paymentDone || paymentStatus === 'Paid') 
			return dispatch(goToStepRegister({i: 3}));
		dispatch(nextStepRegister());
	};

	return (
		<div className="task-details form-container">
			<form className="task-details-form form">
				<h2>Task Details</h2>
				<div className="task-list">
					<div className="task" style={paymentDone || paymentStatus === 'Paid' ? { backgroundColor: 'rgba(0, 146, 67, 0.15)' } : {}}>
						<GoCheck style={paymentDone || paymentStatus === 'Paid' ? { backgroundColor: '#009243' } : {}} />
						{' '}
						<p style={paymentDone || paymentStatus === 'Paid' ? { color: '#009243' } : {}}>Select Plan and Payment</p>
						{(paymentDone || paymentStatus === 'Paid') && <p className="payment-text">You will recieve a confirmation through SMS </p>}
					</div>
					<div className="task" style={registrationDone ? { backgroundColor: 'rgba(0, 146, 67, 0.15)' } : {}}>
						<GoCheck style={registrationDone ? { backgroundColor: '#009243' } : {}} />
						{' '}
						<p style={registrationDone ? { color: '#009243' } : {}}>Add Details</p>
					</div>
					<div className="task-line" />
				</div>
				<button type="submit" className="blue-button" onClick={handleSubmit}>{getButtonText()}</button>
			</form>
		</div>
	);
};

export default TaskDetails;

/*
if (registrationDone) return 'Finish';
else if (paymentDone || paymentStatus === 'Paid') return 'Add Details';
else if (verificationDone) return 'Choose Plan';
return 'Verify OTP';

<div className="task" style={verificationDone ? { backgroundColor: 'rgba(0, 146, 67, 0.15)' } : {}}>
	<GoCheck style={verificationDone ? { backgroundColor: '#009243' } : {}} />
	{' '}
	<p style={verificationDone ? { color: '#009243' } : {}}>Verify Mobile Number</p>
</div>
*/
