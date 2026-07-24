import type { Plugin } from 'vite';
import { readConfig, searchOffers } from '../src/server/franceTravail';

/**
 * Dev-server middleware exposing `GET /api/france-travail/search`.
 * Keeps the OAuth secret on the Node side. In production this same handler
 * would live in a serverless function; the browser contract is identical.
 */
export function franceTravailProxy(env: Record<string, string | undefined>): Plugin {
  const config = readConfig(env);

  return {
    name: 'france-travail-proxy',
    configureServer(server) {
      server.middlewares.use('/api/france-travail/search', async (req, res) => {
        try {
          const url = new URL(req.url ?? '', 'http://localhost');
          const params: Record<string, string> = {};
          for (const [k, v] of url.searchParams.entries()) params[k] = v;

          const result = await searchOffers(config, params);
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.json));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'middleware_exception', detail: String(err) }));
        }
      });

      const state = config ? 'configured' : 'NOT configured (mock fallback)';
      server.config.logger.info(`  ➜  France Travail proxy: ${state}`);
    },
  };
}
