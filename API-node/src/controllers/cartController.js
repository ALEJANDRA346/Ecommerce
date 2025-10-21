import Cart from '../models/cart.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';
const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

async function getCarts(req, res, next) {
  try {
    const carts = await Cart.find().populate('user', '-hashPassword').populate('products.product');
    res.json(carts);
  } catch (error) { next(error); }
}

async function getCartById(req, res, next) {
  try {
    const id = req.params.id;
    const cart = await Cart.findById(id).populate('user', '-hashPassword').populate('products.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) { next(error); }
}

async function getCartByUser(req, res, next) {
  const userId = req.params.id;
  if (!isObjectId(userId)) {
  return res.status(400).json({ error: 'Invalid userId' });
}
  try {
    const userId = req.params.id;
    const cart = await Cart.findOne({ user: userId }).populate('user', '-hashPassword').populate('products.product');
    if (!cart) return res.status(404).json({ message: 'No cart found for this user' });
    res.json(cart);
  } catch (error) { next(error); }
}

// Invitado: leer por anonymousId
async function getCartByAnonymousId(req, res, next) {
  try {
    const { anonymousId } = req.params;
    const cart = await Cart.findOne({ anonymousId }).populate('products.product');
    if (!cart) return res.status(404).json({ message: 'No cart found for this guest' });
    res.json(cart);
  } catch (error) { next(error); }
}

// Helper: si algún día agregas maxPerOrder al producto
function clampByMaxPerOrder(desiredQty, maxPerOrder) {
  if (typeof maxPerOrder === 'number' && maxPerOrder > 0) {
    return Math.min(desiredQty, maxPerOrder);
  }
  return desiredQty;
}

async function createCart(req, res, next) {
  try {
    const { user, products, anonymousId } = req.body;
    if (!user && !anonymousId) return res.status(400).json({ error: 'Provide user or anonymousId' });
    if (!products || !Array.isArray(products)) return res.status(400).json({ error: 'products array is required' });
    for (const item of products) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Each product must have product ID and quantity >= 1' });
      }
    }
    const newCart = await Cart.create({ user: user || undefined, anonymousId: anonymousId || undefined, products });
    await newCart.populate('user', '-hashPassword');
    await newCart.populate('products.product');
    res.status(201).json(newCart);
  } catch (error) { next(error); }
}

async function updateCart(req, res, next) {
  try {
    const { id } = req.params;
    const { user, products, anonymousId } = req.body;
    if (!user && !anonymousId) return res.status(400).json({ error: 'Provide user or anonymousId' });
    if (!products || !Array.isArray(products)) return res.status(400).json({ error: 'products array are required' });
    for (const item of products) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Each product must have product ID and quantity >= 1' });
      }
    }
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { user: user || undefined, anonymousId: anonymousId || undefined, products },
      { new: true }
    ).populate('user', '-hashPassword').populate('products.product');
    if (updatedCart) return res.status(200).json(updatedCart);
    return res.status(404).json({ message: 'Cart not found' });
  } catch (error) { next(error); }
}

async function deleteCart(req, res, next) {
  try {
    const { id } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(id);
    if (deletedCart) return res.status(204).send();
    return res.status(404).json({ message: 'Cart not found' });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// Agregar producto — soporta usuario (token) o invitado (anonymousId)
async function addProductToCart(req, res, next) {
  try {
    const authUserId = req.user?.userId; // del token si viene
    const userId = req.body.userId || authUserId || undefined;
    const { anonymousId, productId } = req.body;
    const quantity = parseInt(req.body.quantity ?? 1, 10);

    if ((!userId && !anonymousId) || !productId || quantity < 1) {
      return res.status(400).json({ error: 'Provide userId or anonymousId, productId and quantity >= 1' });
    }

    if (userId && !isObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    if (!isObjectId(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    console.log('addProductToCart', { userId, anonymousId, productId, quantity });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne(userId ? { user: userId } : { anonymousId });
    if (!cart) {
      cart = new Cart({ user: userId || undefined, anonymousId: anonymousId || undefined, products: [] });
    }

    const idx = cart.products.findIndex(it => it.product.toString() === productId);
    if (idx >= 0) {
      const desired = cart.products[idx].quantity + quantity;
      cart.products[idx].quantity = clampByMaxPerOrder(desired, product.maxPerOrder);
    } else {
      cart.products.push({ product: productId, quantity: clampByMaxPerOrder(quantity, product.maxPerOrder) });
    }

    await cart.save();
    await cart.populate('user', '-hashPassword');
    await cart.populate('products.product');
    res.status(200).json(cart);
  } catch (error) { next(error); }
}

// Merge invitado → usuario (preferir cantidades del usuario)
async function mergeCarts(req, res, next) {
  try {
    const userId = req.user?.userId;
    const { anonymousId } = req.body;
    if (!userId || !anonymousId) return res.status(400).json({ error: 'user (from token) and anonymousId are required' });

    const guestCart = await Cart.findOne({ anonymousId }).populate('products.product');
    if (!guestCart) return res.status(404).json({ message: 'Guest cart not found' });

    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      guestCart.user = userId;
      guestCart.anonymousId = undefined;
      await guestCart.save();
      await guestCart.populate('user', '-hashPassword');
      return res.status(200).json(guestCart);
    }

    const mapUser = new Map(userCart.products.map(p => [p.product.toString(), p]));
    for (const gItem of guestCart.products) {
      const pid = gItem.product.toString();
      if (mapUser.has(pid)) {
        // Preferir cantidad del usuario → no cambiamos
      } else {
        const maxPerOrder = gItem.product?.maxPerOrder;
        const qty = clampByMaxPerOrder(gItem.quantity, maxPerOrder);
        userCart.products.push({ product: gItem.product, quantity: qty });
      }
    }

    await userCart.save();
    await Cart.deleteOne({ _id: guestCart._id });
    await userCart.populate('user', '-hashPassword');
    await userCart.populate('products.product');
    res.status(200).json(userCart);
  } catch (error) { next(error); }
}

export {
  getCarts,
  getCartById,
  getCartByUser,
  getCartByAnonymousId,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
  mergeCarts,
};
