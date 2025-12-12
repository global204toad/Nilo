import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Helper function to get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  }
  return cart;
};

// GET user's cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.userId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get cart without population first to work with raw IDs
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
      await cart.save();
    }
    
    // Convert productId to string for comparison
    const productIdStr = String(productId);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => {
      // Handle both populated and non-populated cases
      const itemProductId = item.productId._id ? item.productId._id.toString() : item.productId.toString();
      return itemProductId === productIdStr;
    });
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST remove item from cart
router.post('/:userId/remove', async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Get cart without population first to work with raw IDs
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
      await cart.save();
    }
    
    // Convert productId to string for comparison
    const productIdStr = String(productId);
    cart.items = cart.items.filter(item => {
      // Handle both populated and non-populated cases
      const itemProductId = item.productId._id ? item.productId._id.toString() : item.productId.toString();
      return itemProductId !== productIdStr;
    });
    
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST update item quantity
router.post('/:userId/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    // Get cart without population first to work with raw IDs
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
      await cart.save();
    }
    
    // Convert productId to string for comparison
    const productIdStr = String(productId);
    const itemIndex = cart.items.findIndex(item => {
      // Handle both populated and non-populated cases
      const itemProductId = item.productId._id ? item.productId._id.toString() : item.productId.toString();
      return itemProductId === productIdStr;
    });
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST clear cart
router.post('/:userId/clear', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.userId);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

