import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

interface SpaceIntroProps {
  onComplete?: () => void;
}

// Generate deterministic star positions (seeded by index)
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: ((i * 37 + 13) % 100),  // Deterministic pseudo-random
    top: ((i * 53 + 7) % 100),
    opacity: 0.2 + ((i * 17) % 60) / 100,
    delay: (i % 30) / 10,
  }));
}

const STARS = generateStars(100);

export default function SpaceIntro({ onComplete }: SpaceIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'space' | 'zoom' | 'fade' | 'done'>('space');
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.3);
  const phiRef = useRef(0);

  useEffect(() => {
    // Check if animation has already played this session
    const hasSeenIntro = localStorage.getItem('hasSeenSpaceIntro');

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Skip intro on mobile for performance or if reduced motion preferred
    const isMobile = window.innerWidth < 768;

    // Skip if already seen, reduced motion, or mobile
    if (hasSeenIntro || prefersReducedMotion || isMobile) {
      setPhase('done');
      onComplete?.();
      // Ensure specific events are dispatched even if skipped
      window.dispatchEvent(new CustomEvent('space-intro-complete'));
      return;
    }

    // Mark as seen for this session
    localStorage.setItem('hasSeenSpaceIntro', 'true');

    let globe: ReturnType<typeof createGlobe> | null = null;
    const canvas = canvasRef.current;

    if (!canvas) {
      // Fallback: skip animation if canvas not available
      setPhase('done');
      onComplete?.();
      return;
    }

    // Detect pixel ratio for performance
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const width = canvas.offsetWidth * pixelRatio;
    const height = canvas.offsetHeight * pixelRatio;

    // Fallback for zero dimensions
    if (width === 0 || height === 0) {
      setPhase('done');
      onComplete?.();
      return;
    }

    canvas.width = width;
    canvas.height = height;

    // Start in space (small globe, far away)
    let currentScale = 0.3;
    let targetScale = 0.3;

    // Wrap globe creation in try-catch for WebGL fallback
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: pixelRatio,
        width: width,
        height: height,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.1, 0.1, 0.15],
        markerColor: [0.1, 0.8, 1],
        glowColor: [0.1, 0.5, 0.8],
        markers: [
          // Major cities
          { location: [40.7128, -74.006], size: 0.05 }, // NYC
          { location: [51.5074, -0.1278], size: 0.05 }, // London
          { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
          { location: [41.0082, 28.9784], size: 0.03 }, // Istanbul
          { location: [-23.5505, -46.6333], size: 0.04 }, // Sao Paulo
        ],
        scale: currentScale,
        onRender: (state) => {
          // Auto-rotate
          state.phi = phiRef.current;
          phiRef.current += 0.005;

          // Smooth scale transition
          currentScale += (targetScale - currentScale) * 0.02;
          state.scale = currentScale;
        },
      });

      // Animation timeline
      const timeline = async () => {
        // Phase 1: Space view (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Phase 2: Zoom in
        setPhase('zoom');
        targetScale = 2.5;
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Phase 3: Fade out
        setPhase('fade');
        let fadeOpacity = 1;
        const fadeInterval = setInterval(() => {
          fadeOpacity -= 0.05;
          setOpacity(Math.max(0, fadeOpacity));
          if (fadeOpacity <= 0) {
            clearInterval(fadeInterval);
            setPhase('done');
            window.dispatchEvent(new CustomEvent('space-intro-complete'));
            onComplete?.();
          }
        }, 30);
      };

      timeline();
    } catch (error) {
      // WebGL or COBE not supported - skip animation gracefully
      console.warn('Globe animation failed, skipping intro:', error);
      setPhase('done');
      onComplete?.();
      return;
    }

    return () => {
      if (globe) {
        globe.destroy();
      }
    };
  }, [onComplete]);

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9001] hidden md:flex items-center justify-center bg-dark-950 transition-opacity duration-500"
      style={{ opacity }}
    >
      {/* Stars background - using deterministic positions to prevent hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Globe */}
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[800px] max-h-[800px] transition-transform duration-1000"
        style={{
          transform: `scale(${phase === 'zoom' ? 1.5 : 1})`,
        }}
      />

      {/* Welcome text */}
      <div
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 text-center transition-all duration-700 ${
          phase === 'zoom' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-xl md:text-2xl text-primary-400 font-light tracking-wider">
          Welcome to
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white mt-2">
          Gus Digital Solutions
        </h1>
      </div>

      {/* Skip button */}
      <button
        onClick={() => {
          setPhase('done');
          window.dispatchEvent(new CustomEvent('space-intro-complete'));
          onComplete?.();
        }}
        className="absolute bottom-8 right-8 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-full shadow-lg transition-all text-sm z-50 flex items-center gap-1 group"
      >
        Skip
        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
      </button>
    </div>
  );
}
