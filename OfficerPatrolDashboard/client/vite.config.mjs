import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is run from the workspace root via `vite client/`, so this config lives
// at the client root. We proxy /api/* to the Express server in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
