import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: { r: number; g: number; b: number };
  pulseOffset: number;
}

// Vibrant color palette - blue, cyan, purple, pink
const PARTICLE_COLORS = [
  { r: 59, g: 130, b: 246 },   // Blue
  { r: 6, g: 182, b: 212 },    // Cyan
  { r: 139, g: 92, b: 246 },   // Purple
  { r: 236, g: 72, b: 153 },   // Pink
  { r: 34, g: 211, b: 238 },   // Bright Cyan
];

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      // More particles for a richer effect
      const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          // Larger particles (2-5 range instead of 1-3)
          radius: Math.random() * 3 + 2,
          // Higher base alpha for visibility
          alpha: Math.random() * 0.4 + 0.5,
          color,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawParticleWithGlow = (particle: Particle, time: number) => {
      if (!ctx) return;

      const { x, y, radius, color, pulseOffset } = particle;
      const { r, g, b } = color;

      // Pulsing alpha for subtle animation
      const pulseAlpha = particle.alpha * (0.8 + 0.2 * Math.sin(time * 0.002 + pulseOffset));

      // Create radial gradient for glow effect
      const glowRadius = radius * 4;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);

      // Core (brightest)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${pulseAlpha})`);
      // Inner glow
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${pulseAlpha * 0.6})`);
      // Outer glow
      gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${pulseAlpha * 0.2})`);
      // Fade out
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Bright core
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha * 0.8})`;
      ctx.fill();
    };

    const drawConnections = () => {
      if (!ctx) return;
      const particles = particlesRef.current;
      const connectionDistance = 180;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.4;

            // Gradient line between particles
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            const c1 = particles[i].color;
            const c2 = particles[j].color;
            gradient.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${opacity})`);

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connect to mouse with enhanced effect
        const dx = particles[i].x - mouseRef.current.x;
        const dy = particles[i].y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250 && mouseRef.current.x !== 0) {
          const opacity = (1 - distance / 250) * 0.6;
          const c = particles[i].color;

          // Glow effect on mouse connection
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
          ctx.shadowBlur = 10;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges with slight randomization
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -1;
        particle.vx += (Math.random() - 0.5) * 0.1;
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -1;
        particle.vy += (Math.random() - 0.5) * 0.1;
      }

      // Keep in bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));

      // Slight attraction to mouse
      if (mouseRef.current.x !== 0) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300 && distance > 50) {
          particle.vx += (dx / distance) * 0.01;
          particle.vy += (dy / distance) * 0.01;
        }
      }

      // Limit velocity
      const maxVel = 1;
      const vel = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
      if (vel > maxVel) {
        particle.vx = (particle.vx / vel) * maxVel;
        particle.vy = (particle.vy / vel) * maxVel;
      }
    };

    const animate = () => {
      if (!ctx) return;

      timeRef.current += 16; // ~60fps
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

      particlesRef.current.forEach((particle) => {
        updateParticle(particle);
        drawParticleWithGlow(particle, timeRef.current);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    // Initialize
    resizeCanvas();
    animate();

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.95 }}
    />
  );
}
