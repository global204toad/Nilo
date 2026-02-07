import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, loading, removeItem, updateItemQuantity, getCartTotal, clear, loadCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    // Ensure productId is a string
    const productIdStr = String(productId);
    const key = `qty-${productIdStr}`;
    setUpdatingItems(prev => new Set(prev).add(key));
    console.log('handleQuantityChange called:', { productId: productIdStr, newQuantity });
    try {
      if (newQuantity < 1) {
        // If quantity would be less than 1, remove the item instead
        console.log('Removing item:', productIdStr);
        await removeItem(productIdStr);
      } else {
        // Update quantity
        console.log('Updating quantity:', { productId: productIdStr, newQuantity });
        await updateItemQuantity(productIdStr, newQuantity);
      }
      // Reload cart to ensure sync
      await loadCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Reload cart to sync with server
      await loadCart();
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    // Ensure productId is a string
    const productIdStr = String(productId);
    const key = `remove-${productIdStr}`;
    setUpdatingItems(prev => new Set(prev).add(key));
    console.log('handleRemoveItem called:', productIdStr);
    try {
      await removeItem(productIdStr);
      // Reload cart to ensure sync
      await loadCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
      // Reload cart to sync with server
      await loadCart();
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleIncreaseQuantity = async (productId, currentQuantity) => {
    console.log('Increase quantity:', { productId, currentQuantity });
    await handleQuantityChange(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = async (productId, currentQuantity) => {
    console.log('Decrease quantity:', { productId, currentQuantity });
    await handleQuantityChange(productId, currentQuantity - 1);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clear();
        await loadCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
        await loadCart();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16 flex items-center justify-center">
        <div className="text-2xl text-[#2D2D2D]">Loading cart...</div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16 md:pt-24 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-5">
        {/* Page Header */}
        <div className="mb-6 md:mb-12">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-[#2D2D2D] mb-2 md:mb-4 leading-tight">
            Shopping Cart
          </h1>
          <p className="text-sm md:text-lg text-[#6B7E6F] max-w-2xl leading-relaxed">
            Review your items and proceed to checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Your cart is empty</h2>
            <p className="text-[#6B7E6F] mb-6">Start adding products to your cart!</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                const product = item.productId;
                if (!product) return null;

                return (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-[#E8E6E3] to-[#F5F3EF] flex items-center justify-center p-4">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-6xl opacity-30">⌚</div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <Link
                            to={`/products/${product._id}`}
                            className="text-xl font-bold text-[#2D2D2D] hover:text-[#4A5D4F] transition-colors mb-2 block"
                          >
                            {product.name}
                          </Link>
                          {product.type && (
                            <p className="text-xs uppercase tracking-wider text-[#6B7E6F] mb-2">
                              {product.type}
                            </p>
                          )}
                          {product.flavorNotes && (
                            <p className="text-sm text-[#6B7E6F] mb-4">
                              {product.flavorNotes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!updatingItems.has(`qty-${product._id}`)) {
                                  handleDecreaseQuantity(product._id, item.quantity);
                                }
                              }}
                              disabled={updatingItems.has(`qty-${product._id}`)}
                              className="w-10 h-10 flex items-center justify-center bg-[#E8E6E3] rounded hover:bg-[#4A5D4F] hover:text-white transition-colors font-bold text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                              type="button"
                            >
                              {updatingItems.has(`qty-${product._id}`) ? '...' : '−'}
                            </button>
                            <span className="text-lg font-semibold text-[#2D2D2D] w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!updatingItems.has(`qty-${product._id}`)) {
                                  handleIncreaseQuantity(product._id, item.quantity);
                                }
                              }}
                              disabled={updatingItems.has(`qty-${product._id}`)}
                              className="w-10 h-10 flex items-center justify-center bg-[#E8E6E3] rounded hover:bg-[#4A5D4F] hover:text-white transition-colors font-bold text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                              type="button"
                            >
                              {updatingItems.has(`qty-${product._id}`) ? '...' : '+'}
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#2D2D2D]">
                              {(product.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-[#6B7E6F]">
                              {product.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="p-2 md:p-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!updatingItems.has(`remove-${product._id}`)) {
                              handleRemoveItem(product._id);
                            }
                          }}
                          disabled={updatingItems.has(`remove-${product._id}`)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 text-xl font-bold w-10 h-10 flex items-center justify-center rounded hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove item"
                          aria-label="Remove item from cart"
                          type="button"
                          style={{ minHeight: '44px', minWidth: '44px' }}
                        >
                          {updatingItems.has(`remove-${product._id}`) ? '...' : '✕'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Clear Cart Button */}
              <div className="pt-4">
                <button
                  onClick={handleClearCart}
                  className="text-[#6B7E6F] hover:text-red-500 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm sticky top-20 md:top-24">
                <h2 className="text-lg md:text-2xl font-bold text-[#2D2D2D] mb-4 md:mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#6B7E6F]">
                    <span>Subtotal</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7E6F]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-[#E8E6E3] pt-4">
                    <div className="flex justify-between text-xl font-bold text-[#2D2D2D]">
                      <span>Total</span>
                      <span>{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold mb-4 text-sm md:text-base"
                    style={{ minHeight: '44px' }}
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>

                <Link
                  to="/products"
                  className="block text-center text-[#4A5D4F] hover:text-[#2D2D2D] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

