/**
 * Server-side France Travail proxy core.
 *
 * Why server-side: the France Travail "Offres d'emploi v2" API needs an OAuth2
 * client-credentials token (client_id + secret) and does NOT send CORS headers,
 * so it cannot be called from the browser. This module holds the secret, caches
 * the token, and performs the search. It's framework-agnostic: the Vite dev
 * plugin wires it as middleware today, and the same `searchOffers` can back a
 * serverless function in production.
 *
 * Credentials come from the environment — never hard-coded, never sent to the client.
 */

const TOKEN_URL =
  'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire';
const SEARCH_URL =
  'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search';
const SCOPE = 'api_offresdemploiv2 o2dsoffre';

export interface FTConfig {
  clientId: string;
  clientSecret: string;
}

export interface ProxyResult {
  status: number;
  json: unknown;
}

/** Read credentials from the environment. Returns null if not configured. */
export function readConfig(env: Record<string, string | undefined>): FTConfig | null {
  const clientId = env.FRANCE_TRAVAIL_CLIENT_ID;
  const clientSecret = env.FRANCE_TRAVAIL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

// In-memory token cache (per server process).
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(config: FTConfig): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: SCOPE,
  });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OAuth token failed (${res.status}): ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return cachedToken.value;
}

/**
 * Run an offer search against France Travail.
 * `params` is passed straight through as query string (motsCles, commune,
 * distance, range, typeContrat, …). Returns the raw upstream JSON.
 */
export async function searchOffers(
  config: FTConfig | null,
  params: Record<string, string>,
): Promise<ProxyResult> {
  if (!config) {
    return { status: 501, json: { error: 'not_configured' } };
  }
  try {
    const token = await getToken(config);
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${SEARCH_URL}?${qs}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    // 204 = no results; 200/206 = results (206 is partial/paginated).
    if (res.status === 204) {
      return { status: 200, json: { resultats: [] } };
    }
    if (!res.ok) {
      const detail = await res.text();
      return { status: 502, json: { error: 'upstream_error', status: res.status, detail: detail.slice(0, 300) } };
    }
    const data = await res.json();
    return { status: 200, json: data };
  } catch (err) {
    return { status: 502, json: { error: 'proxy_exception', detail: String(err) } };
  }
}
