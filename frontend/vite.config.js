import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import strip from '@rollup/plugin-strip';

export default defineConfig({
  plugins: [
    react(),
    // Only apply in production
    process.env.NODE_ENV === 'production' &&
      strip({
        include: '**/*.(js|ts|jsx|tsx)',
        functions: ['console.log', 'console.debug', 'console.info']
      })
  ],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        // For debugging
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxy request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    outDir: 'dist'
  }
});
