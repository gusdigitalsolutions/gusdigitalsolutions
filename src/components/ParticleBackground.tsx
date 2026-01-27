import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

const particlesConfig: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        width: 800,
        height: 800,
      },
    },
    color: {
      value: ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#22d3ee'],
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: { min: 0.3, max: 0.8 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    size: {
      value: { min: 2, max: 5 },
      animation: {
        enable: true,
        speed: 2,
        sync: false,
      },
    },
    links: {
      enable: true,
      distance: 150,
      color: '#3b82f6',
      opacity: 0.4,
      width: 1,
      triangles: {
        enable: false,
      },
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: 'none',
      random: true,
      straight: false,
      outModes: {
        default: 'bounce',
      },
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: {
        enable: true,
        mode: 'grab',
        parallax: {
          enable: true,
          force: 60,
          smooth: 10,
        },
      },
      onClick: {
        enable: true,
        mode: 'push',
      },
    },
    modes: {
      grab: {
        distance: 180,
        links: {
          opacity: 0.8,
          color: '#22d3ee',
        },
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  background: {
    color: 'transparent',
  },
  detectRetina: true,
};

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={particlesConfig}
      className="absolute inset-0 w-full h-full"
      style={{ position: 'absolute', zIndex: 5, pointerEvents: 'auto' }}
    />
  );
}
