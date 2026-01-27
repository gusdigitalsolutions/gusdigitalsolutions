import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function HeroVideoTransition() {
  const [phase, setPhase] = useState<'waiting' | 'video' | 'done'>('waiting');
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check for mobile on mount and window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Standard threshold for desktop
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Skip intro logic
    const hasSeenIntro = localStorage.getItem('hasSeenSpaceIntro');
    if (hasSeenIntro === 'true') {
      setPhase('done');
      return;
    }

    const handleIntroDone = () => {
      setPhase('video');
    };

    window.addEventListener('space-intro-complete', handleIntroDone);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('space-intro-complete', handleIntroDone);
    };
  }, []);

  // Handle video playback
  useEffect(() => {
    if (phase === 'video' && videoRef.current && !isMobile) {
      videoRef.current.play().catch(err => {
        console.warn("Video auto-play failed, finishing naturally", err);
        setPhase('done');
      });
    } else if (phase === 'video' && isMobile) {
      // Direct skip on mobile
      setPhase('done');
    }
  }, [phase, isMobile]);

  const handlePlaying = () => {
    // Play the cinematic transition for 3 seconds then fade into the live site
    setTimeout(() => {
      setPhase('done');
      localStorage.setItem('hasSeenSpaceIntro', 'true');
    }, 3000);
  };

  // If mobile or already done, don't render anything
  if (isMobile || phase === 'done') return null;

  return (
    <div className="fixed inset-0 z-[9000] bg-dark-950 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'waiting' && (
          <motion.div
            key="waiting-bg"
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }} // Don't fade out, just switch
            className="absolute inset-0 bg-dark-950"
          />
        )}
        
        {phase === 'video' && (
          <motion.div 
            key="hero-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // Fade out when done to reveal site
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              onPlaying={handlePlaying}
            >
              <source src="/assets/videos/hero-bg.webm" type="video/webm" />
              <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-dark-950/20 backdrop-blur-[2px]"></div>

            {/* Branding Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2">
                  Initializing <span className="text-primary-500">System</span>
                </h2>
                <div className="h-1 w-24 bg-primary-500 mx-auto rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              </motion.div>
            </div>

            <button 
              onClick={() => setPhase('done')}
              className="absolute bottom-10 right-10 z-20 py-3 px-8 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all text-xs font-black uppercase tracking-widest backdrop-blur-xl"
            >
              Skip Transition →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
