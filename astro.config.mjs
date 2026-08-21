import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    optimizeDeps: {
      include: [
        'react-map-gl/mapbox',
        '@vis.gl/react-mapbox',
        'mapbox-gl',
      ],
    },
    plugins: [tailwindcss()],
  },
});