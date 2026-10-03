import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const backend = process.env.WM_BACKEND_URL ?? 'http://127.0.0.1:8080';
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: Number(process.env.WM_FRONTEND_PORT ?? 5173),
    strictPort: true,
    fs: {
      strict: true,
      allow: [
        fileURLToPath(new URL('./', import.meta.url)),
        fileURLToPath(new URL('../node_modules/', import.meta.url)),
      ],
      deny: [
        '**/.env',
        '**/.env.*',
        '**/.runtime/**',
        '**/.tools/**',
        '**/.git/**',
        '**/.aws/**',
        '**/config/**',
        '**/*.{crt,pem}',
      ],
    },
    proxy: { '/api': backend },
  },
  preview: { host: '127.0.0.1', strictPort: true, proxy: { '/api': backend } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    environmentOptions: { jsdom: { url: 'http://127.0.0.1:5173/' } },
  },
});
