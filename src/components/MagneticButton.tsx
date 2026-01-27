import { useRef, useCallback, type ReactNode, type MouseEvent } from 'react';
import { motion, useSpring, type MotionValue } from 'motion/react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  magneticStrength?: number;
  scaleOnHover?: number;
}

// Spring physics configuration for smooth magnetic effect
const springConfig = {
  stiffness: 200,
  damping: 20,
  mass: 0.5,
};

export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  magneticStrength = 0.4,
  scaleOnHover = 1.05,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  // Spring values for smooth magnetic movement
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  // Handle mouse movement for magnetic attraction
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Apply magnetic attraction (follows cursor)
      x.set(deltaX * magneticStrength);
      y.set(deltaY * magneticStrength);
    },
    [x, y, magneticStrength]
  );

  const handleMouseEnter = useCallback(() => {
    scale.set(scaleOnHover);
  }, [scale, scaleOnHover]);

  const handleMouseLeave = useCallback(() => {
    // Reset position and scale
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [x, y, scale]);

  const handleClick = useCallback(() => {
    if (onClick) onClick();
  }, [onClick]);

  const Component = href ? motion.a : motion.div;
  const componentProps = href ? { href } : {};

  return (
    <motion.div
      ref={buttonRef}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Component
        {...componentProps}
        className={`inline-block cursor-pointer ${className}`}
        style={{
          x: x as MotionValue<number>,
          y: y as MotionValue<number>,
          scale: scale as MotionValue<number>,
        }}
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}
      </Component>
    </motion.div>
  );
}

// Pre-styled magnetic CTA button
interface MagneticCTAProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function MagneticCTA({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
}: MagneticCTAProps) {
  const baseClasses = 'font-semibold rounded-xl transition-colors inline-flex items-center gap-2';

  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25',
    secondary:
      'bg-dark-800 hover:bg-dark-700 text-dark-100 border border-dark-700 hover:border-primary-500/50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <MagneticButton href={href} onClick={onClick} magneticStrength={0.3} scaleOnHover={1.03}>
      <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
        {children}
      </span>
    </MagneticButton>
  );
}
