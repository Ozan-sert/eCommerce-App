import axios from 'axios';
import { ORDER_CREATE_RESET, ORDER_USER_LIST_RESET } from '../constants/orderConstants';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import { RESET_ITEMS_PER_PAGE } from '../constants/screenConstants';
import {
	USER_DELETE_FAIL,
	USER_DELETE_REMOVE_ERROR,
	USER_DELETE_REQUEST,
	USER_DELETE_SUCCESS,
	USER_DETAILS_FAIL,
	USER_DETAILS_REMOVE_ERROR,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_LIST_FAIL,
	USER_LIST_REMOVE_ERROR,
	USER_LIST_REQUEST,
	USER_LIST_RESET,
	USER_LIST_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGIN_REMOVE_ERROR,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_LOGOUT_RESET,
	USER_REGISTER_FAIL,
	USER_REGISTER_REMOVE_ERROR,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_UNAUTHORISED,
	USER_UPDATE_FAIL,
	USER_UPDATE_PROFILE_FAIL,
	USER_UPDATE_PROFILE_REMOVE_ERROR,
	USER_UPDATE_PROFILE_REQUEST,
	USER_UPDATE_PROFILE_SUCCESS,
	USER_UPDATE_REMOVE_ERROR,
	USER_UPDATE_REQUEST,
	USER_UPDATE_SUCCESS,
} from '../constants/userConstants';

export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post('https://ecommerce-app-sljq.onrender.com/api/users/login', { email, password }, config);

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		// localStorage.setItem('userInfo', JSON.stringify(data));
		localStorage.setItem('userStatus', 'loggedIn');
	} catch (err) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message,
		});
	}
};

export const logout = () => async (dispatch) => {
	// Clears session cookie
	await axios.post('https://ecommerce-app-sljq.onrender.com/api/users/logout');
	localStorage.clear();
	dispatch({ type: USER_LOGOUT });
	dispatch({ type: USER_LIST_RESET });
	dispatch({ type: ORDER_USER_LIST_RESET });
	dispatch({ type: ORDER_CREATE_RESET });
	dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
	dispatch({ type: RESET_ITEMS_PER_PAGE });
};

export const userLogoutReset = () => (dispatch) => {
	dispatch({ type: USER_LOGOUT_RESET });
};

export const register = (name, email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_REGISTER_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post('https://ecommerce-app-sljq.onrender.com/api/users', { name, email, password }, config);

		dispatch({
			type: USER_REGISTER_SUCCESS,
			payload: data,
		});

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.setItem('userStatus', 'loggedIn');
		// localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (err) {
		dispatch({
			type: USER_REGISTER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message,
		});
	}
};

export const getUserDetails = (idOrProfile) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
		});

		// Get token from state
		const {
			user: { userInfo },
		} = getState();

		// Set token to header
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		// Hits users/id or users/profile endpoints
		const { data } = await axios.get(`https://ecommerce-app-sljq.onrender.com/api/users/${idOrProfile}`, config);

		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (err) {
		if (err.response && err.response.status === 401) {
			dispatch({
				type: USER_UNAUTHORISED,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		} else {
			dispatch({
				type: USER_DETAILS_FAIL,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		}
	}
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
		});

		// Get token from state
		const {
			user: { userInfo },
		} = getState();

		// Set token to header
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put('https://ecommerce-app-sljq.onrender.com/api/users/profile', user, config);
		// Sets success and outputs errors for updateProfile messages
		dispatch({ type: USER_UPDATE_PROFILE_SUCCESS });
		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (err) {
		if (err.response && err.response.status === 401) {
			dispatch({
				type: USER_UNAUTHORISED,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		} else {
			dispatch({
				type: USER_UPDATE_PROFILE_FAIL,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		}
	}
};

export const listUsers = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_LIST_REQUEST,
		});

		// Get token from state
		const {
			user: { userInfo },
		} = getState();

		// Set token to header
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.get('https://ecommerce-app-sljq.onrender.com/api/users', config);

		dispatch({
			type: USER_LIST_SUCCESS,
			payload: data,
		});
	} catch (err) {
		if (err.response && err.response.status === 401) {
			dispatch({
				type: USER_UNAUTHORISED,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		} else {
			dispatch({
				type: USER_LIST_FAIL,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		}
	}
};

export const deleteUser = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DELETE_REQUEST,
		});

		// Get token from state
		const {
			user: { userInfo },
		} = getState();

		// Set token to header
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		await axios.delete(`https://ecommerce-app-sljq.onrender.com/api/users/${id}`, config);

		dispatch({ type: USER_DELETE_SUCCESS });
	} catch (err) {
		if (err.response && err.response.status === 401) {
			dispatch({
				type: USER_UNAUTHORISED,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		} else {
			dispatch({
				type: USER_DELETE_FAIL,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		}
	}
};

export const updateUser = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_REQUEST,
		});

		// Get token from state
		const {
			user: { userInfo },
		} = getState();

		// Set token to header
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.put(`https://ecommerce-app-sljq.onrender.com/api/users/${user._id}`, user, config);

		dispatch({ type: USER_UPDATE_SUCCESS });
		dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
	} catch (err) {
		if (err.response && err.response.status === 401) {
			dispatch({
				type: USER_UNAUTHORISED,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		} else {
			dispatch({
				type: USER_UPDATE_FAIL,
				payload: err.response && err.response.data.message ? err.response.data.message : err.message,
			});
		}
	}
};

export const removeUserErrors = () => (dispatch) => {
	dispatch({ type: USER_LOGIN_REMOVE_ERROR });
	dispatch({ type: USER_REGISTER_REMOVE_ERROR });
	dispatch({ type: USER_DETAILS_REMOVE_ERROR });
	dispatch({ type: USER_UPDATE_PROFILE_REMOVE_ERROR });
	dispatch({ type: USER_LIST_REMOVE_ERROR });
	dispatch({ type: USER_DELETE_REMOVE_ERROR });
	dispatch({ type: USER_UPDATE_REMOVE_ERROR });
};
