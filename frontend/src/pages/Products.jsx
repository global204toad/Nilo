import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

export default function Products() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);

      // Log API configuration for debugging
      // SAFE: Guard against undefined env
      const apiUrl = import.meta.env?.VITE_API_URL || 'Not set (using localhost fallback)';
      console.log('🔄 Loading products...');
      console.log('🔗 VITE_API_URL:', apiUrl);
      console.log('🌍 Environment:', import.meta.env?.MODE || 'unknown');

      // Fetch products filtered by men's watches
      const products = await getProducts({ category: 'watch', gender: 'men' });
      console.log('✅ Products loaded successfully:', products?.length || 0, 'products');
      setWatches(products);
    } catch (err) {
      console.error('❌ Failed to load products:', err);

      // Better error messages for different error types
      let errorMessage = 'Failed to load products. Please try again.';

      if (err.message) {
        if (err.message.includes('Network') || err.message.includes('timeout') || err.message.includes('connection') || err.code === 'ERR_NETWORK') {
          errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
          // Check if API URL is configured
          // SAFE: Guard against undefined env
          const apiUrl = import.meta.env?.VITE_API_URL;
          if (!apiUrl || (typeof apiUrl === 'string' && apiUrl.includes('localhost'))) {
            errorMessage += ' (Server configuration issue - please contact support)';
          }
        } else if (err.message.includes('404') || err.response?.status === 404) {
          errorMessage = 'Products endpoint not found. Please contact support if this issue persists.';
        } else if (err.message.includes('500') || err.response?.status === 500) {
          errorMessage = 'Server error. Please try again in a few moments.';
        } else {
          errorMessage = err.message;
        }
      }

      // Always store debug info for display when there's an error
      // SAFE: Guard against undefined values
      const debugData = {
        apiUrl: import.meta.env?.VITE_API_URL || 'Not set (using localhost fallback)',
        errorCode: err?.code,
        errorMessage: err?.message || 'Unknown error',
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        fullUrl: err?.config ? `${err.config.baseURL || ''}${err.config.url || ''}` : 'Unknown'
      };

      setError(errorMessage);
      setDebugInfo(debugData);
      // Fallback to empty array or default products if API fails
      setWatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter: Only show men's watches for now
  // Future: This can be expanded to filter by category (watch, perfume, accessories, etc.)
  const filteredWatches = watches.filter(w => w.gender === 'men' && w.category === 'watch');

  // Split watches into groups
  const firstFour = filteredWatches.slice(0, 4);
  const secondTwo = filteredWatches.slice(4, 6);
  const remaining = filteredWatches.slice(6);
  const lastTwo = remaining.slice(-2);
  const remainingBeforeLast = remaining.slice(0, -2);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16 flex items-center justify-center">
        <div className="text-2xl text-[#2D2D2D]">Loading products...</div>
      </div>
    );
  }

  if (error && filteredWatches.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg p-8 md:p-12 text-center shadow-lg">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-[#6B7E6F]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#2D2D2D] mb-4">
              Failed to Load Products
            </h2>
            <p className="text-sm md:text-base text-[#6B7E6F] mb-6 leading-relaxed">
              {error}
            </p>
            {debugInfo && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 text-left">
                <p className="font-semibold mb-2">Debug Info:</p>
                <div className="space-y-1">
                  <p><strong>API URL:</strong> {debugInfo.apiUrl}</p>
                  {debugInfo.fullUrl && debugInfo.fullUrl !== 'Unknown' && (
                    <p><strong>Full Request URL:</strong> {debugInfo.fullUrl}</p>
                  )}
                  {debugInfo.errorCode && <p><strong>Error Code:</strong> {debugInfo.errorCode}</p>}
                  {debugInfo.status && <p><strong>HTTP Status:</strong> {debugInfo.status} {debugInfo.statusText}</p>}
                  {debugInfo.errorMessage && <p><strong>Error Message:</strong> {debugInfo.errorMessage}</p>}
                </div>
                {(!debugInfo.apiUrl || debugInfo.apiUrl.includes('localhost') || debugInfo.apiUrl === 'Not set (using localhost fallback)') && (
                  <p className="mt-2 text-yellow-700 font-semibold">
                    ⚠️ The API URL is not configured correctly. Please set VITE_API_URL to: https://nilo-production.up.railway.app
                  </p>
                )}
              </div>
            )}
            <button
              onClick={loadProducts}
              className="w-full px-8 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold text-base"
              style={{ minHeight: '44px' }}
            >
              Try Again
            </button>
            <p className="mt-4 text-xs text-gray-400">
              API URL: {import.meta.env?.VITE_API_URL || 'http://localhost:5000 (not configured)'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F5F3EF] pt-24 pb-16"
      style={{
        backgroundImage: 'url(/images/product-bg.jpg.jpg)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2D2D2D] mb-4">
            Men's Watches Collection
          </h1>
          <p className="text-lg text-[#6B7E6F] max-w-2xl">
            Explore our selection of premium men's watches crafted with style and precision.
          </p>
        </div>

        {/* First Four Products - 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
          {firstFour.map((watch) => (
            <ProductCard
              key={watch._id || watch.id}
              product={{
                id: watch._id || watch.id,
                name: watch.name,
                price: watch.price.toFixed(2),
                type: watch.type,
                flavorNotes: watch.flavorNotes,
                image: watch.image
              }}
            />
          ))}
        </div>

        {/* Second Two Products with Promotional Banner - 2 Products + 1 Banner */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
          {/* First Product */}
          {secondTwo[0] && (
            <ProductCard
              product={{
                id: secondTwo[0]._id || secondTwo[0].id,
                name: secondTwo[0].name,
                price: `$${secondTwo[0].price.toFixed(2)}`,
                type: secondTwo[0].type,
                flavorNotes: secondTwo[0].flavorNotes,
                image: secondTwo[0].image
              }}
            />
          )}

          {/* Second Product */}
          {secondTwo[1] && (
            <ProductCard
              product={{
                id: secondTwo[1]._id || secondTwo[1].id,
                name: secondTwo[1].name,
                price: `$${secondTwo[1].price.toFixed(2)}`,
                type: secondTwo[1].type,
                flavorNotes: secondTwo[1].flavorNotes,
                image: secondTwo[1].image
              }}
            />
          )}

          {/* Promotional Banner - Mobile Optimized Collage (9:16 friendly) */}
          <div className="col-span-2 lg:col-span-2">
            <div
              className="relative cursor-pointer group rounded-2xl overflow-hidden mx-auto"
              style={{
                backgroundColor: '#FAF9F7',
                maxWidth: '100%',
                aspectRatio: '1/1',
              }}
            >
              {/* Safe margin container - 10% padding on all sides */}
              <div className="absolute inset-0 flex items-center justify-center p-[8%]">
                {/* Collage container - centered */}
                <div className="relative w-full h-full flex items-center justify-center">

                  {/* Watch 1 - Top Left */}
                  <img
                    src="/images/rolx bg.png"
                    alt="Rolex Watch"
                    className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                    style={{
                      top: '5%',
                      left: '5%',
                      transform: 'rotate(-15deg)',
                      filter: 'contrast(1.1) brightness(1.02)'
                    }}
                  />

                  {/* Watch 2 - Top Right */}
                  <img
                    src="/images/rolx bg.png"
                    alt="Rolex Watch"
                    className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                    style={{
                      top: '5%',
                      right: '5%',
                      transform: 'rotate(15deg)',
                      filter: 'contrast(1.1) brightness(1.02)'
                    }}
                  />

                  {/* Watch 3 - Bottom Left */}
                  <img
                    src="/images/rolx bg.png"
                    alt="Rolex Watch"
                    className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                    style={{
                      bottom: '5%',
                      left: '5%',
                      transform: 'rotate(15deg)',
                      filter: 'contrast(1.1) brightness(1.02)'
                    }}
                  />

                  {/* Watch 4 - Bottom Right */}
                  <img
                    src="/images/rolx bg.png"
                    alt="Rolex Watch"
                    className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                    style={{
                      bottom: '5%',
                      right: '5%',
                      transform: 'rotate(-15deg)',
                      filter: 'contrast(1.1) brightness(1.02)'
                    }}
                  />

                  {/* Main Center Image */}
                  <div className="relative z-10 flex items-center justify-center w-[55%] h-[55%]">
                    <img
                      src="/images/black and white rolx.jpeg"
                      alt="NILO Gift Guide"
                      className="w-full h-full object-contain drop-shadow-xl group-hover:scale-102 transition-all duration-300"
                      style={{
                        filter: 'contrast(1.05) brightness(1.02) saturate(1.1)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining Products Before Last Two - 4 Columns */}
        {remainingBeforeLast.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
            {remainingBeforeLast.map((watch) => (
              <ProductCard
                key={watch._id || watch.id}
                product={{
                  id: watch._id || watch.id,
                  name: watch.name,
                  price: watch.price.toFixed(2),
                  type: watch.type,
                  flavorNotes: watch.flavorNotes,
                  image: watch.image
                }}
              />
            ))}
          </div>
        )}

        {/* Last Two Products with Promotional Banner - 2 Products + 1 Banner */}
        {lastTwo.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
            {/* First Product */}
            {lastTwo[0] && (
              <ProductCard
                product={{
                  id: lastTwo[0]._id || lastTwo[0].id,
                  name: lastTwo[0].name,
                  price: `$${lastTwo[0].price.toFixed(2)}`,
                  type: lastTwo[0].type,
                  flavorNotes: lastTwo[0].flavorNotes,
                  image: lastTwo[0].image
                }}
              />
            )}

            {/* Second Product */}
            {lastTwo[1] && (
              <ProductCard
                product={{
                  id: lastTwo[1]._id || lastTwo[1].id,
                  name: lastTwo[1].name,
                  price: `$${lastTwo[1].price.toFixed(2)}`,
                  type: lastTwo[1].type,
                  flavorNotes: lastTwo[1].flavorNotes,
                  image: lastTwo[1].image
                }}
              />
            )}

            {/* Promotional Banner - Mobile Optimized Collage (9:16 friendly) */}
            <div className="col-span-2 lg:col-span-2">
              <div
                className="relative cursor-pointer group rounded-2xl overflow-hidden mx-auto"
                style={{
                  backgroundColor: '#FAF9F7',
                  maxWidth: '100%',
                  aspectRatio: '1/1',
                }}
              >
                {/* Safe margin container - 10% padding on all sides */}
                <div className="absolute inset-0 flex items-center justify-center p-[8%]">
                  {/* Collage container - centered */}
                  <div className="relative w-full h-full flex items-center justify-center">

                    {/* Watch 1 - Top Left */}
                    <img
                      src="/images/rolx bg.png"
                      alt="Rolex Watch"
                      className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                      style={{
                        top: '5%',
                        left: '5%',
                        transform: 'rotate(-15deg)',
                        filter: 'contrast(1.1) brightness(1.02)'
                      }}
                    />

                    {/* Watch 2 - Top Right */}
                    <img
                      src="/images/rolx bg.png"
                      alt="Rolex Watch"
                      className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                      style={{
                        top: '5%',
                        right: '5%',
                        transform: 'rotate(15deg)',
                        filter: 'contrast(1.1) brightness(1.02)'
                      }}
                    />

                    {/* Watch 3 - Bottom Left */}
                    <img
                      src="/images/rolx bg.png"
                      alt="Rolex Watch"
                      className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                      style={{
                        bottom: '5%',
                        left: '5%',
                        transform: 'rotate(15deg)',
                        filter: 'contrast(1.1) brightness(1.02)'
                      }}
                    />

                    {/* Watch 4 - Bottom Right */}
                    <img
                      src="/images/rolx bg.png"
                      alt="Rolex Watch"
                      className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-all duration-300"
                      style={{
                        bottom: '5%',
                        right: '5%',
                        transform: 'rotate(-15deg)',
                        filter: 'contrast(1.1) brightness(1.02)'
                      }}
                    />

                    {/* Main Center Image */}
                    <div className="relative z-10 flex items-center justify-center w-[55%] h-[55%]">
                      <img
                        src="/images/black and white rolx.jpeg"
                        alt="NILO Gift Guide"
                        className="w-full h-full object-contain drop-shadow-xl group-hover:scale-102 transition-all duration-300"
                        style={{
                          filter: 'contrast(1.05) brightness(1.02) saturate(1.1)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white text-[#2D2D2D] font-semibold rounded border-2 border-[#4A5D4F] hover:bg-[#4A5D4F] hover:text-white transition-all duration-300">
            Load More Watches
          </button>
        </div>
      </div>
    </div>
  );
}
