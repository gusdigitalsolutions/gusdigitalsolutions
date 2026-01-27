import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoName: 'hero-bg' | 'services-bg' | 'experience-bg' | 'contact-bg' | 'hero-loop';
  overlayOpacity?: number;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
  className?: string;
  /** Minimum height for mobile viewports */
  mobileMinHeight?: string;
}

export default function VideoBackground({
  videoName,
  overlayOpacity = 0.6,
  blendMode = 'normal',
  className = '',
  mobileMinHeight = '100vh',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Handle loading state for smooth reveal
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (videoRef.current) {
        if (e.matches) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Intersection observer for performance - pause when out of view
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefersReducedMotion) {
            video.play().catch(() => {
              // Autoplay blocked, that's fine
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    // Safety fallback: ensure video is revealed after a short delay
    // This prevents the "screen goes blank" issue if onCanPlay doesn't fire immediately
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Show static fallback for reduced motion OR mobile (save data/battery and prevent overlay issues)
  if (prefersReducedMotion || isMobile) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950/30 ${className}`}
        style={{ mixBlendMode: blendMode }}
      />
    );
  }

  // Mobile-specific styles for proper video scaling
  const containerStyle: React.CSSProperties = {
    minHeight: isMobile ? mobileMinHeight : undefined,
  };

  const videoStyle: React.CSSProperties = {
    mixBlendMode: blendMode,
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={containerStyle}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={handleCanPlay}
        style={videoStyle}
      >
        {/* WebM first for better compression */}
        <source src={`/assets/videos/${videoName}.webm`} type="video/webm" />
        {/* MP4 fallback */}
        <source src={`/assets/videos/${videoName}.mp4`} type="video/mp4" />
      </video>

      {/* Gradient overlay for better text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/50 to-dark-950/90"
        style={{ opacity: overlayOpacity }}
      />

      {/* Noise texture overlay for cinematic effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-dark-950 animate-pulse" />
      )}
    </div>
  );
}
