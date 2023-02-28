import express from 'express';
const router = express.Router();
import {
	getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductReview,
	getTopProducts,
} from '../controllers/productController.js';
import { refreshToken, protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(refreshToken, protect, admin, createProduct);
router.route('/:id/reviews').post(refreshToken, protect, createProductReview);
router.get('/top', getTopProducts);
router
	.route('/:id')
	.get(getProductById)
	.delete(refreshToken, protect, admin, deleteProduct)
	.put(refreshToken, protect, admin, updateProduct);


export default router;
