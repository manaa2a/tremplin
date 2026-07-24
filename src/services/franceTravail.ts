import type { Offer } from '../types';
import { HOME, HOME_COMMUNE, MOCK_OFFERS } from '../data/mock';
import { distanceKm } from '../lib/geo';

/** Raw shape of a France Travail "Offres d'emploi v2" result (subset used here). */
interface FTResult {
  id: string;
  intitule?: string;
  description?: string;
  entreprise?: { nom?: string };
  lieuTravail?: { libelle?: string; latitude?: number; longitude?: number; commune?: string };
  typeContrat?: string;
  typeContratLibelle?: string;
  salaire?: { libelle?: string };
  dureeTravailLibelle?: string;
  origineOffre?: { origine?: string; urlOrigine?: string };
  contact?: { nom?: string; courriel?: string; telephone?: string; coordonnees1?: string };
}

export interface OffersResult {
  offers: Offer[];
  source: 'live' | 'mock';
  note?: string;
}

export interface SearchParams {
  /** One term per métier — France Travail's `motsCles` is an AND, so a single
   *  multi-métier string returns nothing. We query each term separately and merge. */
  terms: string[];
  /** Max radius to request from the API, in km (the slider filters finer, client-side). */
  maxDistanceKm: number;
}

interface OneResult {
  status: number;
  results: FTResult[];
}

async function fetchOne(term: string, maxDistanceKm: number): Promise<OneResult> {
  const qs = new URLSearchParams({
    motsCles: term,
    commune: HOME_COMMUNE,
    distance: String(maxDistanceKm),
    range: '0-24',
  });
  const res = await fetch(`/api/france-travail/search?${qs.toString()}`);
  if (!res.ok) return { status: res.status, results: [] };
  const data = (await res.json().catch(() => ({}))) as { resultats?: FTResult[] };
  return { status: res.status, results: data.resultats ?? [] };
}

/**
 * Fetch offers via the server proxy — one request per métier term, merged and
 * de-duplicated by id. Falls back to the bundled mock offers when the proxy is
 * not configured (no credentials) or unreachable, so the app always works.
 */
export async function fetchOffers({ terms, maxDistanceKm }: SearchParams): Promise<OffersResult> {
  const list = terms.map((t) => t.trim()).filter(Boolean);
  if (list.length === 0) return { offers: [], source: 'live' };

  try {
    const settled = await Promise.all(list.map((t) => fetchOne(t, maxDistanceKm)));

    // Any 501 → proxy not configured → demo mode.
    if (settled.some((s) => s.status === 501)) {
      return { offers: MOCK_OFFERS, source: 'mock', note: 'Identifiants France Travail absents — données de démo.' };
    }

    const seen = new Set<string>();
    const offers: Offer[] = [];
    for (const s of settled) {
      for (const r of s.results) {
        if (r.id && !seen.has(r.id)) {
          seen.add(r.id);
          offers.push(mapResult(r));
        }
      }
    }
    return { offers, source: 'live' };
  } catch {
    return { offers: MOCK_OFFERS, source: 'mock', note: 'Réseau indisponible — données de démo.' };
  }
}

/** Map a France Travail result to the app's Offer model. */
function mapResult(r: FTResult): Offer {
  const lat = r.lieuTravail?.latitude ?? HOME.lat;
  const lng = r.lieuTravail?.longitude ?? HOME.lng;
  const km = Math.round(distanceKm(HOME, { lat, lng }) * 10) / 10;

  return {
    id: r.id,
    title: r.intitule ?? 'Offre',
    company: r.entreprise?.nom || r.origineOffre?.origine || 'Entreprise',
    city: cleanCity(r.lieuTravail?.libelle),
    distanceKm: km,
    contract: r.typeContratLibelle || r.typeContrat || 'Contrat',
    salary: cleanSalary(r.salaire?.libelle),
    schedule: r.dureeTravailLibelle || '—',
    caces: detectCaces(`${r.intitule ?? ''} ${r.description ?? ''}`),
    source: 'France Travail',
    lat,
    lng,
    contactName: r.contact?.nom || 'Recrutement',
    contactRole: 'France Travail',
    contactPhone: r.contact?.telephone || r.contact?.coordonnees1 || '',
    contactEmail: r.contact?.courriel || '',
  };
}

/** France Travail salary labels are verbose ("Annuel de 22405.0 Euros à 27405.0
 *  Euros sur 12.0 mois") — compact them for the card. */
function cleanSalary(libelle?: string): string {
  if (!libelle) return '—';
  const s = libelle
    .replace(/(\d)\.0\b/g, '$1')              // 22405.0 → 22405
    .replace(/\bEuros?\b/gi, '€')
    .replace(/\bde\s+/gi, '')                  // "Annuel de 2000" → "Annuel 2000"
    .replace(/\s*à\s*/gi, '–')                 // range → dash
    .replace(/\s*sur\s+\d+\s*mois/gi, '')      // drop "sur 12 mois"
    .replace(/^\s*Salaire\s*/i, '')            // drop leading "Salaire"
    .replace(/\s*€/g, ' €')
    .replace(/\s+/g, ' ')
    .trim();
  return s || '—';
}

/** "94 - ORLY" → "Orly". */
function cleanCity(libelle?: string): string {
  if (!libelle) return '—';
  const stripped = libelle.replace(/^\d+\s*-\s*/, '').trim();
  return stripped.charAt(0).toUpperCase() + stripped.slice(1).toLowerCase();
}

/** Best-effort CACES detection from free text. */
function detectCaces(text: string): string {
  const m = text.match(/caces\s*([0-9][a-z]?(?:\s*[\/,-]\s*[0-9][a-z]?)*)/i);
  if (m) return `CACES ${m[1].toUpperCase().replace(/\s+/g, '')}`;
  return 'Selon offre';
}
