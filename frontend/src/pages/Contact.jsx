import { useState } from 'react';
import { submitContactForm } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await submitContactForm(formData);
      if (response.success) {
        setSuccess(response.message || 'Your message was sent successfully. Thank you!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16 md:pt-24 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-5">
        
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-[#2D2D2D] mb-2 md:mb-4 leading-tight">
            Get in Touch
          </h1>
          <p className="text-sm md:text-lg text-[#6B7E6F] leading-relaxed">
            We're here to help with any questions about our timepieces
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 lg:p-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-[#E8E6E3] focus:outline-none focus:border-[#4A5D4F]"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-[#E8E6E3] focus:outline-none focus:border-[#4A5D4F]"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-[#E8E6E3] focus:outline-none focus:border-[#4A5D4F]"
                placeholder="How can we help?"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-[#E8E6E3] focus:outline-none focus:border-[#4A5D4F] resize-none"
                placeholder="Tell us more..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-[#4A5D4F] text-white font-semibold rounded hover:bg-[#6B7E6F] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '44px' }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-6 md:mt-12 pt-6 md:pt-12 border-t border-[#E8E6E3] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-center">
            <div>
              <h3 className="font-semibold text-[#2D2D2D] mb-2">Email</h3>
              <a href="mailto:customerservice.nilo@gmail.com" className="text-[#6B7E6F] hover:text-[#4A5D4F] transition-colors">
                customerservice.nilo@gmail.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-[#2D2D2D] mb-2">Phone</h3>
              <a href="tel:+201096393822" className="text-[#6B7E6F] hover:text-[#4A5D4F] transition-colors">
                +201096393822
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
