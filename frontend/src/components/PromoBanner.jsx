import { useState, useEffect } from 'react';

export default function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const promos = [
    "🎁 Free shipping on all orders over $500",
    "⭐ Limited Edition: New Collection Available Now",
    "💎 Join our VIP Club and get 20% off your first purchase",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#2D2D2D] text-white py-2 px-4 text-center text-sm overflow-hidden">
      <div
        className="transition-all duration-500 ease-in-out"
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
        }}
      >
        {promos.map((promo, index) => (
          <div
            key={index}
            className="h-8 flex items-center justify-center"
          >
            {promo}
          </div>
        ))}
      </div>
    </div>
  );
}

