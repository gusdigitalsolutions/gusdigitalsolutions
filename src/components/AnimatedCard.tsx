import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedCard({ children, delay = 0, className = '' }: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    // Initial state
    gsap.set(cardRef.current, {
      opacity: 0,
      y: 60,
      rotateX: -10,
    });

    // Scroll-triggered animation
    gsap.to(cardRef.current, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.5,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom-=50px',
        toggleActions: 'play none none none',
      },
    });
  }, [delay]);

  // Hover effects
  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1.03,
      rotateY: 3,
      boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1,
      rotateY: 0,
      boxShadow: 'none',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transform-gpu ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {children}
    </div>
  );
}

// Staggered container for multiple cards
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.03 }: StaggerContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.stagger-item');

    gsap.set(items, {
      opacity: 0,
      y: 50,
      scale: 0.95,
    });

    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: staggerDelay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom-=50px',
        toggleActions: 'play none none none',
      },
    });
  }, [staggerDelay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Individual stagger item
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!itemRef.current) return;
    gsap.to(itemRef.current, {
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!itemRef.current) return;
    gsap.to(itemRef.current, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`stagger-item transform-gpu ${className}`}
    >
      {children}
    </div>
  );
}
