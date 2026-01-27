import { useEffect, useRef, useState } from 'react';

interface TechItem {
  name: string;
  icon: string;
  color: string;
  category: 'platform' | 'tool' | 'service' | 'development' | 'cloud' | 'ai';
}

interface TechStackTagsProps {
  className?: string;
}

const techStack: TechItem[] = [
  // Platforms
  { name: 'Shopify', icon: '🛒', color: '#96bf48', category: 'platform' },
  { name: 'WordPress', icon: '📝', color: '#21759b', category: 'platform' },
  { name: 'Bubble', icon: '🫧', color: '#ffffff', category: 'platform' },
  { name: 'TikTok Shop', icon: '🎵', color: '#ff0050', category: 'platform' },
  { name: 'Amazon Business', icon: '📦', color: '#ff9900', category: 'platform' },

  // Google Ecosystem
  { name: 'Google Ads', icon: '📈', color: '#4285f4', category: 'tool' },
  { name: 'Google Analytics', icon: '📊', color: '#f9ab00', category: 'tool' },
  { name: 'Search Console', icon: '🔍', color: '#4285f4', category: 'tool' },
  { name: 'Google Business', icon: '🏢', color: '#4285f4', category: 'tool' },

  // Social Media
  { name: 'Instagram', icon: '📸', color: '#e4405f', category: 'service' },
  { name: 'Facebook', icon: '👥', color: '#1877f2', category: 'service' },
  { name: 'TikTok', icon: '📱', color: '#000000', category: 'service' },

  // AI & Automation
  { name: 'Claude API', icon: '🟣', color: '#d97757', category: 'ai' },
  { name: 'ChatGPT', icon: '🤖', color: '#10a37f', category: 'ai' },
  { name: 'Perplexity', icon: '🔎', color: '#22b8cf', category: 'ai' },
  { name: 'Make.com', icon: '🔄', color: '#6d00cc', category: 'ai' },
  { name: 'Zapier Pro', icon: '⚡', color: '#ff4a00', category: 'ai' },

  // Email & CRM
  { name: 'HubSpot Pro', icon: '🟠', color: '#ff7a59', category: 'tool' },
  { name: 'Pipedrive', icon: '💼', color: '#00d062', category: 'tool' },
  { name: 'ConvertKit', icon: '📨', color: '#ff7e5f', category: 'service' },
  { name: 'ActiveCampaign', icon: '🚀', color: '#314ce2', category: 'service' },
  { name: 'Klaviyo', icon: '📧', color: '#25cf60', category: 'service' },

  // Design
  { name: 'Figma', icon: '🎨', color: '#f24e1e', category: 'development' },
  { name: 'Adobe Express', icon: '✨', color: '#cc0f0f', category: 'development' },
  
  // SEO
  { name: 'Ahrefs', icon: '📈', color: '#0063f5', category: 'service' },
  { name: 'SEMrush', icon: '🦁', color: '#ff642d', category: 'service' },
  { name: 'Surfer SEO', icon: '🏄', color: '#f1c40f', category: 'service' },

  // Cloud & Infrastructure
  { name: 'AWS', icon: '☁️', color: '#ff9900', category: 'cloud' },
  { name: 'DigitalOcean', icon: '🌊', color: '#0080ff', category: 'cloud' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791', category: 'cloud' },
  { name: 'Docker', icon: '🐳', color: '#2496ed', category: 'cloud' },
  { name: 'GitHub Actions', icon: '🔄', color: '#2088ff', category: 'cloud' },
  { name: 'SSL Security', icon: '🔒', color: '#00c853', category: 'cloud' },

  // Development & AI
  { name: 'React', icon: '⚛️', color: '#61dafb', category: 'development' },
  { name: 'TypeScript', icon: '📘', color: '#3178c6', category: 'development' },
  { name: 'Bot Dev', icon: '🤖', color: '#7289da', category: 'development' },
  { name: 'Prompt Eng', icon: '🧠', color: '#ff00ff', category: 'ai' },
  { name: 'Gemini API', icon: '✨', color: '#4285f4', category: 'ai' },
];

export default function TechStackTags({ className = '' }: TechStackTagsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categories = {
    platform: { label: 'Platforms', items: techStack.filter(t => t.category === 'platform') },
    tool: { label: 'Tools', items: techStack.filter(t => t.category === 'tool') },
    service: { label: 'Services', items: techStack.filter(t => t.category === 'service') },
    development: { label: 'Development', items: techStack.filter(t => t.category === 'development') },
    cloud: { label: 'Cloud & DevOps', items: techStack.filter(t => t.category === 'cloud') },
    ai: { label: 'AI & Automation', items: techStack.filter(t => t.category === 'ai') },
  };

  return (
    <div ref={containerRef} className={className}>
      {Object.entries(categories).map(([key, { label, items }], categoryIndex) => (
        <div key={key} className="mb-3 last:mb-0">
          <h4 className="text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">
            {label}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((tech, index) => (
              <div
                key={tech.name}
                className={`
                  group relative flex items-center gap-1.5 px-3 py-1
                  bg-dark-800/50 backdrop-blur-sm border border-white/10
                  rounded-full cursor-default
                  hover:border-white/30 hover:bg-dark-700/50
                  transition-all duration-300 hover:scale-105
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{
                  transitionDelay: `${(categoryIndex * 4 + index) * 30}ms`,
                  borderColor: isVisible ? `${tech.color}20` : undefined,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"
                  style={{ backgroundColor: tech.color }}
                />

                {/* Icon */}
                <span className="text-base relative z-10">{tech.icon}</span>

                {/* Name */}
                <span
                  className="text-xs font-semibold relative z-10 transition-colors duration-300"
                  style={{ color: isVisible ? tech.color : '#94a3b8' }}
                >
                  {tech.name}
                </span>

                {/* Pulse dot for platforms */}
                {tech.category === 'platform' && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: tech.color }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
