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
  keywords: string;
  /** Max radius to request from the API, in km (the slider filters finer, client-side). */
  maxDistanceKm: number;
}

/**
 * Fetch offers via the server proxy. Falls back to the bundled mock offers when
 * the proxy is not configured (no credentials) or unreachable — so the app keeps
 * working offline and the design is always demonstrable.
 */
export async function fetchOffers({ keywords, maxDistanceKm }: SearchParams): Promise<OffersResult> {
  const qs = new URLSearchParams({
    motsCles: keywords,
    commune: HOME_COMMUNE,
    distance: String(maxDistanceKm),
    range: '0-49',
  });

  try {
    const res = await fetch(`/api/france-travail/search?${qs.toString()}`);

    if (res.status === 501) {
      return { offers: MOCK_OFFERS, source: 'mock', note: 'Identifiants France Travail absents — données de démo.' };
    }
    if (!res.ok) {
      return { offers: MOCK_OFFERS, source: 'mock', note: `API indisponible (${res.status}) — données de démo.` };
    }

    const data = (await res.json()) as { resultats?: FTResult[] };
    const offers = (data.resultats ?? []).map(mapResult);
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
    salary: r.salaire?.libelle || '—',
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
