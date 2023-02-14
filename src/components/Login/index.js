import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setAlert,
	setRegisterDetails,
	login,
} from '../../reducers/mainSlice';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import axios from 'axios';
import devUrls from '../../utils/devUrls';
import { Link, useNavigate } from 'react-router-dom';
import './styles.scss';

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { mobileNumber, password } = useSelector(state => state.main.registerDetails);
	const [ showPassword, setShowPassword ] = useState(false);

	const handleSubmit = async event => {
		event.preventDefault();
		try {
			const response = await axios.post(devUrls.login, { password, mobile_number: mobileNumber }, { withCredentials: true });
			dispatch(login({ user: response.data.user }));
			navigate('/your-library');
		} catch (err) {
			dispatch(setAlert({ text: err.response.data.message, color: '#F75549' }));
			console.log(err);
		}
	};

	useEffect(() => {
		if(!mobileNumber)
			navigate('/');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="form-container">
			<form className="form">
				<h2>Login</h2>
				<div className="input-field">
					<label>Mobile Number</label>
					<input type="text" value={mobileNumber} readOnly={true} />
				</div>
				<div className="input-field password-field">
					<label>Password</label>
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ password: value.trim() }))}
						autoComplete="new-password"
					/>
					{showPassword
						? <AiFillEye onClick={() => setShowPassword(false)} />
						: <AiFillEyeInvisible onClick={() => setShowPassword(true)} />}
				</div>
				<Link to='/forgot-password' className='secondary-text'>Forgot Password?</Link>
				<button className="blue-button" onClick={handleSubmit}>Login</button>
			</form>
		</div>
	);
};

export default Login;
