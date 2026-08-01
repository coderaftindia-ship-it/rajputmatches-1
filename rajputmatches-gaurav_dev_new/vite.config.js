import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    define: {
      'process.env': JSON.stringify(env),
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
      sourcemap: true,
      target: ['es2020', 'safari14'],
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
              if (id.includes('react-icons') || id.includes('@fortawesome') || id.includes('font-awesome')) {
                return 'vendor-icons';
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
