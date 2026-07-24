import { useEffect, useRef, useState } from 'react';
import { Search, Map as MapIcon, List as ListIcon, MapPin, Bookmark, Loader2, X, ExternalLink } from 'lucide-react';
import { useAppState, useDispatch } from '../store';
import { MapView } from '../components/MapView';
import { fetchOffers } from '../services/franceTravail';

/** Searched when the box is empty (Radouane's profile: cariste / CACES first). */
const DEFAULT_TERMS = ['Cariste', 'Préparateur de commandes', 'Agent de quai'];
/** Tappable quick-search chips — but the box accepts ANY métier or entreprise. */
const SUGGESTIONS = [
  'Cariste', 'Préparateur de commandes', 'Agent de quai',
  'Manutentionnaire', 'Magasinier', 'Chauffeur-livreur', 'Agent logistique',
];
/** Widest radius we ask the API for; the slider then filters finer, client-side. */
const MAX_RADIUS_KM = 50;

export function Offres() {
  const { offers, distance, view, selectedOfferId, savedIds, offersStatus, offersSource, offersNote } = useAppState();
  const dispatch = useDispatch();

  // Free-text box; empty → search the default métiers. Comma-separated → several terms.
  const [query, setQuery] = useState('');
  const firstLoad = useRef(true);

  // Fetch live offers on mount, then on debounced keyword changes.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const typed = query.split(',').map((s) => s.trim()).filter(Boolean);
      const terms = typed.length ? typed : DEFAULT_TERMS;
      dispatch({ type: 'OFFERS_LOADING' });
      const result = await fetchOffers({ terms, maxDistanceKm: MAX_RADIUS_KM });
      if (!cancelled) {
        dispatch({ type: 'OFFERS_LOADED', offers: result.offers, source: result.source, note: result.note });
      }
    };
    // Immediate on first mount; debounced afterwards.
    if (firstLoad.current) {
      firstLoad.current = false;
      run();
      return () => { cancelled = true; };
    }
    const t = setTimeout(run, 500);
    return () => { cancelled = true; clearTimeout(t); };
  }, [query, dispatch]);

  const inRange = (km: number) => km <= distance;
  const inRangeCount = offers.filter((o) => inRange(o.distanceKm)).length;
  const listOffers = [...offers].sort((a, b) => a.distanceKm - b.distanceKm);
  const selected = offers.find((o) => o.id === selectedOfferId) || null;
  const isSaved = (id: string) => savedIds.includes(id);

  return (
    <div className="padb lift">
      {/* Header + search */}
      <div style={{ padding: '20px 20px 14px' }}>
        <h1 style={{ fontSize: 30, margin: '0 0 12px' }}>Offres</h1>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-surface)',
          border: '1px solid var(--color-divider)', padding: '8px 12px',
        }}>
          <Search size={18} color="var(--color-neutral-600)" />
          <input
            placeholder="Cherche un métier, une entreprise…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, border: 0, background: 'none', font: 'inherit', fontSize: 14, outline: 'none' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Effacer"
              style={{ border: 0, background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
            >
              <X size={16} color="var(--color-neutral-600)" />
            </button>
          )}
        </div>
        {/* Quick suggestions — tap to search, or type anything above */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {SUGGESTIONS.map((m) => {
            const active = query.trim().toLowerCase() === m.toLowerCase();
            return (
              <button
                key={m}
                onClick={() => setQuery(active ? '' : m)}
                className={active ? 'tag tag-accent' : 'tag tag-outline'}
                style={{ cursor: 'pointer', background: active ? undefined : 'none' }}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius slider */}
      <div style={{ padding: '0 20px 14px' }} className="rangewrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Rayon depuis Orly</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-accent)' }}>
            {distance} km
          </span>
        </div>
        <input
          type="range" min={1} max={50} step={1} value={distance}
          onChange={(e) => dispatch({ type: 'SET_DISTANCE', km: Number(e.target.value) })}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--color-neutral-500)' }}>
          <span>1 km</span><span>50 km</span>
        </div>
      </div>

      {/* Count + segmented control */}
      <div style={{
        padding: '0 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '2px solid var(--color-divider)',
      }}>
        <span className="text-muted" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          {offersStatus === 'loading' ? (
            <>
              <Loader2 size={13} className="spin" /> Recherche…
            </>
          ) : (
            <>
              {inRangeCount} offre(s) dans le rayon
              <span
                title={offersNote || undefined}
                style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 9,
                  letterSpacing: '.06em', textTransform: 'uppercase', padding: '2px 6px',
                  color: offersSource === 'live' ? '#fff' : 'var(--color-neutral-700)',
                  background: offersSource === 'live' ? 'var(--color-accent)' : 'var(--color-neutral-200)',
                }}
              >
                {offersSource === 'live' ? 'France Travail' : 'Démo'}
              </span>
            </>
          )}
        </span>
        <div className="seg">
          {(['map', 'list'] as const).map((v) => {
            const on = view === v;
            return (
              <button
                key={v}
                onClick={() => dispatch({ type: 'SET_VIEW', view: v })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: 0, cursor: 'pointer',
                  fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13,
                  borderLeft: v === 'list' ? '1px solid var(--color-divider)' : undefined,
                  background: on ? 'var(--color-accent)' : 'transparent',
                  color: on ? '#fff' : 'var(--color-text)',
                }}
              >
                {v === 'map' ? <MapIcon size={14} /> : <ListIcon size={14} />}
                {v === 'map' ? 'Carte' : 'Liste'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && (
        <>
          <MapView
            offers={offers}
            distanceKm={distance}
            onSelect={(id) => dispatch({ type: 'SELECT_OFFER', id })}
          />
          {selected && (
            <div style={{ padding: '14px 20px', borderBottom: '2px solid var(--color-divider)', background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15 }}>{selected.title}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {selected.company} · {selected.city} · {selected.distanceKm} km
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14, flex: 'none', maxWidth: '42%', textAlign: 'right' }}>
                  {selected.salary}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {selected.url && (
                  <a
                    className="btn btn-secondary"
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, justifyContent: 'center', height: 40 }}
                  >
                    <ExternalLink size={14} />
                    Voir l'offre
                  </a>
                )}
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', height: 40 }}
                  onClick={() => dispatch({ type: 'SAVE_OFFER', id: selected.id })}
                >
                  <Bookmark size={14} />
                  {isSaved(selected.id) ? 'Enregistré ✓' : 'Enregistrer'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* List view */}
      {view === 'list' && (
        <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {offersStatus === 'ready' && listOffers.length === 0 && (
            <div style={{ border: '2px dashed var(--color-divider)', padding: 20, textAlign: 'center' }}>
              <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>
                Aucune offre pour cette recherche. Essaie d'autres mots-clés 💪
              </p>
            </div>
          )}
          {listOffers.map((o) => (
            <div
              key={o.id}
              style={{ border: '2px solid var(--color-divider)', padding: 14, opacity: inRange(o.distanceKm) ? 1 : 0.45 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, lineHeight: 1.15 }}>
                    {o.title}
                  </div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{o.company}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14, flex: 'none', maxWidth: '42%', textAlign: 'right' }}>
                  {o.salary}
                </span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 11.5,
                color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} /> {o.city} · {o.distanceKm} km
                </span>
                <span className="tag tag-neutral" style={{ marginLeft: 'auto' }}>{o.contract}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {o.url && (
                  <a
                    className="btn btn-secondary"
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, justifyContent: 'center', height: 38 }}
                  >
                    <ExternalLink size={14} />
                    Voir l'offre
                  </a>
                )}
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', height: 38 }}
                  onClick={() => dispatch({ type: 'SAVE_OFFER', id: o.id })}
                >
                  <Bookmark size={14} />
                  {isSaved(o.id) ? 'Enregistré ✓' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
