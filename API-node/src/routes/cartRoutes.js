// cartRoutes.js
import express from 'express';
import {
  getCarts,
  getCartById,
  getCartByUser,
  getCartByAnonymousId,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
  mergeCarts,
} from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdminMiddleware.js';

const router = express.Router();

// Admin
router.get('/cart', authMiddleware, isAdmin, getCarts);
router.get('/cart/:id', authMiddleware, isAdmin, getCartById);

// User
router.get('/cart/user/:id', authMiddleware, getCartByUser);

// Guest
router.get('/cart/guest/:anonymousId', getCartByAnonymousId);
router.post('/cart/guest/add-product', addProductToCart); // ← ESTA RUTA

// Create/merge/update/delete
router.post('/cart', authMiddleware, createCart);
router.post('/cart/add-product', authMiddleware, addProductToCart); // user
router.post('/cart/merge', authMiddleware, mergeCarts);
router.put('/cart/:id', authMiddleware, updateCart);
router.delete('/cart/:id', authMiddleware, deleteCart);

export default router;
