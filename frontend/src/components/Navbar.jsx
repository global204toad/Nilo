import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { searchProducts } from '../services/api';
import SearchResults from './SearchResults';

export default function Navbar() {
  const { getCartItemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is signed in
    const userData = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (userData && isAuthenticated === 'true') {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // Re-check when route changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    if (showDropdown || showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showSearchResults]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black shadow-md'
            : 'bg-black'
        }`}
        style={{ height: '60px' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-5">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between h-[60px]">
            {/* Mobile: Hamburger Left */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Mobile: Logo Centered */}
            <Link
              to="/"
              className="text-2xl font-black tracking-wide text-white hover:opacity-80 transition-opacity uppercase"
              style={{ 
                fontFamily: '"Cooper Black", "Arial Black", sans-serif',
                fontWeight: '900',
                letterSpacing: '0.1em'
              }}
            >
              NILO
            </Link>

            {/* Mobile: Cart Right */}
            <Link 
              to="/cart" 
              className="text-white hover:text-gray-300 transition-colors relative"
              style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C84B31] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Header - 3 Column Layout */}
          <div className="hidden md:flex items-center justify-between h-[70px] relative">
            {/* Left: Navigation Links */}
            <div className="flex items-center space-x-6 flex-shrink-0">
              <Link
                to="/products"
                onClick={() => window.scrollTo(0, 0)}
                className={`text-base font-black transition-opacity duration-200 tracking-wide uppercase whitespace-nowrap ${
                  location.pathname === '/products'
                    ? 'text-white border-b-2 border-white opacity-100'
                    : 'text-white hover:opacity-80'
                }`}
                style={{ 
                  fontFamily: '"Cooper Black", "Arial Black", sans-serif',
                  fontWeight: '900',
                  letterSpacing: '0.1em'
                }}
              >
                SHOP
              </Link>
              
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-black transition-opacity duration-200 tracking-wide uppercase whitespace-nowrap ${
                    location.pathname === link.path
                      ? 'text-white border-b-2 border-white opacity-100'
                      : 'text-white hover:opacity-80'
                  }`}
                  style={{ 
                    fontFamily: '"Cooper Black", "Arial Black", sans-serif',
                    fontWeight: '900',
                    letterSpacing: '0.1em'
                  }}
                >
                  {link.label.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Center: Logo */}
            <Link
              to="/"
              className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-black tracking-wide text-white hover:opacity-80 transition-opacity uppercase"
              style={{ 
                fontFamily: '"Cooper Black", "Arial Black", sans-serif',
                fontWeight: '900',
                letterSpacing: '0.1em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              NILO
            </Link>

            {/* Right: Search, User, Cart */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Search Input */}
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim().length > 0) {
                        setShowSearchResults(true);
                      }
                    }}
                    onFocus={() => {
                      if (searchResults.length > 0 || searchQuery.trim().length > 0) {
                        setShowSearchResults(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }
                    }}
                    placeholder="Search products..."
                    className="w-[240px] px-4 py-2 pl-10 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-colors text-sm"
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {showSearchResults && (searchQuery.trim().length > 0 || searchResults.length > 0 || searchLoading) && (
                  <SearchResults
                    results={searchResults}
                    loading={searchLoading}
                    onClose={() => {
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                  />
                )}
              </div>
              {/* User Menu */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                    style={{ minHeight: '44px' }}
                  >
                    <span className="text-sm font-medium">Hi, {user.name}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/orders');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#2D2D2D] hover:bg-[#F5F3EF] transition-colors flex items-center space-x-2"
                        style={{ minHeight: '44px' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-[#2D2D2D] hover:bg-[#F5F3EF] transition-colors flex items-center space-x-2"
                        style={{ minHeight: '44px' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-white hover:text-gray-300 transition-colors" style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
              
              {/* Cart */}
              <Link 
                to="/cart" 
                className="text-white hover:text-gray-300 transition-colors relative"
                style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C84B31] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div
          className="absolute left-0 top-0 bottom-0 w-3/4 bg-white shadow-xl overflow-y-auto"
          style={{ maxWidth: '75%' }}
        >
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#2D2D2D] hover:text-[#4A5D4F] transition-colors"
                style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              <Link
                to="/products"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`block px-4 py-4 text-lg font-semibold rounded-lg transition-colors ${
                  location.pathname === '/products'
                    ? 'bg-[#2D2D2D] text-white'
                    : 'text-[#2D2D2D] hover:bg-[#F5F3EF]'
                }`}
                style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}
              >
                Shop
              </Link>
              
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className={`block px-4 py-4 text-lg font-semibold rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#2D2D2D] text-white'
                      : 'text-[#2D2D2D] hover:bg-[#F5F3EF]'
                  }`}
                  style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className="block px-4 py-4 text-lg font-semibold text-[#2D2D2D] hover:bg-[#F5F3EF] rounded-lg transition-colors"
                    style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-4 text-lg font-semibold text-[#2D2D2D] hover:bg-[#F5F3EF] rounded-lg transition-colors"
                    style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className="block px-4 py-4 text-lg font-semibold text-[#2D2D2D] hover:bg-[#F5F3EF] rounded-lg transition-colors"
                  style={{ minHeight: '55px', display: 'flex', alignItems: 'center' }}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
