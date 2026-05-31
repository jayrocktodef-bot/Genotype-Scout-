import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    worker: {
      format: 'es',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
    build: {
      // Pull the large, standalone, lazily-used assets out of the main entry
      // chunk so the app shell loads fast. Kept conservative: only split leaf
      // modules (genomic data JSON + ONNX runtime) to avoid React init/order bugs.
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.endsWith('.json') && id.includes('/src/data/')) {
              return 'genomic-data';
            }
            if (id.includes('node_modules/onnxruntime-web')) {
              return 'vendor-onnx';
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
