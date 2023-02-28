import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { getUserDetails, logout } from '../actions/userActions';
import BasketItem from './BasketItem';

const Header = () => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.user);
	const { userInfo, userStatus } = user;

	const basket = useSelector((state) => state.basket);
	const { basketItems } = basket;

	useEffect(() => {
		if (userStatus === 'unauthorised') {
			dispatch(logout());
		}
	}, [userStatus, userInfo, dispatch]);

	useEffect(() => {
		if (userStatus === 'loggedIn' && !userInfo._id) {
			dispatch(getUserDetails('profile'));
		}
	}, [userStatus, userInfo, dispatch]);

	function logoutHandler() {
		dispatch(logout());
	}

	return (
		<header>
			<Navbar bg='dark' variant='dark' expand='sm' collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>Online shopping</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<SearchBox />
						<Nav className='ml-auto'>
							{basketItems.length === 0 ? (
								<LinkContainer to='/basket'>
									<Nav.Link>
										<i className='fas fa-shopping-cart'></i> Cart
									</Nav.Link>
								</LinkContainer>
							) : (
								<NavDropdown title='Cart' id='basket'>
									{basketItems.map((item) => (
										<LinkContainer key={item.productId} to={`/product/${item.productId}`}>
											<NavDropdown.Item>
												<BasketItem product={item} />
												<NavDropdown.Divider />
											</NavDropdown.Item>
										</LinkContainer>
									))}
									<LinkContainer to='/basket'>
										<NavDropdown.Item>
											<i className='fas fa-shopping-cart'></i> Go To Cart
										</NavDropdown.Item>
									</LinkContainer>
								</NavDropdown>
							)}
							{!userStatus || userStatus === 'guest' ? (
								<LinkContainer to='/login'>
									<Nav.Link>
										<i className='fas fa-user'></i> Sign In
									</Nav.Link>
								</LinkContainer>
							) : userInfo && userInfo.isAdmin ? (
								<NavDropdown title={userInfo.name} id='username'>
									<LinkContainer to='/admin/userlist'>
										<NavDropdown.Item>Users</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/productlist'>
										<NavDropdown.Item>Products</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/orderlist'>
										<NavDropdown.Item>Orders</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Divider></NavDropdown.Divider>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
								</NavDropdown>
							) : (
								<NavDropdown title={userInfo.name} id='username'>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
