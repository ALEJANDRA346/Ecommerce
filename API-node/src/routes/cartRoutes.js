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
  removeProductFromCart,
  clearUserCart,
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
router.delete('/cart/remove-product', authMiddleware, removeProductFromCart); // Eliminar un producto específico del carrito del usuario
router.post('/cart/remove-product', authMiddleware, removeProductFromCart); // Alternativa POST para compatibilidad
router.delete('/cart/clear-cart', authMiddleware, clearUserCart); // Vaciar el carrito completo del usuario
router.post('/cart/clear-cart', authMiddleware, clearUserCart); // Alternativa POST para compatibilidad

export default router;
