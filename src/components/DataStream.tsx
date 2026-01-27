import { useEffect, useRef, useState } from 'react';

interface DataStreamProps {
  className?: string;
  streamCount?: number;
  speed?: 'slow' | 'medium' | 'fast';
}

export default function DataStream({ className = '', streamCount = 20, speed = 'medium' }: DataStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [streams, setStreams] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    chars: string[];
  }>>([]);

  useEffect(() => {
    const generateStreams = () => {
      const speedMap = { slow: 8, medium: 5, fast: 3 };
      const baseDuration = speedMap[speed];

      return Array.from({ length: streamCount }, (_, i) => {
        const chars = Array.from({ length: 15 + Math.random() * 10 }, () =>
          Math.random() > 0.5
            ? String.fromCharCode(0x30A0 + Math.random() * 96) // Katakana
            : Math.random() > 0.5
              ? String(Math.floor(Math.random() * 10))
              : String.fromCharCode(65 + Math.random() * 26) // Letters
        );

        return {
          id: i,
          left: (i / streamCount) * 100 + Math.random() * 5,
          delay: Math.random() * 5,
          duration: baseDuration + Math.random() * 3,
          chars
        };
      });
    };

    setStreams(generateStreams());
  }, [streamCount, speed]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity: 0.15 }}
    >
      {streams.map(stream => (
        <div
          key={stream.id}
          className="absolute top-0 font-mono text-xs leading-tight"
          style={{
            left: `${stream.left}%`,
            animation: `dataFall ${stream.duration}s linear ${stream.delay}s infinite`,
            color: '#06b6d4'
          }}
        >
          {stream.chars.map((char, i) => (
            <div
              key={i}
              style={{
                opacity: 1 - (i / stream.chars.length) * 0.8,
                textShadow: i === 0 ? '0 0 10px #06b6d4, 0 0 20px #06b6d4' : undefined
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}

      <style>{`
        @keyframes dataFall {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
