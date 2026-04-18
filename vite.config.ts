import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: [
        '1f3f153f9206.ngrok-free.app',  // Your ngrok host
        'localhost',                    // Local development
        '127.0.0.1',                    // Local IP
      ],
      // Optional: For better ngrok compatibility
      cors: true,
      hmr: {
        clientPort: 443, // Important for ngrok
      }
    },
    plugins: [react()],
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[hash].js',
          entryFileNames: 'assets/js/[hash].js',
          assetFileNames: 'assets/[hash].[ext]',
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom']
    }
  };
});