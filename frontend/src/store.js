import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
	productListReducer,
	productDetailsReducer,
	productDeleteReducer,
	productCreateReducer,
	productUpdateReducer,
	productCreateReviewReducer,
	productTopRatedReducer,
} from './reducers/productReducers';
import { basketReducer } from './reducers/basketReducers';
import { userReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers';
import { orderCreateReducer, orderDetailsReducer, orderUserListReducer, orderListReducer } from './reducers/orderReducers';
import { itemsPerPageReducer } from './reducers/screenReducers';

const reducer = combineReducers({
	productList: productListReducer,
	productDetails: productDetailsReducer,
	productDelete: productDeleteReducer,
	productCreate: productCreateReducer,
	productUpdate: productUpdateReducer,
	productCreateReview: productCreateReviewReducer,
	productTopRated: productTopRatedReducer,
	basket: basketReducer,
	user: userReducer,
	userList: userListReducer,
	userDelete: userDeleteReducer,
	userUpdate: userUpdateReducer,
	orderCreate: orderCreateReducer,
	orderDetails: orderDetailsReducer,
	orderUserList: orderUserListReducer,
	orderList: orderListReducer,
	itemsPerPage: itemsPerPageReducer,
});


const basketItemsFromStorage = localStorage.getItem('basketItems') ? JSON.parse(localStorage.getItem('basketItems')) : [];

const userStatusFromStorage = localStorage.getItem('userStatus') ? localStorage.getItem('userStatus') : 'guest';

const deliveryAddressFromStorage = localStorage.getItem('deliveryAddress')
	? JSON.parse(localStorage.getItem('deliveryAddress'))
	: {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : null;

const initialState = {
	basket: {
		basketItems: basketItemsFromStorage,
		deliveryAddress: deliveryAddressFromStorage,
		paymentMethod: paymentMethodFromStorage,
	},
	user: { userInfo: {}, error: null, loading: false, updated: null, userStatus: userStatusFromStorage },
	
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
