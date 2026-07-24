import { readConfig, searchOffers } from '../../src/server/franceTravail';

/**
 * Vercel serverless function — production counterpart of the Vite dev proxy.
 * Same browser contract (`GET /api/france-travail/search`), same core logic.
 * Credentials come from Vercel project env vars (FRANCE_TRAVAIL_CLIENT_ID/SECRET),
 * never exposed to the client.
 *
 * Typed structurally to avoid a hard dependency on @vercel/node.
 */
interface Req {
  query: Record<string, string | string[] | undefined>;
}
interface Res {
  status: (code: number) => Res;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  const params: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.query)) {
    if (typeof v === 'string') params[k] = v;
    else if (Array.isArray(v) && v[0]) params[k] = v[0];
  }

  const config = readConfig(process.env);
  const result = await searchOffers(config, params);

  res.setHeader('Content-Type', 'application/json');
  // Cache live results briefly at the edge to spare the API quota.
  if (result.status === 200) {
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
  }
  res.status(result.status).json(result.json);
}
