import { useEffect, useState, useRef } from 'react';

interface Badge {
  value: string;
  label: string;
  icon: string;
  color: string;
}

interface CredibilityBadgesProps {
  className?: string;
}

const badges: Badge[] = [
  {
    value: '50+',
    label: 'Projects Completed',
    icon: '🎯',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    value: '100%',
    label: 'Client Satisfaction',
    icon: '⭐',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    value: '15+',
    label: 'Years Experience',
    icon: '📅',
    color: 'from-purple-500 to-pink-500'
  },
  {
    value: '1 Day',
    label: 'Response Time',
    icon: '💬',
    color: 'from-green-500 to-emerald-500'
  }
];

function CountUpNumber({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Skip if already animated or no end value
    if (hasAnimated.current || !end) return;
    hasAnimated.current = true;

    // Start animation immediately after a brief delay for hydration
    const startDelay = setTimeout(() => {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    }, 100);

    return () => clearTimeout(startDelay);
  }, [end, duration]);

  return <span ref={ref} style={{ display: 'inline-block', minWidth: '1ch' }}>{count}</span>;
}

export default function CredibilityBadges({ className = '' }: CredibilityBadgesProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${className}`}>
      {badges.map((badge, index) => (
        <div
          key={badge.label}
          className="group relative"
        >
          {/* Animated Glow Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-purple-600/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
          
          {/* Card Frame */}
          <div className="relative p-5 md:p-6 rounded-[2rem] bg-dark-900/40 border-2 border-white/5 backdrop-blur-xl group-hover:border-primary-500/30 transition-all duration-500 flex flex-col items-center text-center overflow-hidden">
            {/* Node Reference */}
            <div className="absolute top-0 right-0 p-3 opacity-5 font-mono text-[7px] text-white">METRIC_0{index + 1}</div>

            {/* Circular Meter Background */}
            <div className="relative mb-4">
               <div className={`absolute inset-0 bg-gradient-to-tr ${badge.color} opacity-10 rounded-full blur-lg group-hover:opacity-30 transition-opacity`} />
               <div className="relative w-14 h-14 rounded-full border-2 border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 bg-dark-950/50 shadow-xl">
                 {badge.icon}
                 {/* Progress Spinner */}
                 <div className={`absolute inset-[-3px] border-t-2 border-r-2 rounded-full opacity-20 animate-spin-slow ${badge.color.includes('cyan') ? 'border-cyan-500' : badge.color.includes('yellow') ? 'border-yellow-500' : badge.color.includes('purple') ? 'border-purple-500' : 'border-green-500'}`} style={{ animationDuration: '4s' }} />
               </div>
            </div>

            {/* Value Container */}
            <div className="space-y-1 mb-1">
              <div className="text-3xl md:text-4xl font-black tracking-tighter text-white drop-shadow-2xl">
                {badge.value.includes('+') ? (
                  <>
                    <CountUpNumber end={parseInt(badge.value)} />+
                  </>
                ) : badge.value.includes('%') ? (
                  <>
                    <CountUpNumber end={parseInt(badge.value)} />%
                  </>
                ) : (
                  badge.value
                )}
              </div>
              <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em]">{badge.label}</p>
            </div>

            {/* Status Indicator */}
            <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[7px] font-bold text-dark-400 uppercase tracking-widest leading-none">Verified Metric</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
