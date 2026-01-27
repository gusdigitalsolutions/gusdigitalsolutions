import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { useTouchDevice } from '../hooks/useTouchInteraction';

interface CursorFollowerProps {
  className?: string;
}

// Spring config for smooth, natural cursor movement
const springConfig = {
  stiffness: 500,
  damping: 28,
  mass: 0.5,
};

export default function CursorFollower({ className = '' }: CursorFollowerProps) {
  const isTouchDevice = useTouchDevice();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);

  // Motion values for cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring-animated position for smooth following
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  // Track mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);
  }, [cursorX, cursorY]);

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
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference ${className}`}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className={`rounded-full bg-white transition-all duration-150 ${
            isHovering ? 'w-12 h-12' : 'w-4 h-4'
          }`}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.9 : isHovering ? 1.2 : 1,
          opacity: isVisible ? 0.5 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`rounded-full border-2 border-white/50 transition-all duration-200 ${
            isHovering ? 'w-16 h-16' : 'w-8 h-8'
          }`}
        />
      </motion.div>

      {/* Hover text label */}
      {hoverText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            x: springX,
            y: springY,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="ml-8 mt-2 px-3 py-1 bg-dark-800 text-dark-100 text-sm rounded-full whitespace-nowrap">
            {hoverText}
          </div>
        </motion.div>
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
