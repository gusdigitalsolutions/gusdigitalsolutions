import { useRef, useCallback, type ReactNode, type MouseEvent } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  magneticStrength?: number;
  scaleOnHover?: number;
}

export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  magneticStrength = 0.4,
  scaleOnHover = 1.05,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement | HTMLAnchorElement>(null);

  // Handle mouse movement for magnetic attraction
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!buttonRef.current || !innerRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Apply magnetic attraction with GSAP spring-like ease
      gsap.to(innerRef.current, {
        x: deltaX * magneticStrength,
        y: deltaY * magneticStrength,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    [magneticStrength]
  );

  const handleMouseEnter = useCallback(() => {
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      scale: scaleOnHover,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [scaleOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (!innerRef.current) return;
    // Reset position and scale
    gsap.to(innerRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  const handleClick = useCallback(() => {
    if (!innerRef.current) return;
    // Click animation
    gsap.to(innerRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(innerRef.current, {
          scale: scaleOnHover,
          duration: 0.2,
          ease: 'power2.out',
        });
      },
    });
    if (onClick) onClick();
  }, [onClick, scaleOnHover]);

  const InnerComponent = href ? 'a' : 'div';

  return (
    <div
      ref={buttonRef}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <InnerComponent
        ref={innerRef as any}
        href={href}
        className={`inline-block cursor-pointer transform-gpu ${className}`}
        onClick={handleClick}
      >
        {children}
      </InnerComponent>
    </div>
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
