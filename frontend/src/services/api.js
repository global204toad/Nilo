import axios from 'axios';

// Get API URL from environment variable
let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Normalize API URL: remove trailing slash and ensure it doesn't end with /api
// The base URL should NOT include /api since we append /api/products, /api/auth, etc.
API_BASE_URL = API_BASE_URL.trim().replace(/\/+$/, ''); // Remove trailing slashes

// Warn if URL ends with /api (this would cause double /api/api/products)
if (API_BASE_URL.endsWith('/api')) {
  console.warn('⚠️ WARNING: VITE_API_URL ends with /api. This will cause double /api in requests.');
  console.warn('⚠️ Current URL:', API_BASE_URL);
  console.warn('⚠️ Expected format: https://nilo-hxbc.onrender.com (without /api)');
  console.warn('⚠️ The /api prefix is automatically added to all requests.');
  // Auto-fix: remove /api suffix
  API_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
  console.warn('⚠️ Auto-corrected to:', API_BASE_URL);
}

// Log API URL for debugging (always log to help diagnose production issues)
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', import.meta.env.MODE);
console.log('📦 VITE_API_URL set:', !!import.meta.env.VITE_API_URL);
console.log('📦 VITE_API_URL value:', import.meta.env.VITE_API_URL || 'Not set (using localhost fallback)');

// Warn if using localhost in production
if (!import.meta.env.VITE_API_URL && !import.meta.env.DEV) {
  console.error('⚠️ WARNING: VITE_API_URL is not set! Using localhost fallback which will not work in production.');
  console.error('⚠️ Please set VITE_API_URL in Vercel environment variables.');
  console.error('⚠️ Expected value: https://nilo-hxbc.onrender.com');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout for mobile networks
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Always log in production for debugging API issues
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('📤 API Request:', config.method?.toUpperCase(), fullUrl);
    if (config.params && Object.keys(config.params).length > 0) {
      console.log('📋 Request params:', config.params);
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Always log in production for debugging API issues
    const fullUrl = `${response.config.baseURL}${response.config.url}`;
    console.log('📥 API Response:', response.status, fullUrl);
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ API Request Timeout');
      error.message = 'Request timeout. Please check your connection and try again.';
    } else if (!error.response) {
      // Network error (no response from server)
      console.error('🌐 Network Error:', error.message);
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        error.message = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
        error.message = 'No internet connection. Please check your network settings.';
      }
    } else {
      // Server responded with error status
      console.error('❌ API Error Response:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export const hello = async () => {
  try {
    const response = await api.get('/api/hello');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getItems = async () => {
  try {
    const response = await api.get('/api/items');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await api.post('/api/items', itemData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API functions
export const sendOTP = async (email) => {
  try {
    const response = await api.post('/api/auth/send-otp', { email });
    return response.data;
  } catch (error) {
    console.error('Send OTP Error:', error);
    throw error;
  }
};

export const verifyOTP = async (email, otp, name) => {
  try {
    const response = await api.post('/api/auth/verify-otp', { email, otp, name });
    return response.data;
  } catch (error) {
    console.error('Verify OTP Error:', error);
    throw error;
  }
};

// Orders API functions
export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/api/checkout/${userId}/orders`);
    return response.data;
  } catch (error) {
    console.error('Get User Orders Error:', error);
    throw error;
  }
};

// Search API functions
export const searchProducts = async (query) => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }
    const response = await api.get(`/api/products/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Search Products Error:', error);
    throw error;
  }
};

// Contact form submission
export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/api/contact/submit', formData);
    return response.data;
  } catch (error) {
    console.error('Contact Form Error:', error);
    throw error;
  }
};

// Product API functions
export const getProducts = async (params = {}) => {
  try {
    // Build full URL for debugging
    const fullUrl = `${API_BASE_URL}/api/products${Object.keys(params).length > 0 ? '?' + new URLSearchParams(params).toString() : ''}`;
    console.log('🔍 Fetching products from:', fullUrl);
    console.log('📋 API Base URL:', API_BASE_URL);
    console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL || 'Not set (using fallback)');
    
    const response = await api.get('/api/products', { params });
    console.log('✅ Products fetched successfully:', response.data?.length || 0, 'products');
    return response.data;
  } catch (error) {
    console.error('❌ Get Products Error:', error);
    console.error('🔍 Failed URL:', `${API_BASE_URL}/api/products`);
    console.error('📋 Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get Product Error:', error);
    throw error;
  }
};

// Cart API functions
export const getCart = async (userId) => {
  try {
    const response = await api.get(`/api/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get Cart Error:', error);
    throw error;
  }
};

export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const response = await api.post(`/api/cart/${userId}/add`, { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Add to Cart Error:', error);
    throw error;
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const response = await api.post(`/api/cart/${userId}/remove`, { productId });
    return response.data;
  } catch (error) {
    console.error('Remove from Cart Error:', error);
    throw error;
  }
};

export const updateCartItem = async (userId, productId, quantity) => {
  try {
    const response = await api.post(`/api/cart/${userId}/update`, { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Update Cart Error:', error);
    throw error;
  }
};

export const clearCart = async (userId) => {
  try {
    const response = await api.post(`/api/cart/${userId}/clear`);
    return response.data;
  } catch (error) {
    console.error('Clear Cart Error:', error);
    throw error;
  }
};

// Checkout API functions
export const createOrder = async (userId, orderData) => {
  try {
    const response = await api.post(`/api/checkout/${userId}/create`, orderData);
    return response.data;
  } catch (error) {
    console.error('Create Order Error:', error);
    throw error;
  }
};

export default api;

