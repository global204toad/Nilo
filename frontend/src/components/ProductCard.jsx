import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(product.id, 1);
      // Optional: Show a toast notification here
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <Link 
      to={`/products/${product.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 block w-full"
      style={{ minWidth: '0' }}
    >
      {/* Product Image Container with Hover Effects */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#E8E6E3] to-[#F5F3EF]">
        {/* Rounded Image with Hover Animation */}
        <motion.div
           className="absolute inset-4 rounded-[25px] overflow-hidden"
          whileHover={{
            rotate: 6,
            y: -5,
            scale: 1.02,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          style={{
            willChange: 'transform',
          }}
        >
          {/* Glow Effect on Hover */}
          <motion.div
            className="absolute inset-0 rounded-[25px] pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{
              opacity: 1,
              boxShadow: '0 15px 35px rgba(255, 255, 255, 0.4)',
            }}
            transition={{
              duration: 0.3,
            }}
          />
          
          {/* Product Image or Placeholder */}
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', product.image);
                e.target.style.display = 'none';
              }}
            />
          ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5F3EF] to-[#E8E6E3]">
            <div className="text-8xl opacity-30">⌚</div>
          </div>
          )}
        </motion.div>

        {/* Category Badge */}
        {product.badge && (
          <div className="absolute top-6 left-6 z-10">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              product.badge === 'BEST SELLER' 
                ? 'bg-[#FF6B35] text-white' 
                : product.badge === 'USDA ORGANIC'
                ? 'bg-white text-[#2D2D2D] border border-[#2D2D2D]'
                : 'bg-[#2D2D2D] text-white'
            }`}>
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-6">
        {/* Product Type */}
        {product.type && (
          <p className="text-xs uppercase tracking-wider text-[#6B7E6F] mb-1">
            {product.type}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm md:text-xl font-bold text-[#2D2D2D] mb-1 md:mb-2 group-hover:text-[#4A5D4F] transition-colors leading-tight">
          {product.name}
        </h3>

        {/* Flavor Notes / Description */}
        {product.flavorNotes && (
          <p className="text-xs md:text-sm text-[#6B7E6F] mb-2 md:mb-4 leading-relaxed">
            {product.flavorNotes}
          </p>
        )}

        {/* Frequency Selector (for subscription-only products) */}
        {product.subscriptionOnly && product.frequencies && (
          <div className="mb-4">
            <select
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-lg text-sm text-[#2D2D2D] bg-white hover:border-[#4A5D4F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] focus:border-transparent"
            >
              {product.frequencies.map((freq) => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Description (for subscription-only products) */}
        {product.description && (
          <p className="text-sm text-[#6B7E6F] mb-4">
            {product.description}
          </p>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <span className="text-base md:text-2xl font-bold text-[#2D2D2D]">
            {product.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="px-3 md:px-6 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold text-xs md:text-sm whitespace-nowrap"
            style={{ minHeight: '44px' }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </Link>
  );
}

