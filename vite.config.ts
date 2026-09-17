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
        registerType: 'autoUpdate',
        includeAssets: ['icon-192.png', 'icon-512.png', 'icon-gold.svg'],
        manifest: {
          name: 'Genotype Scout — Privacy-First DNA Analysis',
          short_name: 'Genotype Scout',
          description: 'Privacy-first genomic analysis — ancestry, health, and haplogroups computed 100% in your browser. No uploads, no servers.',
          theme_color: '#09090b',
          background_color: '#09090b',
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
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          // Cache all built assets (JS, CSS, HTML, fonts, images, workers, and data chunks)
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
          // Allow large data chunks and worker bundles to be precached for offline support
          maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50 MB
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
      exclude: ['@xenova/transformers'],
      esbuildOptions: {
        target: 'es2022',
      },
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
      target: 'es2022',
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
            if (id.includes('node_modules/@xenova')) {
              return 'vendor-xenova';
            }
            if (id.includes('node_modules/recharts')) {
              return 'vendor-recharts';
            }
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://writteninthegenome.blog; connect-src 'self' ws: wss: https://generativelanguage.googleapis.com blob: data:; worker-src 'self' blob:; object-src 'none';",
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
      watch: {
        ignored: ['**/venv/**', '**/results_ner_genetics/**', '**/onnx_unquantized/**', '**/onnx_quantized/**']
      }
    },
    preview: {
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://writteninthegenome.blog; connect-src 'self' https://generativelanguage.googleapis.com blob: data:; worker-src 'self' blob:; object-src 'none';",
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
  };
});
