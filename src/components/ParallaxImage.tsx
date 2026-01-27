import { useRef, useCallback, type MouseEvent } from 'react';
import { motion, useSpring, useScroll, useTransform, type MotionValue } from 'motion/react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  parallaxSpeed?: number;
  tiltOnHover?: boolean;
  zoomOnHover?: boolean;
}

// Spring physics for smooth hover effects
const springConfig = {
  stiffness: 150,
  damping: 20,
  mass: 0.5,
};

export default function ParallaxImage({
  src,
  alt,
  className = '',
  parallaxSpeed = 0.3,
  tiltOnHover = true,
  zoomOnHover = true,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Transform scroll progress to Y movement
  const yParallax = useTransform(scrollYProgress, [0, 1], [100 * parallaxSpeed, -100 * parallaxSpeed]);

  // Spring values for hover tilt effect
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  // Handle mouse movement for tilt effect
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !tiltOnHover) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center (normalized -1 to 1)
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      // Apply tilt (inverted for natural feel)
      rotateY.set(deltaX * 8);
      rotateX.set(-deltaY * 8);
    },
    [rotateX, rotateY, tiltOnHover]
  );

  const handleMouseEnter = useCallback(() => {
    if (zoomOnHover) {
      scale.set(1.05);
    }
  }, [scale, zoomOnHover]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          y: yParallax as MotionValue<number>,
          rotateX: rotateX as MotionValue<number>,
          rotateY: rotateY as MotionValue<number>,
          scale: scale as MotionValue<number>,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/30 to-transparent pointer-events-none" />
    </motion.div>
  );
}

// Parallax background section
interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundSrc: string;
  className?: string;
  overlayOpacity?: number;
  parallaxSpeed?: number;
}

export function ParallaxSection({
  children,
  backgroundSrc,
  className = '',
  overlayOpacity = 0.7,
  parallaxSpeed = 0.5,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${parallaxSpeed * 50}%`]);

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 -top-[20%] -bottom-[20%]"
        style={{ y }}
      >
        <img
          src={backgroundSrc}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-dark-900"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
