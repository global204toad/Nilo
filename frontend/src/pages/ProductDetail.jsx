import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, getCartItemCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await getProduct(id);
      setProduct(productData);
    } catch (err) {
      console.error('Failed to load product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addItem(id, quantity);
      // Show success feedback
      alert(`Added ${quantity} item(s) to cart!`);
      setQuantity(1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16 flex items-center justify-center">
        <div className="text-2xl text-[#2D2D2D]">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-5">
          <div className="bg-white rounded-lg p-12 text-center">
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Product Not Found</h2>
            <p className="text-[#6B7E6F] mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16 md:pt-24 pb-20 md:pb-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-5">
        {/* Breadcrumb */}
        <nav className="mb-4 md:mb-8">
          <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B7E6F]">
            <Link to="/" className="hover:text-[#2D2D2D] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#2D2D2D] transition-colors">Products</Link>
            <span>/</span>
            <span className="text-[#2D2D2D] truncate">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="w-full h-[350px] md:aspect-square bg-[#f5f5f5] md:bg-gradient-to-br md:from-[#E8E6E3] md:to-[#F5F3EF] flex items-center justify-center p-4 md:p-8 rounded-2xl md:rounded-lg">
              {product.image ? (
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              ) : (
                <div className="text-9xl opacity-30">⌚</div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6"
          >
            {product.type && (
              <p className="text-xs uppercase tracking-wider text-[#6B7E6F]">
                {product.type}
              </p>
            )}

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#2D2D2D] leading-tight">
              {product.name}
            </h1>

            {product.flavorNotes && (
              <p className="text-sm md:text-lg text-[#6B7E6F] leading-relaxed">
                {product.flavorNotes}
              </p>
            )}

            <div className="text-2xl md:text-4xl font-bold text-[#2D2D2D]">
              {product.price.toFixed(2)}
            </div>

            {product.specs && (
              <div>
                <h3 className="text-sm font-semibold text-[#2D2D2D] mb-2">Specifications</h3>
                <p className="text-[#6B7E6F]">{product.specs}</p>
              </div>
            )}

            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-[#2D2D2D] mb-2">Description</h3>
                <p className="text-[#6B7E6F] leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-[#2D2D2D]">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-[#E8E6E3] rounded hover:bg-[#4A5D4F] hover:text-white transition-colors"
                >
                  −
                </button>
                <span className="text-lg font-semibold text-[#2D2D2D] w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-[#E8E6E3] rounded hover:bg-[#4A5D4F] hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button - Sticky on Mobile */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="md:static fixed bottom-0 left-0 right-0 w-full px-8 py-4 bg-[#2D2D2D] text-white rounded-t-lg md:rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed z-40 md:z-auto"
              style={{ height: '55px' }}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </motion.button>

            {/* Cart Count Badge */}
            {getCartItemCount() > 0 && (
              <Link
                to="/cart"
                className="block text-center text-[#4A5D4F] hover:text-[#2D2D2D] transition-colors"
              >
                View Cart ({getCartItemCount()} items)
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

