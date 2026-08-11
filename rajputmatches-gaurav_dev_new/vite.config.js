import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const safeDecodeUriPlugin = () => ({
  name: 'safe-decode-uri',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url) {
        try {
          decodeURIComponent(req.url);
        } catch (e) {
          req.url = req.url.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
        }
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url) {
        try {
          decodeURIComponent(req.url);
        } catch (e) {
          req.url = req.url.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
        }
      }
      next();
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), safeDecodeUriPlugin()],
    server: {
      host: true,
      port: 5173,
      hmr: {
        overlay: false,
      },
    },
    preview: {
      host: true,
      port: 5173,
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
      target: 'es2015',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'react-toastify'
      ],
      exclude: ['react-icons', 'lucide-react'],
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
        target: 'es2015',
      },
    },
    define: {
      'process.env': JSON.stringify(env),
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
      sourcemap: true,
      target: ['es2015', 'safari12'],
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('country-state-city')) {
                return 'vendor-location';
              }
              if (id.includes('framer-motion') || id.includes('lottie-web')) {
                return 'vendor-animation';
              }
              if (id.includes('emoji-picker-react')) {
                return 'vendor-emoji';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
              if (id.includes('react-icons')) {
                const match = id.match(/react-icons\/([a-z0-9]+)/);
                if (match && match[1]) {
                  return `vendor-icons-${match[1]}`;
                }
                return 'vendor-icons';
              }
              if (id.includes('@fortawesome') || id.includes('font-awesome')) {
                return 'vendor-fontawesome';
              }
              if (id.includes('bootstrap') || id.includes('react-toastify') || id.includes('react-select')) {
                return 'vendor-ui';
              }
              return 'vendor-core';
            }
          },
        },
      },
    },
  };
});
