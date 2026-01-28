import { useState, useRef, useCallback, useEffect, type ReactNode, type MouseEvent, type TouchEvent } from 'react';
import gsap from 'gsap';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
}

// Magnetic tilt configuration
const TILT_MAX = 15; // degrees
const MAGNETIC_STRENGTH = 0.3;

export default function FlipCard({
  front,
  back,
  className = '',
  frontClassName = '',
  backClassName = '',
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Apply flip animation when isFlipped changes
  useEffect(() => {
    if (!innerRef.current) return;

    gsap.to(innerRef.current, {
      rotateY: isFlipped ? 180 : 0,
      duration: 0.6,
      ease: 'back.out(1.2)',
    });

    // Fade indicator
    if (indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        opacity: isFlipped ? 0 : 0.6,
        duration: 0.3,
      });
    }
  }, [isFlipped]);

  // Handle mouse movement for magnetic tilt effect
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !innerRef.current || isTouching) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center (normalized -1 to 1)
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      // Apply magnetic tilt with boundaries (additive to flip rotation)
      const tiltX = -deltaY * TILT_MAX * MAGNETIC_STRENGTH;
      const tiltY = deltaX * TILT_MAX * MAGNETIC_STRENGTH + (isFlipped ? 180 : 0);

      gsap.to(innerRef.current, {
        rotateX: tiltX,
        rotateY: tiltY,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    [isTouching, isFlipped]
  );

  const handleMouseEnter = useCallback(() => {
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      scale: 1.02,
      z: 20,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!innerRef.current) return;
    // Reset transforms but maintain flip state
    gsap.to(innerRef.current, {
      rotateX: 0,
      rotateY: isFlipped ? 180 : 0,
      scale: 1,
      z: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [isFlipped]);

  // Handle click/tap to flip
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback(() => {
    setIsTouching(true);
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      scale: 0.98,
      duration: 0.15,
      ease: 'power2.out',
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      scale: 1,
      duration: 0.15,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative cursor-pointer ${className}`}
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleFlip}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={innerRef}
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front face */}
        <div
          className={`absolute inset-0 backface-hidden ${frontClassName}`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {front}
        </div>

        {/* Back face */}
        <div
          className={`absolute inset-0 backface-hidden ${backClassName}`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>

      {/* Flip indicator */}
      <div
        ref={indicatorRef}
        className="absolute bottom-3 right-3 text-dark-500 pointer-events-none z-10"
        style={{ opacity: 0.6 }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    </div>
  );
}

// Icon mapping for ServiceFlipCard
const serviceIcons: Record<string, ReactNode> = {
  monitor: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  cart: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  layers: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  trending: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 6l-9.5 9.5-5-5L1 18"/>
      <path d="M17 6h6v6"/>
    </svg>
  ),
  users: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  cpu: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/>
      <line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/>
      <line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/>
      <line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/>
      <line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  funnel: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  plug: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4"/>
      <path d="M12 18v4"/>
      <path d="M4.93 4.93l2.83 2.83"/>
      <path d="M16.24 16.24l2.83 2.83"/>
      <path d="M2 12h4"/>
      <path d="M18 12h4"/>
      <path d="M4.93 19.07l2.83-2.83"/>
      <path d="M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  lightning: (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

// Service-specific flip card with pricing on back
interface ServiceFlipCardProps {
  title: string;
  description: string;
  icon: string; // Icon name as string
  gradient: string;
  pricing?: string;
  timeline?: string;
  features?: string[];
  showPrices?: boolean;
  showTimeline?: boolean;
}

export function ServiceFlipCard({
  title,
  description,
  icon,
  gradient,
  pricing = 'Contact for quote',
  timeline = '3-7 days',
  features = [],
  showPrices = true,
  showTimeline = true,
}: ServiceFlipCardProps) {
  const iconNode = serviceIcons[icon] || serviceIcons.monitor;

  // Helper for cross-page anchor links
  const getSafeHref = (href: string) => {
    if (typeof window === 'undefined') return href;
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    return (href.startsWith('#') && !isHome) ? `/${href}` : href;
  };

  const bookingUrl = "https://calendly.com/gus-gusdigitalsolutions/30min";

  return (
    <FlipCard
      className="h-full min-h-[300px] md:min-h-[380px]"
      front={
        <div
          className={`h-full p-6 md:p-8 rounded-[2rem] bg-gradient-to-br ${gradient} backdrop-blur-md border border-white/5 hover:border-primary-500/30 transition-all duration-500 flex flex-col group relative`}
        >
          {/* Icon Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="relative w-14 h-14 rounded-2xl bg-dark-900/60 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-primary-400">{iconNode}</div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-900/20 transition-all active:scale-95 z-20 relative pointer-events-auto flex items-center justify-center whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation(); // Avoid flipping when clicking the direct booking button
                }}
              >
                Book
              </a>
              <div className="w-8 h-8 rounded-full bg-dark-900/60 border border-white/10 flex items-center justify-center">
                 <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2 flex-grow">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter">{title}</h3>
            <p className="text-dark-300 leading-relaxed text-sm md:text-base line-clamp-3">{description}</p>
          </div>

          {/* Interaction Lead */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-tight">
              <span>View Details</span>
              <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            {/* Flip Toggle Icon - Blue Up/Down */}
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary-500 opacity-60 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                 {/* This down arrow implies "Flip to see more" */}
               </svg>
            </div>
          </div>
        </div>
      }
      back={
        <div
          className={`h-full p-6 md:p-8 rounded-[2rem] bg-dark-950 border-2 border-primary-500/30 flex flex-col shadow-2xl relative overflow-hidden`}
        >
          {/* Background Accent */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-600/10 rounded-full blur-[80px]"></div>

          {/* Title */}
          <div className="mb-4 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-1">Service Details</p>
              <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
            </div>
            {/* Close/Flip Back Button */}
            <button className="text-primary-500 hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto no-scrollbar pr-2 relative z-10">
            {/* Timeline */}
            {showTimeline && (
              <div>
                <span className="text-[10px] uppercase tracking-widest text-dark-500 font-bold mb-1.5 block">Estimated Delivery</span>
                <div className="flex items-center gap-2 text-dark-100 font-mono text-sm bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                  <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {timeline}
                </div>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="pb-2">
                <span className="text-[10px] uppercase tracking-widest text-dark-500 font-bold mb-2 block">Deployment Steps</span>
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-dark-300 group/item">
                      <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary-600/20 border border-primary-500/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                      </div>
                      <span className="group-hover:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CTA Group */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-2">
              <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Satisfaction Guaranteed
            </div>

            <a
              href={getSafeHref('#contact')}
              className="relative z-20 pointer-events-auto inline-flex items-center justify-center gap-3 px-6 py-4 w-full bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm uppercase tracking-tighter transition-all group/btn shadow-lg shadow-primary-900/20 active:scale-95"
              onClick={(e) => {
                e.stopPropagation(); // CRITICAL: Stop propagation so we don't flip back
              }}
            >
              Contact Gustavo
              <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      }
    />
  );
}
