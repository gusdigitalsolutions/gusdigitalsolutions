import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  tags,
  category,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    // Initial state
    gsap.set(cardRef.current, {
      opacity: 0,
      y: 20,
    });

    // Scroll-triggered animation
    gsap.to(cardRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom-=50px',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60 z-10 transition-opacity group-hover:opacity-40" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-top transform scale-[1.01] group-hover:scale-110 transition-transform duration-1000 ease-out"
        />

        {/* Category Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] bg-primary-600/90 text-white rounded-lg backdrop-blur-md shadow-lg">
            {category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-dark-400 text-sm mb-6 leading-relaxed flex-grow">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-tighter text-dark-300 bg-dark-900/50 border border-dark-700/50 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProjectCard;
