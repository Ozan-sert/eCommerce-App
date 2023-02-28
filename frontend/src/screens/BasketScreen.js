import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, ListGroupItem, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { addToBasket, removeFromBasket } from '../actions/basketActions';

const BasketScreen = ({ history }) => {
	
	const basket = useSelector((state) => state.basket);
	const { basketItems } = basket;
	const user = useSelector((state) => state.user);
	const { userStatus } = user;

	const dispatch = useDispatch();

	
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});

	useEffect(() => {
		if (userStatus === 'logout') {
			history.push('/');
		}
	
	}, [userStatus, history]);

	const items = basketItems.reduce((acc, item) => acc + item.qty, 0);

	function removeFromBasketHandler(id) {
		dispatch(removeFromBasket(id));
	}

	function continueShoppingHandler() {
		history.push('/');
	}

	function checkoutHandler() {
		history.push('/login?redirect=delivery');
	}

	return (
		<Row className='justify-content-md-center'>
			<Col lg={10}>
				<h1>Shopping Cart</h1>
				{basketItems.length === 0 ? (
					<Message>
						Your cart is empty <Link to='/'>Go Back</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
						{basketItems.map((item) => (
							<ListGroupItem key={item.productId}>
								<Row>
									<Col sm={6}>
										<Image src={item.image} alt={item.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link to={`/product/${item.productId}`}>{item.name}</Link>
									</Col>
									<Col md={2}>{formatter.format(item.price)}</Col>
									<Col lg={3}>
										<Form.Control
											className='qty-selector'
											as='select'
											value={item.qty}
											onChange={(e) => dispatch(addToBasket(item.productId, Number(e.target.value)))}
										>
											{[...Array(item.countInStock).keys()].map((key) => (
												<option key={key + 1} value={key + 1}>
													{key + 1}
												</option>
											))}
										</Form.Control>
									</Col>
									<Col lg={3}>
										<Button
											type='button'
											variant='light'
											className='remove-item'
											onClick={() => removeFromBasketHandler(item.productId)}
										>
											<i className='fas fa-trash'></i>
											&nbsp;Remove Item
										</Button>
									</Col>
								</Row>
							</ListGroupItem>
						))}
					</ListGroup>
				)}
			</Col>
			<Col lg={10}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroupItem>
							<h2>
								Subtotal ({items}) {items === 0 || items > 1 ? ' items' : ' item'}
							</h2>
							{formatter.format(basketItems.reduce((acc, item) => acc + item.qty * item.price, 0))}
						</ListGroupItem>
						<ListGroupItem>
							<Button type='button' className='btn-block btn-light' onClick={continueShoppingHandler}>
								Continue Shopping
							</Button>
						</ListGroupItem>
						<ListGroupItem>
							<Button type='button' className='btn-block' disabled={basketItems.length === 0} onClick={checkoutHandler}>
								Proceed to Checkout
							</Button>
						</ListGroupItem>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	);
};

export default BasketScreen;
