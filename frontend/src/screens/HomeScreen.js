import React, { useState, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Form, CloseButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, removeProductErrors } from '../actions/productActions';
import { basketReset } from '../actions/basketActions';
import { orderDetailsReset } from '../actions/orderActions';
import { userLogoutReset } from '../actions/userActions';
import { setItemsPerPage } from '../actions/screenActions';
import { SET_MULTIPLE_PAGES, SET_SINGLE_PAGE } from '../constants/screenConstants';
import Meta from '../components/Meta';
import ProductCarousel from '../components/ProductCarousel';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

const HomeScreen = ({ history, match }) => {
	const keyword = match.params.keyword;

	const pageNumber = match.params.pageNumber || 1;

	const [alert, setAlert] = useState(false);

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, pages, page } = productList;

	const user = useSelector((state) => state.user);
	const { userStatus } = user;

	const { itemsPerPage, singlePage } = useSelector((state) => state.itemsPerPage);

	const dispatch = useDispatch();

	useEffect(() => {
		
		if (userStatus === 'logout') {
			dispatch(userLogoutReset(), basketReset(), orderDetailsReset());
		}
		dispatch(listProducts(keyword, pageNumber, itemsPerPage));
	}, [userStatus, dispatch, keyword, pageNumber, itemsPerPage]);

	useEffect(() => {
		if (pages === 1) {
			dispatch({ type: SET_SINGLE_PAGE });
		} else {
			dispatch({ type: SET_MULTIPLE_PAGES });
		}
		if (singlePage && !keyword) {
			history.push('/');
		}
	}, [dispatch, history, pages, singlePage, keyword]);

	useEffect(() => {
		if (error) {
			setAlert(true);
		}
	}, [error, dispatch]);

	function onChangeHandler(e) {
		dispatch(setItemsPerPage(e.target.value));
	}

	function dismissHandler() {
		setAlert(false);
		dispatch(removeProductErrors());
	}

	return (
		<Fragment>
			<Meta />
			{!keyword ? (
				<Fragment>
					<h1>Latest Products</h1>
					<ProductCarousel />
				</Fragment>
			) : (
				<Link to='/' className='btn btn-light'>
					Go Back
				</Link>
			)}
			<Form.Label className='inline'>Items per page</Form.Label>
			<Form.Control className='items-per-page' as='select' value={itemsPerPage} onChange={onChangeHandler}>
				<option value={10}>10</option>
				<option value={15}>15</option>
				<option value={20}>20</option>
			</Form.Control>
			{products.length === 0 && !loading && <h2>No results found</h2>}
			{alert ? (
				<Message variant='danger'>
					{error} <CloseButton onClick={dismissHandler} aria-label='Hide' />
				</Message>
			) : (
				<Fragment>
					<Row>
						{products.map((product) => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} itemsPerPage={itemsPerPage} />
				</Fragment>
			)}
			{products.length === 0 && <Loader />}
		</Fragment>
	);
};

export default HomeScreen;
