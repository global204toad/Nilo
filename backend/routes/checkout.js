import express from 'express';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

const router = express.Router();

// Helper function to get cart
const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }
  return cart;
};

// GET user orders
router.get('/:userId/orders', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 }); // Most recent first
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST create order
router.post('/:userId/create', async (req, res) => {
  try {
    const { shippingInfo, paymentMethod } = req.body;
    const userId = req.params.userId;

    // Validate required fields
    if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.lastName || 
        !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.zipCode || !shippingInfo.country) {
      return res.status(400).json({ message: 'All shipping information fields are required' });
    }

    // Get cart
    const cart = await getCart(userId);

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => {
      const product = item.productId;
      if (product && product.price) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);

    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    // Create order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id || item.productId,
      quantity: item.quantity,
      price: item.productId.price || 0,
    }));

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `NILO-${Date.now()}-${String(orderCount + 1).padStart(4, '0')}`;

    // Create order
    const order = new Order({
      orderNumber,
      userId,
      items: orderItems,
      shippingInfo,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      subtotal,
      shipping,
      total,
      status: 'pending',
    });

    await order.save();

    // Populate order items for email
    const populatedOrder = await Order.findById(order._id).populate('items.productId');

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(populatedOrder, shippingInfo.email);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    // Clear cart after order is created
    cart.items = [];
    await cart.save();

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;

