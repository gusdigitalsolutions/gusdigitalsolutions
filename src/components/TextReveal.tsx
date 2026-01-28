import { useRef, useMemo, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

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
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const words = useMemo(() => children.split(' '), [children]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const wordElements = wordsRef.current.filter(Boolean);
    if (wordElements.length === 0) return;

    gsap.set(wordElements, { opacity: 0.1, y: 20 });

    gsap.to(wordElements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: staggerDelay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'top 40%',
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    });
  }, { scope: containerRef, dependencies: [staggerDelay, once] });

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <Component className="flex flex-wrap">
        {words.map((word, i) => (
          <span
            key={i}
            ref={(el) => { wordsRef.current[i] = el; }}
            className="inline-block mr-[0.25em] last:mr-0"
          >
            {word}
          </span>
        ))}
      </Component>
    </div>
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
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const characters = useMemo(() => children.split(''), [children]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const charElements = charsRef.current.filter(Boolean);
    if (charElements.length === 0) return;

    gsap.set(charElements, { opacity: 0, y: 30, rotateX: 45 });

    gsap.to(charElements, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.4,
      stagger: staggerDelay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'top 50%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef, dependencies: [staggerDelay] });

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <Component className="flex flex-wrap">
        {characters.map((char, i) => (
          <span
            key={i}
            ref={(el) => { charsRef.current[i] = el; }}
            style={{ display: 'inline-block', transformOrigin: 'bottom' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </Component>
    </div>
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
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);

  const lines = useMemo(() => {
    return children.split(/(?<=\.|\?|!)\s+/).filter((line) => line.trim());
  }, [children]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const lineElements = linesRef.current.filter(Boolean);
    if (lineElements.length === 0) return;

    gsap.set(lineElements, { opacity: 0.2, x: -30, clipPath: 'inset(0 100% 0 0)' });

    gsap.to(lineElements, {
      opacity: 1,
      x: 0,
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'top 40%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, i) => (
        <p
          key={i}
          ref={(el) => { linesRef.current[i] = el; }}
          className={`mb-2 last:mb-0 ${lineClassName}`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

// Simple fade-up reveal for any content
interface FadeUpRevealProps {
  children: ReactNode;
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
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.set(ref.current, { opacity: 0, y: 40 });

    gsap.to(ref.current, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom-=50px',
        toggleActions: 'play none none none',
      },
    });
  }, { dependencies: [delay, duration] });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
