import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDelay?: number;
  className?: string;
  randomize?: boolean;
  fallback?: string;
}

export default function TypewriterText({
  words: initialWords,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDelay = 2000,
  className = '',
  randomize = false,
  fallback = 'Business Consultant',
}: TypewriterTextProps) {
  const [words] = useState(() => {
    if (!initialWords || initialWords.length === 0) return [fallback];
    if (!randomize) return initialWords;
    return [...initialWords].sort(() => Math.random() - 0.5);
  });
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Handle pause state separately to avoid nested setTimeout
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDelay);
      return () => clearTimeout(pauseTimer);
    }

    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (text.length < currentWord.length) {
          setText(currentWord.slice(0, text.length + 1));
        } else {
          // Pause at end before deleting
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          // Move to next word
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, isPaused, wordIndex, words, typingSpeed, deletingSpeed, pauseDelay]);

  return (
    <span className={className}>
      <span>{text}</span>
      <span className="inline-block ml-0.5 animate-pulse">|</span>
    </span>
  );
}

// Simple fade-in text animation
interface FadeInTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function FadeInText({ text, className = '', delay = 0, staggerDelay = 0.03 }: FadeInTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.char');

    gsap.set(chars, { opacity: 0, y: 20 });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: staggerDelay,
      delay: delay,
      ease: 'power2.out',
    });
  }, [delay, staggerDelay]);

  return (
    <span ref={containerRef} className={className}>
      {text.split('').map((char, index) => (
        <span key={index} className="char inline-block">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

// Word-by-word reveal
interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function RevealText({ text, className = '', delay = 0 }: RevealTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useGSAP(() => {
    if (!containerRef.current) return;

    const wordElements = containerRef.current.querySelectorAll('.word');

    gsap.set(wordElements, {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)'
    });

    gsap.to(wordElements, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.5,
      stagger: 0.1,
      delay: delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom-=50px',
        toggleActions: 'play none none none',
      },
    });
  }, [delay]);

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, index) => (
        <span key={index} className="word inline-block mr-2">
          {word}
        </span>
      ))}
    </span>
  );
}
