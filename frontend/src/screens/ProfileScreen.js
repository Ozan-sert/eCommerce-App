import React, { useState, useEffect } from 'react';
// Moment formats date
import Moment from 'react-moment';
import { Table, Form, Button, Row, Col, CloseButton } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, removeUserErrors, updateUserProfile } from '../actions/userActions';
import { listUserOrders, removeOrderErrors } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = ({ history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);

	const [alert, setAlert] = useState(false);
	const [errorOrdersAlert, setErrorOrdersAlert] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);

	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const { userInfo, userStatus, loading, success, error } = user;

	const orderUserList = useSelector((state) => state.orderUserList);
	const { status, error: errorOrders, orders } = orderUserList;

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});

	useEffect(() => {
		if (!userInfo || userStatus === 'logout') {
			history.push('/');
		} else {
			if (!userInfo.name || success) {
				dispatch({ type: USER_UPDATE_PROFILE_RESET });
				dispatch(getUserDetails('profile'));
			} else {
				setName(userInfo.name);
				setEmail(userInfo.email);
				setPassword('');
				setConfirmPassword('');
			}
		}
	}, [userStatus, history, dispatch, userInfo, success]);

	useEffect(() => {
		if (status === 'idle') {
			dispatch(listUserOrders());
		}
	}, [status, dispatch]);

	useEffect(() => {
		if (error) {
			setAlert(true);
		}
		if (errorOrders) {
			setErrorOrdersAlert(true);
		}
		if (success) {
			setSuccessAlert(true);
		}
	}, [error, errorOrders, success, userStatus, dispatch]);

	function dismissHandler1() {
		setAlert(false);
		dispatch(removeUserErrors());
	}

	function dismissHandler2() {
		setErrorOrdersAlert(false);
		dispatch(removeOrderErrors());
	}

	function dismissHandler3() {
		setSuccessAlert(false);
	}

	function submitHandler(e) {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Passwords don't match");
		} else {
			setMessage(null);
			dispatch(updateUserProfile({ id: user._id, name, email, password }));
		}
	}

	return (
		<Row>
			<Col xl={8}>
				<h2>My Orders</h2>
				{status === 'pending' ? (
					<Loader />
				) : errorOrdersAlert ? (
					<Message variant='danger'>
						{errorOrders} <CloseButton onClick={dismissHandler2} aria-label='Hide' />
					</Message>
				) : status === 'resolved' && orders.length > 0 ? (
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ORDER ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th>DETAILS</th>
							</tr>
						</thead>
						<tbody>
							{orders.map(
								(order) =>
									!order.isDeleted && (
										<tr key={order._id}>
											<td>{order._id}</td>
											<td>
												<Moment format='D/M/YY'>{order.createdAt}</Moment>
											</td>
											<td>{formatter.format(order.totalPrice)}</td>
											<td>
												{order.isPaid ? (
													<Moment format='D/M/YY'>{order.paidAt}</Moment>
												) : (
													<i className='fas fa-times' style={{ color: 'red' }}></i>
												)}
											</td>
											<td>
												{order.isDelivered ? (
													<Moment format='D/M/YY'>{order.deliveredAt}</Moment>
												) : (
													<i className='fas fa-times' style={{ color: 'red' }}></i>
												)}
											</td>
											<td>
												<LinkContainer to={`/orders/${order._id}`}>
													<Button className='btn-sm' variant='link'>
														Details
													</Button>
												</LinkContainer>
											</td>
										</tr>
									)
							)}
						</tbody>
					</Table>
				) : (
					<Message>You have no previous orders</Message>
				)}
			</Col>
			<Col lg={4}>
				<h2>User Profile</h2>
				{message && <Message variant='danger'>{message}</Message>}
				{successAlert && (
					<Message variant='success'>
						Profile Updated <CloseButton onClick={dismissHandler3} aria-label='Hide' />
					</Message>
				)}
				{alert && (
					<Message variant='danger'>
						{error} <CloseButton onClick={dismissHandler1} aria-label='Hide' />
					</Message>
				)}
				{loading && <Loader />}

				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter Name'
							onChange={(e) => setName(e.target.value)}
							value={name}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='email'>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type='email'
							placeholder='Enter Email'
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Enter Password'
							onChange={(e) => setPassword(e.target.value)}
							value={password}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='confirm-password'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm Password'
							onChange={(e) => setConfirmPassword(e.target.value)}
							value={confirmPassword}
						></Form.Control>
					</Form.Group>

					<Button type='submit' variant='primary'>
						Update
					</Button>
				</Form>
			</Col>
		</Row>
	);
};

export default ProfileScreen;
