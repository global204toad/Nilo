import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    loadOrders(user.id);
  }, [navigate]);

  const loadOrders = async (userId) => {
    try {
      setLoading(true);
      const ordersData = await getUserOrders(userId);
      setOrders(ordersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-32 pb-16 px-6">
        <div className="max-w-[1280px] mx-auto px-4 md:px-5">
          <div className="text-center">
            <p className="text-[#6B7E6F]">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-32 pb-16 px-6">
        <div className="max-w-[1280px] mx-auto px-4 md:px-5">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-[#2D2D2D] mb-8 tracking-wide" style={{ fontFamily: '"Cooper Black", "Arial Black", sans-serif' }}>
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-[#6B7E6F] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">No orders yet</h2>
            <p className="text-[#6B7E6F] mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-[#2D2D2D] text-white font-semibold rounded-lg hover:bg-[#4A5D4F] transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-[#E8E6E3]">
                  <div>
                    <h3 className="text-lg font-bold text-[#2D2D2D] mb-1">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-[#6B7E6F]">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  {order.items.map((item, index) => {
                    const product = item.productId;
                    return (
                      <div key={index} className="flex items-center gap-4 py-3 border-b border-[#E8E6E3] last:border-0">
                        {product?.image && (
                          <img
                            src={product.image}
                            alt={product.name || 'Product'}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#2D2D2D]">
                            {product?.name || 'Product'}
                          </h4>
                          <p className="text-sm text-[#6B7E6F]">
                            Quantity: {item.quantity} × {item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#2D2D2D]">
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center pt-4 border-t border-[#E8E6E3]">
                  <div>
                    <p className="text-sm text-[#6B7E6F]">
                      Payment: <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#6B7E6F] mb-1">
                      Subtotal: {order.subtotal.toFixed(2)}
                    </p>
                    {order.shipping > 0 && (
                      <p className="text-sm text-[#6B7E6F] mb-1">
                        Shipping: {order.shipping.toFixed(2)}
                      </p>
                    )}
                    <p className="text-lg font-bold text-[#2D2D2D]">
                      Total: {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

