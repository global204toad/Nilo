import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const response = await api.get('/api/products', { params });
    return response.data;
  } catch (error) {
    console.error('Get Products Error:', error);
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

