import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isCapacitor = process.env.CAPACITOR === 'true';
  return {
    base: isCapacitor ? '' : '/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['icon-192.png', 'icon-512.png'],
        manifest: {
          name: 'Genotype Scout — Privacy-First DNA Analysis',
          short_name: 'Genotype Scout',
          description: 'Privacy-first genomic analysis — ancestry, health, and haplogroups computed 100% in your browser. No uploads, no servers.',
          theme_color: '#0d9488',
          background_color: '#f8fafc',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          categories: ['health', 'education', 'science'],
          icons: [
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          // Cache all built assets (JS, CSS, HTML, fonts, images)
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
          // Exclude oversized chunks from precache — they load on-demand
          globIgnores: ['**/genomic-data-*.js', '**/genotypeWorker-*.js', '**/markerProcessingWorker-*.js', '**/analysisWorker-*.js'],
          // Allow remaining large chunks (vendor-onnx ~400KB etc.)
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
          // Runtime caching for external resources (Google Fonts, blog images)
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/writteninthegenome\.blog\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'blog-assets-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
    worker: {
      format: 'es',
    },
    optimizeDeps: {
      entries: ['index.html'],
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
      chunkSizeWarningLimit: 6000,
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
