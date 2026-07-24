import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { franceTravailProxy } from './vite-plugins/france-travail';

// Mobile-first job-search SPA. Plain Vite + React, no SSR needed.
// The France Travail proxy reads FRANCE_TRAVAIL_* from .env (server-side only,
// never exposed to the client bundle).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'FRANCE_TRAVAIL');
  return {
    plugins: [react(), franceTravailProxy(env)],
    server: { host: true, port: 5173 },
  };
});
