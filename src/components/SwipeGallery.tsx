import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SwipeGalleryProps {
  images: string[];
}

export default function SwipeGallery({ images }: SwipeGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, images.length - 1));
    setCurrentIndex(clampedIndex);
    
    if (containerRef.current) {
      const scrollAmount = clampedIndex * 320; // card width + gap
      containerRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const next = () => scrollToIndex(currentIndex + 1);
  const prev = () => scrollToIndex(currentIndex - 1);

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={prev}
        disabled={currentIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all -ml-4"
        aria-label="Previous"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={next}
        disabled={currentIndex >= images.length - 3}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all -mr-4"
        aria-label="Next"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Gallery Container */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-8 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, i) => (
          <motion.div
            key={img}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex-shrink-0 snap-center"
          >
            <img
              src={img}
              alt={`Creative work ${i + 1}`}
              className="w-72 h-48 md:w-80 md:h-56 lg:w-96 lg:h-64 object-cover rounded-2xl shadow-2xl border border-dark-700/50 hover:border-primary-500/50 hover:scale-[1.02] transition-all cursor-pointer"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? 'bg-primary-500 w-6' : 'bg-dark-600 hover:bg-dark-500'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
