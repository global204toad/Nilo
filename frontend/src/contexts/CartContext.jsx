import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from '../services/api';

const CartContext = createContext();

// Get or create a user ID (using sessionStorage)
const getUserId = () => {
  let userId = sessionStorage.getItem('nilo_userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('nilo_userId', userId);
  }
  return userId;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getUserId();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart(userId);
      setCart(cartData);
      setError(null);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError(err.message);
      // Initialize empty cart structure
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      const updatedCart = await addToCart(userId, productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Failed to add item:', err);
      throw err;
    }
  };

  const removeItem = async (productId) => {
    try {
      const updatedCart = await removeFromCart(userId, productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Failed to remove item:', err);
      throw err;
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    try {
      const updatedCart = await updateCartItem(userId, productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Failed to update item:', err);
      throw err;
    }
  };

  const clear = async () => {
    try {
      await clearCart(userId);
      setCart({ items: [] });
    } catch (err) {
      console.error('Failed to clear cart:', err);
      throw err;
    }
  };

  // Calculate cart totals
  const getCartTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      const product = item.productId;
      if (product && product.price) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addItem,
    removeItem,
    updateItemQuantity,
    clear,
    loadCart,
    getCartTotal,
    getCartItemCount,
    userId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

