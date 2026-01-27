import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';

interface TextRevealProps {
  children: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  staggerDelay?: number;
  once?: boolean;
}

export default function TextReveal({
  children,
  className = '',
  as: Component = 'p',
  staggerDelay = 0.03,
  once = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.4'],
  });

  // Split text into words
  const words = useMemo(() => children.split(' '), [children]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <Component className="flex flex-wrap">
        {words.map((word, i) => (
          <Word
            key={i}
            progress={scrollYProgress}
            index={i}
            total={words.length}
            staggerDelay={staggerDelay}
          >
            {word}
          </Word>
        ))}
      </Component>
    </div>
  );
}

// Individual word with reveal animation
interface WordProps {
  children: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
  staggerDelay: number;
}

function Word({ children, progress, index, total, staggerDelay }: WordProps) {
  // Calculate the range for this word based on its position
  const start = index / total;
  const end = start + 1 / total;

  // Transform scroll progress to opacity and Y position
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  const y = useTransform(progress, [start, end], [20, 0]);

  return (
    <motion.span
      style={{
        opacity,
        y,
      }}
      className="inline-block mr-[0.25em] last:mr-0"
    >
      {children}
    </motion.span>
  );
}

// Character-by-character reveal for headings
interface CharacterRevealProps {
  children: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  staggerDelay?: number;
}

export function CharacterReveal({
  children,
  className = '',
  as: Component = 'h2',
  staggerDelay = 0.02,
}: CharacterRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.5'],
  });

  // Split into characters
  const characters = useMemo(() => children.split(''), [children]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <Component className="flex flex-wrap">
        {characters.map((char, i) => (
          <Character
            key={i}
            progress={scrollYProgress}
            index={i}
            total={characters.length}
          >
            {char === ' ' ? '\u00A0' : char}
          </Character>
        ))}
      </Component>
    </div>
  );
}

interface CharacterProps {
  children: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}

function Character({ children, progress, index, total }: CharacterProps) {
  const start = index / total;
  const end = start + 0.5 / total;

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [30, 0]);
  const rotateX = useTransform(progress, [start, end], [45, 0]);

  return (
    <motion.span
      style={{
        opacity,
        y,
        rotateX,
        transformOrigin: 'bottom',
        display: 'inline-block',
      }}
    >
      {children}
    </motion.span>
  );
}

// Line-by-line reveal for paragraphs
interface LineRevealProps {
  children: string;
  className?: string;
  lineClassName?: string;
}

export function LineReveal({ children, className = '', lineClassName = '' }: LineRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.4'],
  });

  // Split by newlines or sentences
  const lines = useMemo(() => {
    return children.split(/(?<=\.|\?|!)\s+/).filter((line) => line.trim());
  }, [children]);

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, i) => {
        const start = i / lines.length;
        const end = start + 1 / lines.length;

        return (
          <LineItem
            key={i}
            progress={scrollYProgress}
            start={start}
            end={end}
            className={lineClassName}
          >
            {line}
          </LineItem>
        );
      })}
    </div>
  );
}

interface LineItemProps {
  children: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
}

function LineItem({ children, progress, start, end, className }: LineItemProps) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const x = useTransform(progress, [start, end], [-30, 0]);
  const clipPath = useTransform(
    progress,
    [start, end],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
  );

  return (
    <motion.p
      style={{
        opacity,
        x,
        clipPath,
      }}
      className={`mb-2 last:mb-0 ${className}`}
    >
      {children}
    </motion.p>
  );
}

// Simple fade-up reveal for any content
interface FadeUpRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeUpReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
}: FadeUpRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // ease-out-expo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
