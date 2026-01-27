import { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchIntensity?: 'low' | 'medium' | 'high';
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

export default function GlitchText({
  text,
  className = '',
  glitchIntensity = 'medium',
  as: Component = 'span'
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Random glitch intervals
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150 + Math.random() * 100);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const intensityClasses = {
    low: 'glitch-low',
    medium: 'glitch-medium',
    high: 'glitch-high'
  };

  return (
    <Component
      className={`relative inline-block ${className}`}
      data-text={text}
    >
      <span className={`relative z-10 ${isGlitching ? intensityClasses[glitchIntensity] : ''}`}>
        {text}
      </span>
      {/* Glitch layers - only render when glitching */}
      {isGlitching && (
        <>
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full glitch-layer-1"
            style={{ color: '#ff00ff', clipPath: 'inset(0 0 0 0)' }}
          >
            {text}
          </span>
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full glitch-layer-2"
            style={{ color: '#00ffff', clipPath: 'inset(0 0 0 0)' }}
          >
            {text}
          </span>
        </>
      )}
    </Component>
  );
}
