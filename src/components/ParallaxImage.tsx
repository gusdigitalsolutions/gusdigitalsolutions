import { useRef, useCallback, type MouseEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  parallaxSpeed?: number;
  tiltOnHover?: boolean;
  zoomOnHover?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  className = '',
  parallaxSpeed = 0.3,
  tiltOnHover = true,
  zoomOnHover = true,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax with ScrollTrigger
  useGSAP(() => {
    if (!containerRef.current || !imageWrapperRef.current) return;

    const yDistance = 100 * parallaxSpeed;

    gsap.fromTo(
      imageWrapperRef.current,
      { y: yDistance },
      {
        y: -yDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  }, { scope: containerRef, dependencies: [parallaxSpeed] });

  // Handle mouse movement for tilt effect
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !imageWrapperRef.current || !tiltOnHover) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center (normalized -1 to 1)
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      // Apply tilt with spring-like physics
      gsap.to(imageWrapperRef.current, {
        rotateY: deltaX * 8,
        rotateX: -deltaY * 8,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    [tiltOnHover]
  );

  const handleMouseEnter = useCallback(() => {
    if (!imageWrapperRef.current) return;
    if (zoomOnHover) {
      gsap.to(imageWrapperRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [zoomOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (!imageWrapperRef.current) return;
    gsap.to(imageWrapperRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={imageWrapperRef}
        className="w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/30 to-transparent pointer-events-none" />
    </div>
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
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const distance = parallaxSpeed * 50;

    gsap.fromTo(
      bgRef.current,
      { yPercent: 0 },
      {
        yPercent: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  }, { scope: sectionRef, dependencies: [parallaxSpeed] });

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[20%] -bottom-[20%]"
      >
        <img
          src={backgroundSrc}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

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
