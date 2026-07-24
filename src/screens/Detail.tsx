import { ChevronLeft, Phone, Mail, Zap, ExternalLink } from 'lucide-react';
import { useAppState, useDispatch } from '../store';
import { initials, meta } from '../lib/status';
import { StatusBadge } from '../components/StatusBadge';
import type { StatusKey } from '../types';

const STATUS_OPTIONS: StatusKey[] = ['a_postuler', 'postule', 'a_relancer', 'en_cours', 'accepte', 'refuse'];

export function Detail() {
  const { apps, detailId } = useAppState();
  const dispatch = useDispatch();
  const a = apps.find((x) => x.id === detailId);
  if (!a) return null;

  return (
    <div className="lift" style={{ paddingBottom: 24 }}>
      {/* Sticky header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        borderBottom: '2px solid var(--color-divider)', position: 'sticky', top: 0,
        background: 'var(--color-bg)', zIndex: 5,
      }}>
        <button className="btn btn-icon btn-secondary" onClick={() => dispatch({ type: 'BACK' })} aria-label="Retour">
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14 }}>{a.company}</span>
        <span style={{ marginLeft: 'auto' }}>
          <StatusBadge status={a.status} />
        </span>
      </div>

      <div style={{ padding: 20 }}>
        {/* Title */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 50, height: 50, flex: 'none', background: 'var(--color-neutral-900)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 22,
          }}>
            {a.logo}
          </div>
          <h1 style={{ fontSize: 26, margin: 0, lineHeight: 1.05 }}>{a.title}</h1>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          <span className="tag tag-neutral">{a.contract}</span>
          <span className="tag tag-neutral">{a.caces}</span>
          <span className="tag tag-outline">{a.city} · {a.distanceKm} km</span>
        </div>

        {/* Info grid 2×2 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'var(--color-divider)',
          border: '1px solid var(--color-divider)', marginBottom: 22,
        }}>
          {[
            ['Salaire', a.salary], ['Horaires', a.schedule],
            ['Source', a.source], ['Postulé le', a.appliedDate],
          ].map(([label, value]) => (
            <div key={label} style={{ background: 'var(--color-bg)', padding: '12px 14px' }}>
              <div className="text-muted" style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                {label}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <h6 style={{ margin: '0 0 10px' }}>Contact</h6>
        <div style={{ border: '2px solid var(--color-divider)', padding: 14, marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, flex: 'none', background: 'var(--color-accent-100)', color: 'var(--color-accent-800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 800,
            }}>
              {initials(a.contactName)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14 }}>{a.contactName}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{a.contactRole}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <a className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', height: 40 }} href={`tel:${a.contactPhone}`}>
              <Phone size={15} /> Appeler
            </a>
            <a className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', height: 40 }} href={`mailto:${a.contactEmail}`}>
              <Mail size={15} /> E-mail
            </a>
          </div>
        </div>

        {/* Status selector */}
        <h6 style={{ margin: '0 0 10px' }}>Statut de la candidature</h6>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {STATUS_OPTIONS.map((k) => {
            const m = meta(k);
            const on = a.status === k;
            const bg = m.bg === 'transparent' ? 'var(--color-accent)' : m.bg;
            const fg = m.bg === 'transparent' ? '#fff' : m.fg;
            return (
              <button
                key={k}
                onClick={() => dispatch({ type: 'SET_STATUS', id: a.id, status: k })}
                style={{
                  cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12,
                  padding: '8px 12px', border: '1px solid var(--color-divider)',
                  background: on ? bg : 'var(--color-bg)',
                  color: on ? fg : 'var(--color-text)',
                  borderColor: on ? 'transparent' : 'var(--color-divider)',
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Relance CTA */}
        <button
          className="btn btn-primary btn-block"
          style={{ justifyContent: 'center', height: 50, fontSize: 15 }}
          onClick={() => dispatch({ type: 'OPEN_RELANCE', id: a.id })}
        >
          <Zap size={17} /> Relancer en 1 clic
        </button>

        {a.url && (
          <a
            className="btn btn-secondary btn-block"
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ justifyContent: 'center', height: 46, marginTop: 10 }}
          >
            <ExternalLink size={16} /> Voir l'offre en ligne
          </a>
        )}

        {/* Timeline */}
        <h6 style={{ margin: '26px 0 12px' }}>Historique</h6>
        <div style={{ position: 'relative', paddingLeft: 20 }}>
          <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 2, background: 'var(--color-divider)' }} />
          {a.timeline.map((t, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 16 }}>
              <div style={{ position: 'absolute', left: -20, top: 3, width: 10, height: 10, background: 'var(--color-accent)' }} />
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13 }}>{t.label}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>{t.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
