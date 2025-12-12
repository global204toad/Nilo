export default function About() {
  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16 md:pt-24 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-5">
        
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-[#2D2D2D] mb-4 md:mb-6 tracking-wide leading-tight" style={{ fontFamily: '"Cooper Black", "Arial Black", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            Our Story
          </h1>
          <p className="text-sm md:text-xl text-[#2D2D2D] max-w-3xl mx-auto font-normal leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            Style that flows from Egypt to everywhere.
          </p>
        </div>

        {/* Image + Text Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mb-8 md:mb-16">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[#4A5D4F] to-[#6B7E6F] shadow-lg">
            {/* Image Layer */}
            <img
              src="/images/pyramids.png"
              alt="Pyramids"
              className="absolute inset-0 w-full h-full object-cover scale-110"
              loading="lazy"
            />
            {/* Optional Dark Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-[#2D2D2D] mb-4 md:mb-6 tracking-wide leading-tight" style={{ fontFamily: '"Cooper Black", "Arial Black", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
              Founded on Passion
            </h2>
            <p className="text-sm md:text-lg text-[#2D2D2D] mb-3 md:mb-4 font-normal leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              Nilo was founded by two Egyptian men who wanted to create a brand inspired by the spirit of the Nile. We are a 100% Egyptian brand, born and built in Egypt.
            </p>
            <p className="text-sm md:text-lg text-[#2D2D2D] font-normal leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              We sell modern accessories with a special focus on watches, combining style, quality, and everyday elegance. Our vision is to grow from an Egyptian startup into a global brand, bringing our identity and creativity to the world.
            </p>
          </div>
        </div>

        {/* Reverse Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mb-8 md:mb-16">
          <div className="md:order-2">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              {/* Video Background */}
              <video
                src="/images/nile.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="md:order-1">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-[#2D2D2D] mb-4 md:mb-6 tracking-wide leading-tight" style={{ fontFamily: '"Cooper Black", "Arial Black", sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
              Egyptian Spirit, Global Vision
            </h2>
            <p className="text-sm md:text-lg text-[#2D2D2D] mb-3 md:mb-4 font-normal leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              Welcome to Nilo — where style flows from Egypt to everywhere. Our brand carries the essence of the Nile, symbolizing continuity, life, and timeless elegance.
            </p>
            <p className="text-sm md:text-lg text-[#2D2D2D] font-normal leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              Every piece we create reflects our commitment to modern design and quality craftsmanship, bringing Egyptian creativity to the world stage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
