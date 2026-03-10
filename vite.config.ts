
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // !! IMPORTANT !!
  // Replace this with your actual Firebase Project ID.
  // You can find it in your Firebase project console's settings.
  const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID || 'signet-hackathon';

  return {
    plugins: [
      react(),
      {
        name: 'signet-api-proxy',
        configureServer(server) {
          // This middleware is for the Frame Extractor API and remains unchanged.
          server.middlewares.use('/api/extract-drive-frames', async (req, res) => {
            // ... existing frame extractor logic ...
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.VITE_GEMINI_LIVE_API_KEY': JSON.stringify(env.VITE_GEMINI_LIVE_API_KEY || ''),
      'process.env.YOUTUBE_API_KEY': JSON.stringify(env.YOUTUBE_API_KEY || ''),
      'process.env.EXTRACTOR_TIMEOUT_MS': JSON.stringify(env.EXTRACTOR_TIMEOUT_MS || '5000'),
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY || ''),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.FIREBASE_AUTH_DOMAIN || ''),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID || ''),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.FIREBASE_STORAGE_BUCKET || ''),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.FIREBASE_MESSAGING_SENDER_ID || ''),
      'process.env.FIREBASE_APP_ID': JSON.stringify(env.FIREBASE_APP_ID || ''),
      'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(env.FIREBASE_MEASUREMENT_ID || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Proxy API requests to the Firebase emulator
        // to avoid CORS issues and mimic hosting rewrites.
        '/api': {
          target: `http://127.0.0.1:5001/${FIREBASE_PROJECT_ID}/us-central1/api`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          bridge: path.resolve(__dirname, 'bridge.html')
        }
      }
    }
  };
});
