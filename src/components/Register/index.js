import { useState, useEffect, Fragment } from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { login, setAlert, flushRegisterDetails } from '../../reducers/mainSlice';
import { registerFlow } from './constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import devUrls from '../../utils/devUrls';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import BrowseLibraryLinks from '../Content/BrowseLibraryLinks';

const Register = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { main: { registrationStep, registerDetails: { registrationDone, paymentDone, mobileNumber } } } = useSelector(
		state => state
	);
	const [ password, setPassword ] = useState('12345');
	const [ isEditing, setIsEditing ] = useState(false);
	const [ showPassword, setShowPassword ] = useState(false);

	const finishRegistration = async () => {
		try {
			if(!password || password.length < 5)
				dispatch(setAlert({ text: 'Password should be atleast of 5 characters', color: '#F75549' }));
			await axios.post(devUrls.changePassword, {password}, {withCredentials: true});
			const response = await axios.get(devUrls.getUser, { withCredentials: true });
			dispatch(login({ user: response.data.user }));
			navigate('/browse-library');
			dispatch(flushRegisterDetails());
			dispatch(setAlert({ text: "Registered successfully", color: '#33A200' }));
		} catch (err) {
			dispatch(setAlert({ text: err.response.data.message, color: '#F75549' }));
			console.log(err);
		}
	};

	useEffect(
		() => {
			if (!mobileNumber) navigate('/');
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<Fragment>
			{registrationDone &&
				<div className='backdrop'>
					<div className="payment-done">
						<h1>Congratulations!</h1>
						<b>Your details have been saved</b>
						<p>Thank you for subscribing</p>
						<div className="login-details">
							<span>Mobile Number</span>
							<p>{mobileNumber}</p>
						</div>
						<div className="password-field login-details">
							<span>Password</span>
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={({ target: { value } }) => setPassword(value)}
								disabled={!isEditing}
							/>
							{showPassword
								? <AiFillEye onClick={() => setShowPassword(false)} />
								: <AiFillEyeInvisible onClick={() => setShowPassword(true)} />}
						</div>
						<p className="password-edit" onClick={() => setIsEditing(_ => !_)}>
							{isEditing ? 'Done' : 'Edit'}
						</p>
						<span>You will receive a confirmation through SMS</span>
						<button className="blue-button" onClick={finishRegistration}>Browse Library</button>
					</div>
				</div>}
			<div className="register" style={paymentDone || registrationDone ? { opacity: '0.1' } : {}}>
				{registerFlow[registrationStep].element}
			</div>
			<BrowseLibraryLinks/>
		</Fragment>
	);
};

export default Register;
/*
<div className="progress-bar">
	{registerFlow.map((step, i) => {
		const style = i <= registrationStep ? { backgroundColor: '#343434' } : { backgroundColor: '#B0AFAF' };
		return (
			<div key={i} className="step">
				{i > 0 && <div className="line" style={style} />}
				<div className="step-title">
					<div className="circle" style={style} />
					<p>{step.title}</p>
				</div>
			</div>
		);
	})}
</div>
*/
