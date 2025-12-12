import { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create MORE particles for visibility
    const particles = [];
    const particleCount = 5000; // Increased for visibility

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create particles in tornado pattern
    for (let i = 0; i < particleCount; i++) {
      const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.5 + 30;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * canvas.height * 0.8;
      
      particles.push({
        angle: angle,
        distance: distance,
        height: height,
        radius: Math.random() * 4 + 3, // Larger particles
        speed: 0.03 + Math.random() * 0.04, // Faster rotation
        opacity: 0.8 + Math.random() * 0.2, // More opaque
        baseDistance: distance,
      });
    }

    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.015; // Faster animation
      
      // Clear with black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update center if canvas resized
      const currentCenterX = canvas.width / 2;
      const currentCenterY = canvas.height / 2;

      // Draw particles
      particles.forEach((particle) => {
        // Clockwise rotation
        const angle = particle.angle - time * particle.speed;
        
        // Tornado shape - wider at top
        const heightFactor = (particle.height + canvas.height * 0.4) / (canvas.height * 0.8);
        const adjustedDistance = particle.baseDistance * (0.2 + heightFactor * 0.8);
        
        const x = currentCenterX + Math.cos(angle) * adjustedDistance;
        const y = currentCenterY + particle.height + Math.sin(angle) * adjustedDistance * 0.3;

        // Draw bright white particle with glow
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1
        }}
      />
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 100%)',
          zIndex: 0
        }}
      />
    </div>
  );
}
