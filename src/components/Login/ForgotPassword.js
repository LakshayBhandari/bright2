import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import OTPInput from 'otp-input-react';
import { useNavigate } from 'react-router-dom';
import { FaHourglassEnd } from 'react-icons/fa';
import axios from 'axios';
import devUrls from '../../utils/devUrls';
import { setAlert } from '../../reducers/mainSlice';

const ForgotPassword = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [ otp, setOtp ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ showPassword, setShowPassword ] = useState(false);
	const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
	const [ seconds, setSeconds ] = useState(60);
	const { mobileNumber } = useSelector(state => state.main.registerDetails);

	const sendOtp = async () => {
		try {
			await axios.post(devUrls.resendOtp, { mobile_number: mobileNumber }, { withCredentials: true });
			dispatch(setAlert({ text: 'OTP sent', color: '#33A200' }));
			setSeconds(60);
		} catch (err) {
			dispatch(setAlert({ text: 'Unable to resend OTP, try again later', color: '#F75549' }));
		}
	};

	const forgotPassword = async (event) => {
        event.preventDefault();
		try {
			await axios.post(
				devUrls.forgotPassword,
				{ otp, password, mobile_number: mobileNumber, confirm_password: confirmPassword },
				{ withCredentials: true }
			);
			navigate('/login');
			dispatch(setAlert({ text: 'Password updated', color: '#33A200' }));
		} catch (err) {
			dispatch(setAlert({ text: err.response.data.message, color: '#F75549' }));
		}
	};

	useEffect(
		() => {
			if (mobileNumber) sendOtp();
			else navigate('/');
		},
        // eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	useEffect(
		() => {
			const interval = setInterval(
				() => {
					if (seconds > 0) setSeconds(_ => _ - 1);
				},
				1000
			);
			return () => {
				clearInterval(interval);
			};
            // eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ seconds ]
	);

	return (
		<div className="otp form-container">
			<form className="otp-form form">
				<h2>Forgot Password</h2>
				<div className="input-field">
					<label>
						<p>Mobile Number</p>
					</label>
					<input type="number" value={mobileNumber} readOnly={true} />
				</div>
				<div className="input-field">
					<label>OTP</label>
					<div className="otp-field">
						<OTPInput
							value={otp}
							onChange={newOtp => setOtp(newOtp)}
							autoFocus={true}
							OTPLength={6}
							otpType="number"
							disabled={false}
							secure={false}
							inputStyles={{ width: '3.25rem', height: '3.25rem', margin: '0.35rem' }}
						/>
					</div>
				</div>
				<div className="input-field password-field">
					<label>Password</label>
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={({ target: { value } }) => setPassword(value.trim())}
						autoComplete="new-password"
					/>
					{showPassword
						? <AiFillEye onClick={() => setShowPassword(false)} />
						: <AiFillEyeInvisible onClick={() => setShowPassword(true)} />}
				</div>
				<div className="input-field password-field">
					<label>Confirm Password</label>
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						value={confirmPassword}
						onChange={({ target: { value } }) => setConfirmPassword(value.trim())}
						autoComplete="new-password"
					/>
					{showConfirmPassword
						? <AiFillEye onClick={() => setShowConfirmPassword(false)} />
						: <AiFillEyeInvisible onClick={() => setShowConfirmPassword(true)} />}
				</div>
				{seconds > 0
					? <div className="resend-otp secondary-text">
							<p className="secondary-text"><b>{seconds} seconds</b></p>
							<FaHourglassEnd />
						</div>
					: <input type="button" value="Resend OTP" onClick={sendOtp} className="resend-otp-button" />}
				<button type="submit" className="blue-button" onClick={forgotPassword}>Update Password</button>
			</form>
		</div>
	);
};

export default ForgotPassword;
