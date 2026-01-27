import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

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
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: delay + index * staggerDelay,
                duration: 0.3,
              },
            },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Word-by-word reveal
interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function RevealText({ text, className = '', delay = 0 }: RevealTextProps) {
  const words = text.split(' ');

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={{
            hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                delay: delay + index * 0.1,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
