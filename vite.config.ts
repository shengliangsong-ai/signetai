import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import axios from 'axios';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'signet-api-proxy',
        configureServer(server) {
          // Frame Extractor API
          server.middlewares.use('/api/extract-drive-frames', async (req, res) => {
            // ... (existing frame extractor logic remains unchanged)
          });

          // Gemini Chat Proxy API
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });

            req.on('end', async () => {
              try {
                const { contents } = JSON.parse(body);
                if (!contents) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing "contents" in request body' }));
                  return;
                }

                const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'API Key not configured on server' }));
                  return;
                }

                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

                const geminiResponse = await axios.post(geminiUrl, {
                  contents: [{
                    role: 'user',
                    parts: [{ text: contents }]
                  }],
                  systemInstruction: {
                    role: 'system',
                    parts: [{ text: 'Signet-Alpha AI Support. Spec v0.4.0. Authority: signetai.io:ssl.' }]
                  }
                }, {
                  headers: { 'Content-Type': 'application/json' }
                });

                // The actual text is nested deeply. Let's extract and send just that.
                const responseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Neural link timeout.";
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ text: responseText }));

              } catch (error: any) {
                console.error("Chat Proxy Error:", error.response ? error.response.data : error.message);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Failed to communicate with Gemini API' }));
              }
            });
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
    server: {
      port: 3000,
      open: true
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
