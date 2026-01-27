import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook for scroll-driven animations
export function useScrollAnimations() {
  useEffect(() => {
    // Stagger reveal for service cards
    const serviceCards = gsap.utils.toArray('.service-card');
    serviceCards.forEach((card, i) => {
      gsap.from(card as Element, {
        scrollTrigger: {
          trigger: card as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        scale: 0.95,
        rotateX: -10,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });

    // Parallax hero elements
    const heroOrbs = gsap.utils.toArray('.hero-orb');
    heroOrbs.forEach((orb, index) => {
      const speed = 0.1 + index * 0.05;
      gsap.to(orb as Element, {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: `${100 + index * 50}`,
        ease: 'none',
      });
    });

    // Counter animation for stats
    const statNumbers = gsap.utils.toArray('.stat-number');
    statNumbers.forEach((el) => {
      const element = el as HTMLElement;
      const target = parseInt(element.dataset.value || element.textContent || '0');

      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        textContent: 0,
        duration: 2,
        snap: { textContent: 1 },
        ease: 'power2.out',
        onUpdate: function() {
          element.textContent = Math.round(parseFloat(element.textContent || '0')).toString();
        },
      });
    });

    // Section title reveals
    const sectionTitles = gsap.utils.toArray('.section-title');
    sectionTitles.forEach((title) => {
      const element = title as HTMLElement;
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          element.classList.add('revealed');
        },
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

// Component wrapper for scroll animations
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'blur';
  delay?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animations = {
      fadeUp: { y: 60, opacity: 0 },
      fadeLeft: { x: -60, opacity: 0 },
      fadeRight: { x: 60, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      blur: { filter: 'blur(20px)', opacity: 0 },
    };

    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      ...animations[animation],
      duration,
      delay,
      ease: 'power3.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) trigger.kill();
      });
    };
  }, [animation, delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Magnetic button effect component
export function MagneticButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={buttonRef} className={className}>
      {children}
    </div>
  );
}

// Smooth scroll animation initializer (for use in Layout)
export function initSmoothScrollAnimations() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Batch reveal animations
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el as Element, {
      scrollTrigger: {
        trigger: el as Element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  });
}

// Section-specific transition animations
const sectionAnimations: Record<string, gsap.TweenVars> = {
  about: {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  },
  services: {
    y: 60,
    opacity: 0,
    scale: 0.95,
    duration: 0.8,
    ease: 'power3.out',
  },
  experience: {
    opacity: 0,
    filter: 'blur(20px)',
    duration: 1,
    ease: 'power2.out',
  },
  skills: {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
  },
  faq: {
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  },
  contact: {
    y: 80,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  },
};

// Initialize section-specific entrance animations
export function initSectionTransitions() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Animate each section with its unique entrance
  Object.entries(sectionAnimations).forEach(([sectionId, animation]) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Get immediate children to animate (not deeply nested)
    const container = section.querySelector('.container') || section;

    gsap.from(container, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
      ...animation,
    });
  });

  // Special stagger animation for services cards
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    const cards = servicesSection.querySelectorAll('.flip-card-container, [class*="flip-card"]');
    if (cards.length > 0) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: servicesSection,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        scale: 0.9,
        rotateY: -15,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }
}

// Parallax depth effects for backgrounds
export function initParallaxDepth() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Parallax for decorative background elements
  gsap.utils.toArray('.parallax-bg').forEach((el, index) => {
    const speed = 0.1 + (index % 3) * 0.05;
    const direction = index % 2 === 0 ? 1 : -1;

    gsap.to(el as Element, {
      scrollTrigger: {
        trigger: el as Element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: `${direction * 100 * speed}`,
      ease: 'none',
    });
  });

  // Parallax for gradient orbs
  gsap.utils.toArray('.gradient-orb, [class*="bg-primary"], [class*="bg-purple"]').forEach((el, index) => {
    const element = el as HTMLElement;
    if (!element.classList.contains('blur-')) return; // Only target blurred decorative elements

    gsap.to(element, {
      scrollTrigger: {
        trigger: element.parentElement || element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
      y: (index % 2 === 0 ? 50 : -50),
      x: (index % 3 === 0 ? 20 : -20),
      ease: 'none',
    });
  });

  // Floating orbs in hero section
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const orbs = heroSection.querySelectorAll('[class*="rounded-full"][class*="blur"]');
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: 100 + i * 30,
        rotation: i % 2 === 0 ? 10 : -10,
        ease: 'none',
      });
    });
  }
}

// Text split and reveal animation
export function initTextSplitReveal() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Animate section titles with character-level split
  gsap.utils.toArray('.section-title, .neon-title').forEach((title) => {
    const element = title as HTMLElement;
    const text = element.textContent || '';

    // Only apply to elements that haven't been processed
    if (element.dataset.split === 'true') return;
    element.dataset.split = 'true';

    // Create word-wrapped spans using DOM API (avoids innerHTML XSS risk)
    element.textContent = '';
    const words = text.split(' ');
    words.forEach((word, i) => {
      if (i > 0) element.appendChild(document.createTextNode(' '));
      const outer = document.createElement('span');
      outer.className = 'inline-block overflow-hidden';
      const inner = document.createElement('span');
      inner.className = 'split-word inline-block';
      inner.textContent = word;
      outer.appendChild(inner);
      element.appendChild(outer);
    });

    const splitWords = element.querySelectorAll('.split-word');

    gsap.from(splitWords, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: '100%',
      opacity: 0,
      rotateX: -45,
      stagger: 0.05,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        element.classList.add('revealed');
      },
    });
  });

  // Animate subtitles with fade blur
  gsap.utils.toArray('.section-subtitle').forEach((subtitle) => {
    const element = subtitle as HTMLElement;

    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 30,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.8,
      delay: 0.3,
      ease: 'power2.out',
    });
  });
}

// Master initialization function - call this in Layout
export function initAllScrollAnimations() {
  if (typeof window === 'undefined') return;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Reduced motion preference detected - skipping scroll animations');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Initialize all animation systems
  initSectionTransitions();
  initParallaxDepth();
  initTextSplitReveal();
  initSmoothScrollAnimations();

  // Refresh ScrollTrigger after all DOM manipulations
  ScrollTrigger.refresh();
}

// React component to initialize all scroll animations
export function ScrollAnimationsInit() {
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      initAllScrollAnimations();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null; // This component doesn't render anything
}
