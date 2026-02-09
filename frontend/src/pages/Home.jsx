import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Announcement Bar - Scrolling */}
      <div className="block bg-gradient-to-r from-[#1a2820] via-[#243830] to-[#1a2820] text-white py-2 md:py-3 overflow-hidden relative">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 5s linear infinite' }}>
          <span className="inline-block px-4 md:px-8 text-xs md:text-sm lg:text-base font-medium">
            🎁 Free Shipping Over 2000 | ⭐ New Limited Edition | 💎 Save 20% on Every Product We Have
          </span>
          <span className="inline-block px-4 md:px-8 text-xs md:text-sm lg:text-base font-medium">
            🎁 Free Shipping Over 2000 | ⭐ New Limited Edition | 💎 Save 20% on Every Product We Have
          </span>
          <span className="inline-block px-4 md:px-8 text-xs md:text-sm lg:text-base font-medium">
            🎁 Free Shipping Over 2000 | ⭐ New Limited Edition | 💎 Save 20% on Every Product We Have
          </span>
        </div>
      </div>

      {/* Hero Section with Banner Image */}
      <section className="relative h-[350px] md:h-screen overflow-hidden">
        {/* Dark green background layer (behind image) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#1a2820'
          }}
        ></div>

        {/* Banner image - with dimension/padding for layered look */}
        <div className="absolute inset-0 flex items-center justify-center p-3 md:p-8">
          <img
            src="/images/Red And Pink Retro Sale Site Banner.jpeg"
            alt="NILO Banner"
            className="rounded-lg shadow-2xl w-full h-full object-contain md:object-cover"
            loading="eager"
          />
        </div>
      </section>

      {/* Content Wrapper */}
      <div className="bg-[#F5F3EF]">

        {/* Featured Collection */}
        <section className="relative py-6 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center"
            style={{
              backgroundImage: 'url(/images/imagee.jpg)',
              backgroundAttachment: 'fixed',
              backgroundSize: '50%',
              backgroundRepeat: 'repeat'
            }}
          ></div>

          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Content */}
          <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-5">
            <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-16 text-center drop-shadow-lg leading-tight">
              Featured Watches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {[
                {
                  name: 'Bestwin Octagonal black With Arabic dial',
                  price: 960,
                  desc: 'Swiss Movement • Ceramic • 42mm',
                  image: '/images/Bestwin Octagonal black With Arabic dial.png',
                  id: 'bestwin-octagonal'
                },
                {
                  name: 'Silver Rolex with Arabic Dial',
                  price: 950,
                  desc: 'Automatic • Arabic Dial • 40mm',
                  image: '/images/Silver Rolex with Arabic Dial.png',
                  id: 'silver-rolex-arabic'
                },
                {
                  name: 'Patek Philippe Blue Dial',
                  price: 800,
                  desc: 'Chronograph • Steel • 44mm',
                  image: '/images/Patek Philippe Blue Dial.png',
                  id: 'patek-philippe-blue'
                }
              ].map((watch, index) => (
                <Link
                  key={index}
                  to={`/products?search=${encodeURIComponent(watch.name)}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg mb-4 overflow-hidden relative border border-white/20 hover:border-white/40 transition-all duration-300">
                    {watch.image ? (
                      <img
                        src={watch.image}
                        alt={watch.name}
                        className="w-full h-full object-contain p-4"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-light" style={{ display: watch.image ? 'none' : 'flex' }}>
                      ⌚
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">{watch.name}</h3>
                  <p className="text-sm text-gray-200 mb-2 drop-shadow-md">{watch.desc}</p>
                  <p className="text-lg font-bold text-white drop-shadow-md">{watch.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6 md:mt-16">
              <Link
                to="/products"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block px-6 md:px-10 py-3 md:py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-sm md:text-base"
                style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
              >
                View All Watches
              </Link>
            </div>
          </div>
        </section>

        {/* Split Section - Holiday/Featured */}
        <section className="py-6 md:py-16 bg-[#faedcd]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="w-full h-[400px] md:h-[700px] overflow-hidden cursor-pointer group relative rounded-lg bg-[#E8E6E3]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  preload="auto"
                >
                  <source src="/images/Brown Retro Classy Watch.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-4 md:p-8">
                <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-[#2D2D2D] mb-4 md:mb-6 leading-tight">
                  Limited Edition Collection
                </h2>
                <p className="text-sm md:text-lg text-[#2D2D2D] mb-4 md:mb-8 font-normal leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                  Discover our exclusive timepieces crafted for those who appreciate precision and artistry. Each watch tells a unique story.
                </p>
                <Link
                  to="/products"
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-block px-6 md:px-8 py-3 bg-[#C84B31] text-white font-semibold rounded hover:bg-[#A63825] transition-all duration-300 text-sm md:text-base"
                  style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}
                >
                  Explore Collection →
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
