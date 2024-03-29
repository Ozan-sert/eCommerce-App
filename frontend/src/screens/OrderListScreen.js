import React, { useState, Fragment, useEffect } from 'react';
import Moment from 'react-moment';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, CloseButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrders, removeOrderErrors } from '../actions/orderActions';

const OrderListScreen = ({ history }) => {
	const dispatch = useDispatch();

	const [alert, setAlert] = useState(false);

	const user = useSelector((state) => state.user);
	const { userStatus } = user;

	const orderList = useSelector((state) => state.orderList);
	const { error, orders } = orderList;

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});

	useEffect(() => {
		if (userStatus === 'logout') {
			history.push('/');
		} else {
			dispatch(getOrders());
		}
	}, [history, dispatch, userStatus]);

	useEffect(() => {
		if (error) {
			setAlert(true);
		}
	}, [error, dispatch]);

	function dismissHandler() {
		setAlert(false);
		dispatch(removeOrderErrors());
	}

	return (
		<Fragment>
			<h1>Orders</h1>
			{!orders ? (
				<Loader />
			) : alert ? (
				<Message variant='danger'>
					{error} <CloseButton onClick={dismissHandler} aria-label='Hide' />
				</Message>
			) : (
				<Table striped bordered responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>CUSTOMER</th>
							<th>DATE</th>
							<th>ITEMS</th>
							<th>TOTAL</th>
							<th>PAID</th>
							<th>DELIVERED</th>
							<th>DETAILS</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id}>
								<td>...{order._id.substring(18, 24)}</td>
								<td>{order.user && order.user.name}</td>
								<td>
									<Moment format='D/M/YY'>{order.createdAt}</Moment>
								</td>
								<td>{order.orderItems.length}</td>
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
						))}
					</tbody>
				</Table>
			)}
		</Fragment>
	);
};

export default OrderListScreen;
