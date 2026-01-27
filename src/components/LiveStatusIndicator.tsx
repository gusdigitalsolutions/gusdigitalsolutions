import { useEffect, useState, useRef } from 'react';

interface StatusLine {
  text: string;
  type: 'info' | 'success' | 'warning' | 'system';
}

interface LiveStatusIndicatorProps {
  className?: string;
  showInCorner?: boolean;
}

const statusMessages: StatusLine[] = [
  { text: '[SYS] Portfolio v2.0 initialized', type: 'system' },
  { text: '[OK] All services operational', type: 'success' },
  { text: '[INFO] Available for new projects', type: 'info' },
  { text: '[OK] Response time: < 2 hours', type: 'success' },
  { text: '[INFO] Currently working on: Client projects', type: 'info' },
  { text: '[SYS] Skills updated: 2026-01', type: 'system' },
  { text: '[OK] Accepting consultations', type: 'success' },
];

export default function LiveStatusIndicator({ className = '', showInCorner = false }: LiveStatusIndicatorProps) {
  const [lines, setLines] = useState<StatusLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Type out messages one by one
  useEffect(() => {
    if (currentIndex >= statusMessages.length) {
      // Reset after showing all messages
      setTimeout(() => {
        setLines([]);
        setCurrentIndex(0);
      }, 5000);
      return;
    }

    const message = statusMessages[currentIndex];
    let charIndex = 0;
    setIsTyping(true);
    setTypedText('');

    const typeInterval = setInterval(() => {
      if (charIndex < message.text.length) {
        setTypedText(message.text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setLines(prev => [...prev, message]);
        setTypedText('');
        setTimeout(() => setCurrentIndex(prev => prev + 1), 800);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, typedText]);

  const getTypeColor = (type: StatusLine['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'system': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };



  return (
    <div className={`relative ${className}`}>
      {/* Terminal window */}
      <div className="bg-dark-950 rounded-lg border border-dark-700 overflow-hidden shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-dark-900 border-b border-dark-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-dark-500 font-mono ml-2">status@gusdigital ~ system-monitor</span>
        </div>

        {/* Terminal content */}
        <div
          ref={containerRef}
          className="p-4 font-mono text-sm h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-700"
        >
          {/* Completed lines */}
          {lines.map((line, index) => (
            <div key={index} className={`${getTypeColor(line.type)} mb-1`}>
              <span className="text-dark-500">$</span> {line.text}
            </div>
          ))}

          {/* Currently typing line */}
          {isTyping && (
            <div className={`${getTypeColor(statusMessages[currentIndex]?.type || 'info')} mb-1`}>
              <span className="text-dark-500">$</span> {typedText}
              <span className="animate-blink">▋</span>
            </div>
          )}

          {/* Cursor when idle */}
          {!isTyping && currentIndex < statusMessages.length && (
            <div className="text-dark-500">
              $ <span className="animate-blink">▋</span>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 bg-dark-900/50 border-t border-dark-700 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400">LIVE</span>
            </span>
            <span className="text-dark-500">|</span>
            <span className="text-dark-400">PID: 2026</span>
          </div>
          <span className="text-dark-500">Press any key to continue...</span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-dark-700::-webkit-scrollbar-thumb {
          background-color: rgb(55 65 81);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
