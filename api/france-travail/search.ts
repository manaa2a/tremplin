/**
 * Vercel serverless function — France Travail "Offres d'emploi v2" proxy.
 *
 * Self-contained on purpose: Vercel traces only what a function imports, and
 * cross-directory `.ts` imports have bitten us, so the OAuth + search logic is
 * inlined here rather than imported from src/. The Vite dev plugin still uses
 * src/server/franceTravail.ts; keep the two in sync if the API contract changes.
 *
 * Credentials come from Vercel env vars (FRANCE_TRAVAIL_CLIENT_ID/SECRET),
 * never exposed to the client. Typed structurally to avoid a hard @vercel/node dep.
 */

const TOKEN_URL =
  'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire';
const SEARCH_URL =
  'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search';
const SCOPE = 'api_offresdemploiv2 o2dsoffre';

interface Req {
  query?: Record<string, string | string[] | undefined>;
}
interface Res {
  status: (code: number) => Res;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
}

// Token cache (per warm function instance).
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(clientId: string, clientSecret: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) return cachedToken.value;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: SCOPE,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OAuth token failed (${res.status}): ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return cachedToken.value;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  try {
    const query = req.query ?? {};
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(query)) {
      if (typeof v === 'string') params[k] = v;
      else if (Array.isArray(v) && v[0]) params[k] = String(v[0]);
    }

    // Trim to defend against a stray space / newline pasted into the env var.
    const clientId = process.env.FRANCE_TRAVAIL_CLIENT_ID?.trim();
    const clientSecret = process.env.FRANCE_TRAVAIL_CLIENT_SECRET?.trim();

    res.setHeader('Content-Type', 'application/json');

    // Not configured → tell the client to fall back to demo data.
    if (!clientId || !clientSecret) {
      res.status(501).json({ error: 'not_configured' });
      return;
    }

    const token = await getToken(clientId, clientSecret);
    const qs = new URLSearchParams(params).toString();
    const upstream = await fetch(`${SEARCH_URL}?${qs}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });

    if (upstream.status === 204) {
      res.status(200).json({ resultats: [] });
      return;
    }
    if (!upstream.ok) {
      const detail = await upstream.text();
      res.status(502).json({ error: 'upstream_error', status: upstream.status, detail: detail.slice(0, 300) });
      return;
    }

    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
    res.status(200).json(data);
  } catch (err) {
    // Never crash the invocation — surface the reason as JSON.
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'handler_error', detail: String(err instanceof Error ? err.stack : err) });
  }
}
