import React, { Fragment, useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/basketActions';

const PaymentScreen = ({ history }) => {
	const user = useSelector((state) => state.user);
	const { userStatus } = user;

	const basket = useSelector((state) => state.basket);
	const { deliveryAddress } = basket;

	const dispatch = useDispatch();

	useEffect(() => {
		if (userStatus === 'logout') {
			history.push('/');
		}
		if (!deliveryAddress) {
			history.push('/delivery');
		}
	}, [userStatus, history, deliveryAddress]);

	const [paymentMethod, setPaymentMethod] = useState(null);

	function submitHandler(e) {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		history.push('/placeorder');
	}

	return (
		<Fragment>
			<CheckoutSteps step1 step2 step3 />
			<FormContainer>
				<h1>Payment Method</h1>
				<Form onSubmit={submitHandler}>
					<Form.Group>
						<Form.Label as='legend'>Select Method</Form.Label>
						<Col>
							<Form.Check
								type='radio'
								label='Paypal or Credit Card'
								id='PayPal'
								name='paymentMethod'
								value='PayPal'
								onChange={(e) => setPaymentMethod(e.target.value)}
							></Form.Check>
							<Form.Check
								type='radio'
								label='Stripe'
								id='Stripe'
								name='paymentMethod'
								value='Stripe'
								onChange={(e) => setPaymentMethod(e.target.value)}
							></Form.Check>
						</Col>
					</Form.Group>
					<Button type='submit' variant='primary' disabled={paymentMethod === null}>
						Continue
					</Button>
				</Form>
			</FormContainer>
		</Fragment>
	);
};

export default PaymentScreen;
