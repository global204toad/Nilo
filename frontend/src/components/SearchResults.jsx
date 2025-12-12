import { Link } from 'react-router-dom';

export default function SearchResults({ results, loading, onClose }) {
  if (loading) {
    return (
      <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D2D2D] mx-auto"></div>
          <p className="mt-2 text-sm text-[#6B7E6F]">Searching...</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50">
        <div className="p-4 text-center">
          <p className="text-sm text-[#6B7E6F]">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
      <div className="p-2">
        {results.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            onClick={onClose}
            className="flex items-center gap-3 p-3 hover:bg-[#F5F3EF] rounded-lg transition-colors cursor-pointer"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#2D2D2D] text-xs md:text-sm truncate">
                {product.name}
              </h4>
              <p className="text-[#4A5D4F] font-bold text-xs md:text-sm mt-1">
                {product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

