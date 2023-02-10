import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OTPInput from 'otp-input-react';
import { useDispatch, useSelector } from 'react-redux';
import { goToStepRegister, nextStepRegister, setAlert, setRegisterDetails } from '../../../reducers/mainSlice';
import { FaHourglassEnd } from 'react-icons/fa';
import './styles.scss';
import axios from 'axios';
import devUrls from '../../../utils/devUrls';

const OTP = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { main: { registerDetails: { mobileNumber, otp, otpSent, paymentStatus } } } = useSelector(
		state => state
	);
	const [ seconds, setSeconds ] = useState(60);
	const [isEditing, setIsEditing] = useState(false);

	const handleSubmit = async event => {
		event.preventDefault();
		try {
			await axios.post(
				devUrls.confirmMobileNumber,
				{ mobile_number: mobileNumber, otp },
				{ withCredentials: true }
			);
			dispatch(setRegisterDetails({ verificationDone: true, otpSent: false }));
			if(paymentStatus === 'Paid')
				dispatch(goToStepRegister({i: 3}));
			else
				dispatch(nextStepRegister());
		} catch (err) {
			dispatch(setAlert({ text: err.response.data.message, color: '#F75549' }));
		}
	};

	const resendOtp = async () => {
		if (mobileNumber.length !== 10) return dispatch(setAlert({ text: 'Invalid mobile number', color: '#F75549' }));
		try {
			await axios.post(devUrls.resendOtp, { mobile_number: mobileNumber }, { withCredentials: true });
			dispatch(setAlert({ text: 'OTP resent successfully', color: '#33A200' }));
			setSeconds(60);
		} catch (err) {
			dispatch(setAlert({ text: 'Unable to resend OTP, try again later', color: '#F75549' }));
		}
	};

	useEffect(
		() => {
			if (!otpSent) return navigate('/');
			const interval = setInterval(
				() => {
					if (seconds > 0) setSeconds(_ => _ - 1);
				},
				1000
			);
			return () => {
				clearInterval(interval);
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ seconds ]
	);

	return (
		<div className="otp form-container">
			<form className="otp-form form">
				<h2>Verify Mobile Number</h2>
				<div className='input-field'>
					<label>
						<p>Mobile Number</p>
						<span onClick={() => setIsEditing(_ => !_)}>
							{isEditing ? 'Done' : 'Edit'}
						</span>
					</label>
					<input
						type="number"
						value={mobileNumber}
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ mobileNumber: value }))}
						onKeyDown={event => {
							if (event.keyCode === 13) event.keyCode = 9;
							return event.keyCode;
						}}
						disabled={!isEditing}
					/>
				</div>
				<div className="input-field">
					<label>OTP</label>
					<div className='otp-field'>
						<OTPInput
							value={otp}
							onChange={newOtp => dispatch(setRegisterDetails({ otp: newOtp }))}
							autoFocus={true}
							OTPLength={6}
							otpType="number"
							disabled={false}
							secure={false}
							inputStyles={{ width: '3.25rem', height: '3.25rem', margin: '0.35rem' }}
						/>
					</div>
				</div>
				{seconds > 0
					? <div className="resend-otp secondary-text">
							<p className="secondary-text"><b>{seconds} seconds</b></p>
							<FaHourglassEnd />
						</div>
					: <input type="button" value="Resend OTP" onClick={resendOtp} className="resend-otp-button" />}
				<button type="submit" className="blue-button" onClick={handleSubmit}>Confirm OTP</button>
			</form>
		</div>
	);
};

export default OTP;
