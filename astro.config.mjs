// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Descomenta y ajusta esto para solucionar errores CORS en desarrollo
  /*
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://api.tu-backend.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  },
  */
});
