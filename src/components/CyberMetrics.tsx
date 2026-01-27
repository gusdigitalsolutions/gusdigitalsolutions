import { useEffect, useState, useRef } from 'react';

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color?: string;
}

interface CyberMetricsProps {
  metrics?: Metric[];
  className?: string;
}

const defaultMetrics: Metric[] = [
  { label: 'Projects Delivered', value: 50, suffix: '+', color: '#06b6d4' },
  { label: 'Client Retention', value: 98, suffix: '%', color: '#a855f7' },
  { label: 'Avg Response', value: 2, suffix: 'hr', prefix: '<', color: '#22c55e' },
  { label: 'Years Experience', value: 15, suffix: '+', color: '#f59e0b' },
];

function AnimatedNumber({ value, suffix = '', prefix = '', color }: { value: number; suffix?: string; prefix?: string; color?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Skip if already animated or no value
    if (hasAnimated.current || !value) return;
    hasAnimated.current = true;

    // Start animation immediately after a brief delay for hydration
    const startDelay = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += value / steps;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, stepTime);
    }, 100);

    return () => clearTimeout(startDelay);
  }, [value]);

  return (
    <div ref={ref} className="relative">
      <span
        className="text-4xl md:text-5xl font-mono font-bold tabular-nums"
        style={{
          color: color || '#06b6d4',
          textShadow: `0 0 20px ${color || '#06b6d4'}40, 0 0 40px ${color || '#06b6d4'}20`
        }}
      >
        {prefix}{displayValue}{suffix}
      </span>
      {/* Scan line effect */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none animate-scan"
        style={{ animationDuration: '3s' }}
      />
    </div>
  );
}

export default function CyberMetrics({ metrics = defaultMetrics, className = '' }: CyberMetricsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [metrics.length]);

  return (
    <div className={`relative ${className}`}>
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`
              relative p-4 md:p-6 rounded-lg border transition-all duration-500
              ${activeIndex === index
                ? 'border-cyan-500/50 bg-cyan-500/5 scale-105'
                : 'border-dark-700/50 bg-dark-900/50'
              }
            `}
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50" />

            {/* Metric content */}
            <div className="text-center space-y-2">
              <AnimatedNumber
                value={metric.value}
                suffix={metric.suffix}
                prefix={metric.prefix}
                color={metric.color}
              />
              <p className="text-xs md:text-sm text-dark-400 uppercase tracking-wider font-medium px-1">
                {metric.label}
              </p>
            </div>

            {/* Active indicator */}
            {activeIndex === index && (
              <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
