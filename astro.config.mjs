import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  server: {
    proxy: {
      // Cuando pidas /api en local, Astro buscará en el servidor real
      '/api': {
        target: 'https://laforesta.zona8.cl', 
        changeOrigin: true,
        secure: false,
      }
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
  outDir: 'public_html'
});