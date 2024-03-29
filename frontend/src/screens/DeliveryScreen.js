import React, { Fragment, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveDeliveryAddress } from '../actions/basketActions';

const DeliveryScreen = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const { userStatus } = user;
	const basket = useSelector((state) => state.basket);
	const { deliveryAddress } = basket;

	useEffect(() => {
		if (userStatus === 'logout') {
			history.push('/');
		}
	}, [userStatus, history]);

	const [address, setAddress] = useState(deliveryAddress.address || '');
	const [city, setCity] = useState(deliveryAddress.city || '');
	const [postCode, setPostCode] = useState(deliveryAddress.postCode || '');
	const [country, setCountry] = useState(deliveryAddress.country || '');

	function submitHandler(e) {
		e.preventDefault();
		dispatch(saveDeliveryAddress({ address, city, postCode, country }));
		history.push('/payment');
	}

	return (
		<Fragment>
			<CheckoutSteps step1 step2 />
			<FormContainer>
				<h4>Please Enter Delivery Address</h4>
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='address'>
						<Form.Label>Address</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter Address'
							onChange={(e) => setAddress(e.target.value)}
							value={address}
							required
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='city'>
						<Form.Label>City</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter City'
							onChange={(e) => setCity(e.target.value)}
							value={city}
							required
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='postCode'>
						<Form.Label>Post Code</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter Post Code'
							onChange={(e) => setPostCode(e.target.value)}
							value={postCode}
							required
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='country'>
						<Form.Label>Country</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter Country'
							onChange={(e) => setCountry(e.target.value)}
							value={country}
							required
						></Form.Control>
					</Form.Group>

					<Button type='submit' variant='primary'>
						Continue
					</Button>
				</Form>
			</FormContainer>
		</Fragment>
	);
};

export default DeliveryScreen;
