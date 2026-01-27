import { useEffect, useRef, useState } from 'react';

interface Skill {
  name: string;
  value: number;
  color?: string;
}

interface SkillsRadarChartProps {
  skills?: Skill[];
  size?: number;
  className?: string;
}

const defaultSkills: Skill[] = [
  { name: 'Shopify', value: 95, color: '#96bf48' },
  { name: 'WordPress', value: 90, color: '#21759b' },
  { name: 'Automation', value: 88, color: '#f59e0b' },
  { name: 'Funnels', value: 92, color: '#ff6b6b' },
  { name: 'Web Design', value: 88, color: '#a855f7' },
  { name: 'SEO', value: 90, color: '#06b6d4' },
];

export default function SkillsRadarChart({
  skills = defaultSkills,
  size = 300,
  className = ''
}: SkillsRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate progress
  useEffect(() => {
    if (!isVisible) return;

    let frame: number;
    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible]);

  // Draw radar chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.32;
    const numSkills = skills.length;
    const angleStep = (Math.PI * 2) / numSkills;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background rings
    const rings = 5;
    for (let i = 1; i <= rings; i++) {
      const ringRadius = (radius / rings) * i;
      ctx.beginPath();
      for (let j = 0; j <= numSkills; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * ringRadius;
        const y = centerY + Math.sin(angle) * ringRadius;
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(148, 163, 184, ${0.1 + (i * 0.05)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw data polygon with animation
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.2)');

    for (let i = 0; i <= numSkills; i++) {
      const idx = i % numSkills;
      const angle = idx * angleStep - Math.PI / 2;
      const value = (skills[idx].value / 100) * radius * animationProgress;
      const x = centerX + Math.cos(angle) * value;
      const y = centerY + Math.sin(angle) * value;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = (skills[i].value / 100) * radius * animationProgress;
      const x = centerX + Math.cos(angle) * value;
      const y = centerY + Math.sin(angle) * value;

      // Glow effect
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      glowGradient.addColorStop(0, skills[i].color || '#06b6d4');
      glowGradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Point
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = skills[i].color || '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw labels
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 25;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      // Label background
      const text = skills[i].name;
      const metrics = ctx.measureText(text);
      const padding = 6;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.beginPath();
      ctx.roundRect(
        x - metrics.width / 2 - padding,
        y - 10,
        metrics.width + padding * 2,
        20,
        4
      );
      ctx.fill();

      // Label text
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(text, x, y);

      // Value indicator
      if (animationProgress > 0.5) {
        const valueOpacity = (animationProgress - 0.5) * 2;
        ctx.fillStyle = `rgba(6, 182, 212, ${valueOpacity})`;
        ctx.font = 'bold 10px Inter, system-ui, sans-serif';
        ctx.fillText(`${skills[i].value}%`, x, y + 16);
      }
    }

  }, [skills, size, animationProgress]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="drop-shadow-lg"
      />

      {/* Center decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center"
          style={{ opacity: animationProgress }}
        >
          <span className="text-xs font-bold text-cyan-400">
            {Math.round(skills.reduce((acc, s) => acc + s.value, 0) / skills.length)}%
          </span>
        </div>
      </div>
    </div>
  );
}
