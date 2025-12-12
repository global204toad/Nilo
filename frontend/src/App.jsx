import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import { hello } from './services/api';
import { useEffect } from 'react';

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Test API connection on mount
    hello()
      .then((data) => {
        console.log('API Connection successful:', data);
      })
      .catch((error) => {
        console.warn('API Connection failed (backend may not be running):', error.message);
      });
  }, []);

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
      <div className="min-h-screen bg-[#F5F3EF] overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />
          <Route path="/orders" element={
            <PageTransition>
              <Navbar />
              <MyOrders />
              <Footer />
            </PageTransition>
          } />
          <Route path="/" element={
            <PageTransition>
              <Navbar />
              <Home />
              <Footer />
            </PageTransition>
          } />
          <Route path="/products" element={
            <PageTransition>
              <Navbar />
              <Products />
              <Footer />
            </PageTransition>
          } />
          <Route path="/products/:id" element={
            <PageTransition>
              <Navbar />
              <ProductDetail />
              <Footer />
            </PageTransition>
          } />
          <Route path="/cart" element={
            <PageTransition>
              <Navbar />
              <Cart />
              <Footer />
            </PageTransition>
          } />
          <Route path="/checkout" element={
            <PageTransition>
              <Navbar />
              <Checkout />
              <Footer />
            </PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition>
              <Navbar />
              <About />
              <Footer />
            </PageTransition>
          } />
          <Route path="/contact" element={
            <PageTransition>
        <Navbar />
              <Contact />
              <Footer />
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
