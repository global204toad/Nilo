import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../services/api';

export default function Login() {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/');
    }
  }, [navigate]);

  // Timer countdown
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await sendOTP(email);
      if (response.success) {
        setStep('otp');
        setTimeLeft(response.expiresIn || 600);
        setSuccess('Verification code sent to your email!');
        setIsResendDisabled(true);
        setTimeout(() => setIsResendDisabled(false), 60000); // Disable for 1 minute
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || name.trim().length === 0) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOTP(email, otp, name);
      if (response.success) {
        // Store user data in localStorage to keep them signed in
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isAuthenticated', 'true');
        setSuccess('Account created successfully! You are now signed in.');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
      setOtp(''); // Clear OTP on error
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResendDisabled) return;
    
    setError('');
    setLoading(true);
    setIsResendDisabled(true);

    try {
      const response = await sendOTP(email);
      if (response.success) {
        setTimeLeft(response.expiresIn || 600);
        setSuccess('New verification code sent!');
        setOtp('');
        setTimeout(() => setIsResendDisabled(false), 60000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
      setIsResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-20 md:pt-32 pb-16 px-3 md:px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-[#2D2D2D] mb-2 tracking-wide leading-tight" style={{ fontFamily: '"Cooper Black", "Arial Black", sans-serif' }}>
              NILO
            </h1>
            <p className="text-[#6B7E6F] text-xs md:text-sm leading-relaxed">
              {step === 'email' ? 'Sign in or create an account' : 'Enter your verification code'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#4A5D4F] focus:ring-2 focus:ring-[#4A5D4F]/20"
                  placeholder="your@email.com"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2D2D2D] text-white font-semibold rounded-lg hover:bg-[#4A5D4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: '44px' }}
              >
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#4A5D4F] focus:ring-2 focus:ring-[#4A5D4F]/20 mb-4"
                  placeholder="Enter your full name"
                  required
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full px-4 py-3 border border-[#E8E6E3] rounded-lg focus:outline-none focus:border-[#4A5D4F] focus:ring-2 focus:ring-[#4A5D4F]/20 text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <p className="mt-2 text-sm text-[#6B7E6F] text-center">
                  Code sent to <strong>{email}</strong>
                </p>
                {timeLeft > 0 && (
                  <p className="mt-1 text-xs text-[#6B7E6F] text-center">
                    Expires in: <strong>{formatTime(timeLeft)}</strong>
                  </p>
                )}
                {timeLeft === 0 && (
                  <p className="mt-1 text-xs text-red-600 text-center">
                    Code expired. Please request a new one.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || timeLeft === 0 || otp.length !== 6 || !name.trim()}
                className="w-full py-3 bg-[#2D2D2D] text-white font-semibold rounded-lg hover:bg-[#4A5D4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                style={{ minHeight: '44px' }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResendDisabled || loading}
                  className="text-sm text-[#4A5D4F] hover:text-[#2D2D2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResendDisabled ? 'Resend code in 60s' : 'Resend code'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                    setName('');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-[#6B7E6F] hover:text-[#2D2D2D] transition-colors"
                >
                  ← Change email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

