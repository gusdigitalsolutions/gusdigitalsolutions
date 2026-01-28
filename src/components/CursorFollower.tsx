import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useTouchDevice } from '../hooks/useTouchInteraction';

interface CursorFollowerProps {
  className?: string;
}

export default function CursorFollower({ className = '' }: CursorFollowerProps) {
  const isTouchDevice = useTouchDevice();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);

  // Refs for GSAP animation targets
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: -100, y: -100 });

  // GSAP quickTo for smooth cursor following
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const ringQuickX = useRef<gsap.QuickToFunc | null>(null);
  const ringQuickY = useRef<gsap.QuickToFunc | null>(null);

  // Initialize GSAP quickTo functions
  useEffect(() => {
    if (isTouchDevice || !dotRef.current || !ringRef.current) return;

    quickX.current = gsap.quickTo(dotRef.current, 'x', { duration: 0.3, ease: 'power3.out' });
    quickY.current = gsap.quickTo(dotRef.current, 'y', { duration: 0.3, ease: 'power3.out' });
    ringQuickX.current = gsap.quickTo(ringRef.current, 'x', { duration: 0.5, ease: 'power3.out' });
    ringQuickY.current = gsap.quickTo(ringRef.current, 'y', { duration: 0.5, ease: 'power3.out' });
  }, [isTouchDevice]);

  // Track mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    positionRef.current = { x: e.clientX, y: e.clientY };

    if (quickX.current && quickY.current) {
      quickX.current(e.clientX);
      quickY.current(e.clientY);
    }
    if (ringQuickX.current && ringQuickY.current) {
      ringQuickX.current(e.clientX);
      ringQuickY.current(e.clientY);
    }
    if (labelRef.current) {
      gsap.to(labelRef.current, { x: e.clientX, y: e.clientY, duration: 0.3, ease: 'power3.out' });
    }
    setIsVisible(true);
  }, []);

  // Track mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Track click state
  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  // Animate scale and opacity based on state
  useEffect(() => {
    if (!dotRef.current || !ringRef.current) return;

    const dotScale = isClicking ? 0.8 : isHovering ? 1.5 : 1;
    const ringScale = isClicking ? 0.9 : isHovering ? 1.2 : 1;
    const opacity = isVisible ? 1 : 0;
    const ringOpacity = isVisible ? 0.5 : 0;

    gsap.to(dotRef.current, { scale: dotScale, opacity, duration: 0.15, ease: 'power2.out' });
    gsap.to(ringRef.current, { scale: ringScale, opacity: ringOpacity, duration: 0.2, ease: 'power2.out' });
  }, [isClicking, isHovering, isVisible]);

  // Detect hoverable elements
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverableSelectors = [
        'a',
        'button',
        '[role="button"]',
        '.btn',
        '.card',
        '.flip-card-container',
        '.social-icon',
        '[data-cursor]',
      ];

      const isHoverable = hoverableSelectors.some((selector) =>
        target.closest(selector)
      );

      setIsHovering(isHoverable);

      // Check for custom cursor text
      const cursorTextEl = target.closest('[data-cursor-text]') as HTMLElement;
      if (cursorTextEl) {
        setHoverText(cursorTextEl.dataset.cursorText || null);
      } else {
        setHoverText(null);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [isTouchDevice]);

  // Main event listeners
  useEffect(() => {
    if (isTouchDevice) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isTouchDevice, handleMouseMove, handleMouseLeave, handleMouseDown, handleMouseUp]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference ${className}`}
        style={{ transform: 'translate(-50%, -50%)', opacity: 0 }}
      >
        <div
          className={`rounded-full bg-white transition-all duration-150 ${
            isHovering ? 'w-12 h-12' : 'w-4 h-4'
          }`}
        />
      </div>

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ transform: 'translate(-50%, -50%)', opacity: 0 }}
      >
        <div
          className={`rounded-full border-2 border-white/50 transition-all duration-200 ${
            isHovering ? 'w-16 h-16' : 'w-8 h-8'
          }`}
        />
      </div>

      {/* Hover text label */}
      {hoverText && (
        <div
          ref={labelRef}
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{ opacity: 1 }}
        >
          <div className="ml-8 mt-2 px-3 py-1 bg-dark-800 text-dark-100 text-sm rounded-full whitespace-nowrap">
            {hoverText}
          </div>
        </div>
      )}

      {/* Hide default cursor only when custom cursor is visible */}
      {isVisible && (
        <style>{`
          * {
            cursor: none !important;
          }
        `}</style>
      )}
    </>
  );
}

// Lightweight version that just adds glow effect around cursor
export function CursorGlow() {
  const isTouchDevice = useTouchDevice();
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty('--cursor-x', `${e.clientX}px`);
        glowRef.current.style.setProperty('--cursor-y', `${e.clientY}px`);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={glowRef}
      className="fixed inset-0 pointer-events-none z-[9990]"
      style={{
        background: `radial-gradient(
          600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
          rgba(59, 130, 246, 0.06),
          transparent 40%
        )`,
      }}
    />
  );
}
