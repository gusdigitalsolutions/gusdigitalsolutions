import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { motion, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useDragGesture, useTouchDevice } from '../hooks/useTouchInteraction';

interface MobileCardCarouselProps {
  children: ReactNode[];
  className?: string;
  showOnlyOnMobile?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  gap?: number;
  peekAmount?: number; // How much of next/prev card to show
}

// Spring config for snappy, natural feel
const springConfig = {
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export default function MobileCardCarousel({
  children,
  className = '',
  showOnlyOnMobile = true,
  showDots = true,
  showArrows = false,
  gap = 16,
  peekAmount = 40,
}: MobileCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useTouchDevice();

  // Spring-animated offset
  const offset = useSpring(0, springConfig);

  // Calculate card width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Card width = container width - peek amount on each side
        const containerWidth = containerRef.current.offsetWidth;
        setCardWidth(containerWidth - peekAmount * 2);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [peekAmount]);

  // Update offset when active index changes
  useEffect(() => {
    const newOffset = -activeIndex * (cardWidth + gap);
    offset.set(newOffset);
  }, [activeIndex, cardWidth, gap, offset]);

  // Drag handling
  const dragState = useDragGesture(trackRef, {
    onDrag: (state) => {
      // Live drag feedback
      const baseOffset = -activeIndex * (cardWidth + gap);
      offset.set(baseOffset + state.deltaX);
    },
    onDragEnd: (state) => {
      const threshold = cardWidth * 0.3; // 30% of card width to trigger change

      if (Math.abs(state.deltaX) > threshold || Math.abs(state.velocity) > 0.5) {
        if (state.deltaX < 0 && activeIndex < children.length - 1) {
          // Swiped left, go to next
          setActiveIndex((prev) => prev + 1);
        } else if (state.deltaX > 0 && activeIndex > 0) {
          // Swiped right, go to previous
          setActiveIndex((prev) => prev - 1);
        } else {
          // Snap back to current
          offset.set(-activeIndex * (cardWidth + gap));
        }
      } else {
        // Snap back to current
        offset.set(-activeIndex * (cardWidth + gap));
      }
    },
    axis: 'x',
  });

  // Arrow navigation
  const goToNext = useCallback(() => {
    if (activeIndex < children.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  }, [activeIndex, children.length]);

  const goToPrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // If showOnlyOnMobile is true and not a touch device, render children normally
  if (showOnlyOnMobile && !isTouchDevice) {
    return (
      <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Carousel container */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{ padding: `0 ${peekAmount}px` }}
      >
        <motion.div
          ref={trackRef}
          className="flex touch-pan-y"
          style={{
            x: offset as MotionValue<number>,
            gap: `${gap}px`,
            cursor: dragState.isDragging ? 'grabbing' : 'grab',
          }}
        >
          {children.map((child, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              style={{ width: cardWidth }}
              animate={{
                scale: index === activeIndex ? 1 : 0.95,
                opacity: index === activeIndex ? 1 : 0.7,
              }}
              transition={{ duration: 0.3 }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800/80 backdrop-blur-sm border border-dark-600/50 text-dark-300 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700"
            aria-label="Previous card"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={activeIndex === children.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800/80 backdrop-blur-sm border border-dark-600/50 text-dark-300 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700"
            aria-label="Next card"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination dots */}
      {showDots && children.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-primary-500 w-8'
                  : 'bg-dark-600 hover:bg-dark-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Swipe hint (shows once) */}
      <SwipeHint />
    </div>
  );
}

// Swipe hint that shows on first view
function SwipeHint() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Only show if user hasn't seen it before
    const hasSeenHint = localStorage.getItem('carousel-swipe-hint-seen');
    if (!hasSeenHint) {
      setShowHint(true);
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem('carousel-swipe-hint-seen', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showHint) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-x-0 bottom-20 flex justify-center pointer-events-none"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/90 backdrop-blur-sm border border-dark-600/50 text-dark-300 text-sm">
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </motion.div>
        <span>Swipe to explore</span>
      </div>
    </motion.div>
  );
}

// Carousel card wrapper with touch feedback
interface CarouselCardProps {
  children: ReactNode;
  className?: string;
}

export function CarouselCard({ children, className = '' }: CarouselCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      className={`h-full ${className}`}
      animate={{ scale: isPressed ? 0.98 : 1 }}
      transition={{ duration: 0.15 }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
    >
      {children}
    </motion.div>
  );
}
