import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { BASKET_RESET } from '../constants/basketConstants';

const PlaceOrderScreen = ({ history }) => {
	const user = useSelector((state) => state.user);
	const { userStatus } = user;

	const orderCreate = useSelector((state) => state.orderCreate);
	const { order, success, error } = orderCreate;

	const basket = useSelector((state) => state.basket);
	const { basketItems, deliveryAddress } = basket;

	const dispatch = useDispatch();

	useEffect(() => {
		if (userStatus === 'logout') {
			history.push('/');
		}
		if (success) {
			history.push(`/orders/${order._id}`);
			dispatch({ type: ORDER_CREATE_RESET });
			dispatch({ type: BASKET_RESET });
		}
	}, [userStatus, history, success, order, dispatch]);

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});
	
	basket.itemsPrice = basketItems.reduce((acc, item) => acc + item.price * item.qty, 0);
	basket.deliveryPrice = basket.itemsPrice > 100 ? 'Free' : formatter.format(10);
	basket.taxPrice = Number((basket.itemsPrice - basket.itemsPrice / 1.2).toFixed(2));
	basket.totalPrice = Number(basket.itemsPrice) > 100 ? Number(basket.itemsPrice) : Number(basket.itemsPrice) + 10;

	function placeOrderHandler() {
		dispatch(
			createOrder({
				orderItems: basketItems,
				deliveryAddress,
				paymentMethod: basket.paymentMethod,
			})
		);
	}

	return (
		<Fragment>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row className='justify-content-md-center'>
				<Col lg={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Delivery</h2>
							<p>
								<strong>Address:</strong>
							</p>
							<p>{deliveryAddress.address}</p>
							<p>{deliveryAddress.city}</p>
							<p>{deliveryAddress.postCode}</p>
							<p>{deliveryAddress.country}</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Items In Basket</h2>
							{basketItems.length === 0 ? (
								<Message>Your basket is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{basketItems.map((item) => (
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
									<Col>{formatter.format(basket.itemsPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Delivery</Col>
									<Col>
										{basket.deliveryPrice}
									</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Includes tax of</Col>
									<Col>{formatter.format(basket.taxPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>{formatter.format(basket.totalPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Payment Method</Col>
									<Col>{basket.paymentMethod}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>{error && <Message variant='danger'>{error}</Message>}</ListGroup.Item>
							<ListGroup.Item>
								<Button type='button' className='btn-block' disabled={basketItems.length === 0} onClick={placeOrderHandler}>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

export default PlaceOrderScreen;
