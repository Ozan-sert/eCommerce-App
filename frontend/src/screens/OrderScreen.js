import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, CloseButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { deliverOrder, getOrderDetails, payOrder, removeOrderErrors } from '../actions/orderActions';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';
import { addOrderToBasket, basketReset } from '../actions/basketActions';

const OrderScreen = ({ history, match }) => {
	const orderId = match.params.id;

	const [sdkReady, setSdkReady] = useState(false);
	const [alert, setAlert] = useState(false);

	const dispatch = useDispatch();

	const user = useSelector((state) => state.user);
	const { userStatus, userInfo } = user;

	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, success, error, status } = orderDetails;

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});

	
	if (order) {
		order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
	}

	const addPayPalScript = async () => {
		const { data: clientId } = await axios.get('/api/config/paypal');
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
		script.async = true;
		script.onload = () => {
			setSdkReady(true);
		};
		document.body.appendChild(script);
	};

	useEffect(() => {
		if (userStatus === 'logout') {
			history.push('/');
		}
	}, [userStatus, history]);

	useEffect(() => {
		if (success) {
			dispatch(basketReset());
		}
	}, [dispatch, success]);

	useEffect(() => {
		if (error) {
			setAlert(true);
		}
	}, [error, dispatch]);

	function dismissHandler() {
		setAlert(false);
		dispatch(removeOrderErrors());
	}

	useEffect(() => {
		setTimeout(() => {
			dispatch(getOrderDetails(orderId));
		}, 1000 * 60 * 60);
		dispatch(basketReset());
	}, [dispatch, orderId]);

	useEffect(() => {
		if (!order || order._id !== orderId || success) {
			if (status === 'idle' || status === 'resolved') {
				dispatch({ type: ORDER_PAY_RESET });
				dispatch({ type: ORDER_DELIVER_RESET });
				dispatch(getOrderDetails(orderId));
			}
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [dispatch, order, orderId, success, status]);

	function successPaymentHandler(paymentResult) {
		console.log(paymentResult);
		dispatch(payOrder(orderId, paymentResult));
	}

	function deliverHandler() {
		dispatch(deliverOrder(order));
	}

	function reOrderHandler() {
		dispatch(addOrderToBasket(order.orderItems));
	}

	return !order ? (
		<Loader />
	) : alert ? (
		<Message variant='danger'>
			{error} <CloseButton onClick={dismissHandler} aria-label='Hide' />
		</Message>
	) : order.isDeleted ? (
		<Message variant='danger'>
			{order.message}.{' '}
			<Link to='/basket' onClick={reOrderHandler}>
				Click to Re-order.
			</Link>
		</Message>
	) : (
		<Fragment>
			{!userInfo.isAdmin && (
				<Link to='/profile' className='btn btn-light my-3'>
					Go Back
				</Link>
			)}
			<h2 className='order-screen-title'>Order {order._id}</h2>
			<Row className='justify-content-md-center'>
				<Col lg={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item) => (
										<ListGroup.Item key={item.productId}>
											<Row>
												<Col md={3}>
													<Image src={item.image} alt={item.name} fluid rounded />
												</Col>
												<Col>
													<Link to={`/product/${item.productId}`}>{item.name}</Link>
												</Col>
												<Col md={4}>
													{item.qty} x {formatter.format(item.price)} = {formatter.format(item.qty * item.price)}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Delivery Details</h2>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<strong>Address:</strong>
							</p>
							<p>{order.deliveryAddress.address}</p>
							<p>{order.deliveryAddress.city}</p>
							<p>{order.deliveryAddress.postCode}</p>
							<p>{order.deliveryAddress.country}</p>
							{order.isDelivered ? (
								<Message variant='success'>
									Delivered at <Moment format='h:mm:ss a, MMMM Do YYYY'>{order.deliveredAt}</Moment>
								</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment</h2>
							<p>Payment Method: {order.paymentMethod}</p>
							{order.isPaid ? (
								<Message variant='success'>
									Paid at <Moment format='h:mm:ss a, MMMM Do YYYY'>{order.paidAt}</Moment>
								</Message>
							) : (
								<Message variant='danger'>Not paid</Message>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col lg={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>{formatter.format(order.itemsPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Delivery</Col>
									<Col>{!order.deliveryPrice ? 'Free' : formatter.format(order.deliveryPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Includes tax of</Col>
									<Col>{formatter.format(order.taxPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>{formatter.format(order.totalPrice)}</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{sdkReady ? <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} /> : <Loader />}
								</ListGroup.Item>
							)}
							{userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroup.Item>
									<Button type='button' className='btn btn-block' onClick={deliverHandler}>
										Mark As Delivered
									</Button>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

export default OrderScreen;
