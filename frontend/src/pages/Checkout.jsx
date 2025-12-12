import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, getCartTotal, userId } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Shipping Information Form State
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Egypt', // Fixed to Egypt
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  // Form Validation
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    // Redirect if cart is empty
    if (!cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);

  const validateShippingInfo = () => {
    const newErrors = {};
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shippingInfo.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingInfoChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateShippingInfo()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/cart');
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const order = await createOrder(userId, {
        shippingInfo,
        paymentMethod,
      });
      setOrderData(order);
      setOrderComplete(true);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert(`Failed to place order: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16 flex items-center justify-center">
        <div className="text-2xl text-[#2D2D2D]">Loading...</div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return null; // Will redirect
  }

  const cartItems = cart.items || [];
  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Step 3: Order Complete
  if (orderComplete && orderData) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-12 text-center shadow-sm"
          >
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-4xl font-bold text-[#2D2D2D] mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-[#6B7E6F] mb-6">
              Thank you for your order. We've sent a confirmation email to <strong>{shippingInfo.email}</strong>
            </p>
            <div className="bg-[#F5F3EF] rounded-lg p-6 mb-8">
              <p className="text-sm text-[#6B7E6F] mb-2">Order Number</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{orderData.orderNumber}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-white text-[#2D2D2D] rounded-lg border-2 border-[#4A5D4F] hover:bg-[#4A5D4F] hover:text-white transition-colors duration-300 font-semibold"
              >
                Go Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16 md:pt-24 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-5">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* Step 1: Shipping */}
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                currentStep >= 1 ? 'bg-[#2D2D2D] text-white' : 'bg-[#E8E6E3] text-[#6B7E6F]'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className={`ml-2 font-semibold ${currentStep >= 1 ? 'text-[#2D2D2D]' : 'text-[#6B7E6F]'}`}>
                Shipping
              </span>
            </div>
            <div className={`h-1 w-16 md:w-24 ${currentStep >= 2 ? 'bg-[#2D2D2D]' : 'bg-[#E8E6E3]'}`}></div>
            
            {/* Step 2: Payment */}
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                currentStep >= 2 ? 'bg-[#2D2D2D] text-white' : 'bg-[#E8E6E3] text-[#6B7E6F]'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className={`ml-2 font-semibold ${currentStep >= 2 ? 'text-[#2D2D2D]' : 'text-[#6B7E6F]'}`}>
                Payment
              </span>
            </div>
            <div className={`h-1 w-16 md:w-24 ${currentStep >= 3 ? 'bg-[#2D2D2D]' : 'bg-[#E8E6E3]'}`}></div>
            
            {/* Step 3: Complete */}
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                currentStep >= 3 ? 'bg-[#2D2D2D] text-white' : 'bg-[#E8E6E3] text-[#6B7E6F]'
              }`}>
                3
              </div>
              <span className={`ml-2 font-semibold ${currentStep >= 3 ? 'text-[#2D2D2D]' : 'text-[#6B7E6F]'}`}>
                Complete
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg p-4 md:p-8 shadow-sm"
                >
                  <h2 className="text-xl md:text-3xl font-bold text-[#2D2D2D] mb-4 md:mb-6 leading-tight">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleShippingInfoChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] ${
                          errors.firstName ? 'border-red-500' : 'border-[#E8E6E3]'
                        }`}
                        placeholder="First Name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleShippingInfoChange('lastName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] ${
                          errors.lastName ? 'border-red-500' : 'border-[#E8E6E3]'
                        }`}
                        placeholder="Last Name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingInfoChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] ${
                          errors.email ? 'border-red-500' : 'border-[#E8E6E3]'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] ${
                          errors.phone ? 'border-red-500' : 'border-[#E8E6E3]'
                        }`}
                        placeholder="Phone Number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] ${
                          errors.address ? 'border-red-500' : 'border-[#E8E6E3]'
                        }`}
                        placeholder="Street Address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] bg-white ${
                          errors.city ? 'border-red-500' : 'border-[#E8E6E3]'
                        }`}
                      >
                        <option value="">Select a city</option>
                        <option value="Cairo">Cairo</option>
                        <option value="Alexandria">Alexandria</option>
                        <option value="Giza">Giza</option>
                        <option value="Shubra El Kheima">Shubra El Kheima</option>
                        <option value="Port Said">Port Said</option>
                        <option value="Suez">Suez</option>
                        <option value="Luxor">Luxor</option>
                        <option value="Aswan">Aswan</option>
                        <option value="Asyut">Asyut</option>
                        <option value="Ismailia">Ismailia</option>
                        <option value="Faiyum">Faiyum</option>
                        <option value="Zagazig">Zagazig</option>
                        <option value="Damietta">Damietta</option>
                        <option value="Mansoura">Mansoura</option>
                        <option value="Tanta">Tanta</option>
                        <option value="Minya">Minya</option>
                        <option value="Beni Suef">Beni Suef</option>
                        <option value="Qena">Qena</option>
                        <option value="Sohag">Sohag</option>
                        <option value="Hurghada">Hurghada</option>
                        <option value="Sharm El Sheikh">Sharm El Sheikh</option>
                        <option value="Damanhur">Damanhur</option>
                        <option value="Kafr El Sheikh">Kafr El Sheikh</option>
                        <option value="Arish">Arish</option>
                        <option value="Mallawi">Mallawi</option>
                        <option value="Bilbais">Bilbais</option>
                        <option value="Marsa Matruh">Marsa Matruh</option>
                        <option value="Idfu">Idfu</option>
                        <option value="Mit Ghamr">Mit Ghamr</option>
                        <option value="Al-Hamidiyya">Al-Hamidiyya</option>
                        <option value="Desouk">Desouk</option>
                        <option value="Qalyub">Qalyub</option>
                        <option value="Abu Kabir">Abu Kabir</option>
                        <option value="Kafr El Dawwar">Kafr El Dawwar</option>
                        <option value="Girga">Girga</option>
                        <option value="Akhmim">Akhmim</option>
                        <option value="Matareya">Matareya</option>
                      </select>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleShippingInfoChange('zipCode', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] ${
                          errors.zipCode ? 'border-red-500' : 'border-[#E8E6E3]'
                        }`}
                        placeholder="ZIP Code"
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value="Egypt"
                        readOnly
                        disabled
                        className="w-full px-4 py-3 border border-[#E8E6E3] rounded-lg bg-[#F5F3EF] text-[#6B7E6F] cursor-not-allowed"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg p-8 shadow-sm"
                >
                  <h2 className="text-3xl font-bold text-[#2D2D2D] mb-6">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-[#4A5D4F] transition-colors ${
                      paymentMethod === 'cash_on_delivery' ? 'border-[#2D2D2D] bg-[#F5F3EF]' : 'border-[#E8E6E3]'
                    }">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">💵</span>
                          <span className="font-bold text-[#2D2D2D]">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-[#6B7E6F]">Pay with cash when your order is delivered</p>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Place Order */}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg p-8 shadow-sm"
                >
                  <h2 className="text-3xl font-bold text-[#2D2D2D] mb-6">Review Your Order</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">Shipping Information</h3>
                    <div className="bg-[#F5F3EF] rounded-lg p-4">
                      <p className="text-[#6B7E6F]"><strong className="text-[#2D2D2D]">Name:</strong> {shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p className="text-[#6B7E6F]"><strong className="text-[#2D2D2D]">Email:</strong> {shippingInfo.email}</p>
                      <p className="text-[#6B7E6F]"><strong className="text-[#2D2D2D]">Phone:</strong> {shippingInfo.phone}</p>
                      <p className="text-[#6B7E6F]"><strong className="text-[#2D2D2D]">Address:</strong> {shippingInfo.address}</p>
                      <p className="text-[#6B7E6F]"><strong className="text-[#2D2D2D]">City:</strong> {shippingInfo.city}, {shippingInfo.zipCode}</p>
                      <p className="text-[#6B7E6F]"><strong className="text-[#2D2D2D]">Country:</strong> {shippingInfo.country}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {cartItems.map((item, index) => {
                        const product = item.productId;
                        if (!product) return null;
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-[#F5F3EF] rounded-lg">
                            <div className="flex items-center gap-4">
                              {product.image && (
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded" loading="lazy" />
                              )}
                              <div>
                                <p className="font-semibold text-[#2D2D2D]">{product.name}</p>
                                <p className="text-sm text-[#6B7E6F]">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-bold text-[#2D2D2D]">{(product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 md:mt-8 gap-2">
              <button
                onClick={handleBack}
                className="px-4 md:px-8 py-3 bg-white text-[#2D2D2D] rounded-lg border-2 border-[#4A5D4F] hover:bg-[#4A5D4F] hover:text-white transition-colors duration-300 font-semibold text-sm md:text-base"
                style={{ minHeight: '44px' }}
              >
                Back
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-4 md:px-8 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold text-sm md:text-base"
                  style={{ minHeight: '44px' }}
                >
                  Continue
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-4 md:px-8 py-3 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#4A5D4F] transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  style={{ minHeight: '44px' }}
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </motion.button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#6B7E6F]">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B7E6F]">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-[#E8E6E3] pt-4">
                  <div className="flex justify-between text-xl font-bold text-[#2D2D2D]">
                    <span>Total</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {currentStep >= 2 && (
                <div className="pt-4 border-t border-[#E8E6E3]">
                  <p className="text-sm text-[#6B7E6F] mb-2">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💵</span>
                    <span className="text-[#2D2D2D] font-semibold capitalize">
                      {paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

