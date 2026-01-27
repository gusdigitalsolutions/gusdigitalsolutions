import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
}

interface ProjectGalleryProps {
  projects: Project[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a horizontal scroll effect based on page scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Animate from right to left
  const xTranslate = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);
  const springX = useSpring(xTranslate, { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} className="py-10 overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div 
        style={{ x: springX }}
        className="flex gap-8 px-10"
      >
        {projects.concat(projects).map((project, index) => (
          <div 
            key={`${project.title}-${index}`}
            className="flex-shrink-0 w-[300px] md:w-[450px]"
          >
            <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-dark-800 border border-white/10 hover:border-primary-500/50 transition-all duration-500">
              {/* Image with zoom effect */}
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x500/1e293b/white?text=${project.title}`;
                }}
              />

              {/* Overlay content */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-2 block">{project.category}</span>
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-dark-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-[10px] rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Project Button */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
