import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // BLUR EFFECT ON SCROLL - Like Flow
  const blurAmount = Math.min((scrollY / 150) * 20, 20);
  const opacity = Math.max(0.2, 1 - scrollY / 400);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
        
        {/* NILO - WITH BLUR ON SCROLL */}
        <h1 
          className="text-8xl sm:text-9xl md:text-[10rem] lg:text-[14rem] font-bold text-white mb-6 leading-none"
          style={{
            filter: `blur(${blurAmount}px)`,
            opacity: opacity,
            transition: 'filter 0.05s linear, opacity 0.05s linear',
            textShadow: '0 0 80px rgba(255, 255, 255, 0.8), 0 0 120px rgba(255, 255, 255, 0.4)',
            letterSpacing: '-0.02em'
          }}
        >
          NILO
        </h1>

        {/* Subtitle */}
        <p 
          className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
          style={{
            opacity: Math.max(0, opacity - 0.1),
            filter: `blur(${blurAmount * 0.6}px)`,
            transition: 'opacity 0.05s linear, filter 0.05s linear'
          }}
        >
          Where next-generation digital shopping begins
        </p>

        {/* Button */}
        <div style={{ opacity: Math.max(0, opacity - 0.2) }}>
          <Link
            to="/products"
            className="inline-block px-8 py-3.5 bg-gray-800/80 text-white text-base font-medium rounded-lg border border-white/20 hover:bg-gray-700/80 transition-all duration-200"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            Shop Now
          </Link>
        </div>

        <p 
          className="text-sm text-white/50 mt-6"
          style={{
            opacity: Math.max(0, opacity - 0.3),
            transition: 'opacity 0.05s linear'
          }}
        >
          Explore our products. See FAQ.
        </p>
      </div>
    </section>
  );
}
