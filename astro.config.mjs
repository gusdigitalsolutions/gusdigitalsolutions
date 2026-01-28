import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://gusdigitalsolutions.com',
  integrations: [
    tailwind(),
    react(),
    sitemap()
  ],
  output: 'static',
  adapter: netlify(),
  image: {
    // Enable Sharp for automatic image optimization
    service: { entrypoint: 'astro/assets/services/sharp' },
    // Default quality for optimized images
    quality: 80,
    // Generate responsive sizes
    experimentalLayout: 'responsive',
  },
  vite: {
    build: {
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'animation': ['gsap'],
          }
        }
      }
    }
  }
});
