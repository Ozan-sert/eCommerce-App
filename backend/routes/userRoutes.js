import express from 'express';
const router = express.Router();
import {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
	clearRefreshToken,
} from '../controllers/userController.js';
import { refreshToken, protect, admin } from '../middleware/authMiddleware.js';


router.route('/').post(registerUser).get(refreshToken, protect, admin, getUsers);
router.post('/login', authUser);

router.post('/logout', clearRefreshToken);

router.route('/profile').get(refreshToken, protect, getUserProfile).put(refreshToken, protect, updateUserProfile);
router
	.route('/:id')
	.delete(refreshToken, protect, admin, deleteUser)
	.get(refreshToken, protect, admin, getUserById)
	.put(refreshToken, protect, admin, updateUser);

export default router;
