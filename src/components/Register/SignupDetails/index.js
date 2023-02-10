import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setRegisterDetails, addChildToRegisterDetails } from '../../../reducers/mainSlice';
import axios from 'axios';
import devUrls from '../../../utils/devUrls';
import { getFormattedDate, getApiAgeGroup, getAgeGroupColor, getAge } from '../../../utils';
import { GoPlus } from 'react-icons/go';
import './styles.scss';

const SignupDetails = () => {
	const dispatch = useDispatch();
	const { name, mobileNumber, childName, childDateOfBirth, children, address, pinCode, contactNumber } = useSelector(
		state => state.main.registerDetails
	);
	const [sameAsLogin, setSameAsLogin] = useState(false);

	const addChild = async event => {
		if(event)
			event.preventDefault();
		if (!childName && !childDateOfBirth && !children.length)
			return dispatch(setAlert({ text: 'Add atleast 1 child', color: '#F75549' }));
		if (childName && childDateOfBirth) dispatch(addChildToRegisterDetails());
		else if (!children.length) return dispatch(setAlert({ text: 'Enter the details', color: '#F75549' }));
	};

	const handleSubmit = async event => {
		event.preventDefault();
		if (!name.trim().length) return dispatch(setAlert({ text: 'Enter your name', color: '#F75549' }));
		if (!children.length) return dispatch(setAlert({ text: 'Add atleast 1 child', color: '#F75549' }));
		if (!address.trim() || !pinCode.trim() || (!sameAsLogin && !contactNumber.trim()))
			return dispatch(setAlert({ text: 'Enter all the details', color: '#F75549' }));
		if (!sameAsLogin && contactNumber.length !== 10) return dispatch(setAlert({ text: 'Invalid contact number', color: '#F75549' }));
		await addChild(event);
		try {
			await axios.post(
				devUrls.signup,
				{
					name: name,
					mobile_number: mobileNumber,
					address,
					pin_code: pinCode,
					contact_number: sameAsLogin ? mobileNumber : contactNumber,
					children: children.map(child => {
						return {
							name: child.name,
							dob: getFormattedDate(child.dateOfBirth),
							age_group: getApiAgeGroup(child.dateOfBirth),
						};
					}),
				},
				{ withCredentials: true }
			);
            dispatch(setRegisterDetails({registrationDone: true}))
		} catch (err) {
			dispatch(setAlert({ text: err, color: '#F75549' }));
			console.log(err);
		}
	};

	useEffect(() => {
		if(childName && childDateOfBirth)
			addChild();
	}, [childDateOfBirth]);

	return (
		<div className="signup-details form-container">
			<form className="signup-details-form form">
				<h2>Add Details</h2>
				<div className="input-field">
					<label>Login Number</label>
					<input type="number" value={mobileNumber} readOnly={true} />
				</div>
				<div className="input-field">
					<label>Your Name</label>
					<input
						type="text"
						value={name}
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ name: value }))}
					/>
				</div>
				{children.length > 0 &&
					<div className="added-children">
						<p>Children</p>
						{children.map((child, i) => {
							return (
								<div className="child" key={i} style={{ backgroundColor: getAgeGroupColor(child.dateOfBirth) }}>
									<h3>{child.name}</h3>
									<p>{getAge(child.dateOfBirth)} years</p>
								</div>
							);
						})}
					</div>}
				<div className="input-field">
					<label>Child's Name</label>
					<input
						type="text"
						value={childName}
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ childName: value }))}
					/>
				</div>
				<div className="input-field">
					<label>Child’s DOB</label>
					<input
						type="date"
						value={childDateOfBirth}
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ childDateOfBirth: value.toString() }))}
					/>
				</div>
				<button className="add-child-button" onClick={event => addChild(event, false)}>
					<GoPlus /> Add Child
				</button>
				<div className="input-field">
					<label>Add Address</label>
					<textarea
						type="date"
						value={address}
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ address: value }))}
					/>
				</div>
				<div className="input-field">
					<label>PIN Code</label>
					<input
						type="text"
						value={pinCode}
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ pinCode: value.trim().slice(0, 6) }))}
					/>
				</div>
				<div className="input-field">
					<label>Contact / WhatsApp Number <img src='/icons/whatsapp.png' alt='WhatsApp'/></label>
					<input
						type="number"
						value={sameAsLogin ? mobileNumber : contactNumber}
						readOnly={sameAsLogin}
						onChange={({ target: { value } }) => dispatch(setRegisterDetails({ contactNumber: value }))}
					/>
				</div>
				<div className='same-as-login'>
					<input type='checkbox' value={sameAsLogin} onClick={() => setSameAsLogin(_ => !_)}/>
					<p>Same as login number</p>
				</div>
				<button className="blue-button" onClick={handleSubmit}>Add Details</button>
			</form>
		</div>
	);
};

export default SignupDetails;
