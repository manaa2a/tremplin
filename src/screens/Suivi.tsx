import { MapPin } from 'lucide-react';
import { useAppState, useDispatch } from '../store';
import { STATUS_ORDER } from '../lib/status';
import { StatusBadge } from '../components/StatusBadge';
import type { FilterKey, StatusKey } from '../types';

export function Suivi() {
  const { apps, statusFilter } = useAppState();
  const dispatch = useDispatch();

  const count = (k: StatusKey) => apps.filter((a) => a.status === k).length;

  const chips: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'Tout', count: apps.length },
    { key: 'a_relancer', label: 'À relancer', count: count('a_relancer') },
    { key: 'en_cours', label: 'En cours', count: count('en_cours') },
    { key: 'postule', label: 'Postulé', count: count('postule') },
    { key: 'a_postuler', label: 'À postuler', count: count('a_postuler') },
    { key: 'refuse', label: 'Refusé', count: count('refuse') },
  ];

  const sorted = [...apps].sort((x, y) => STATUS_ORDER[x.status] - STATUS_ORDER[y.status]);
  const visible = statusFilter === 'all' ? sorted : sorted.filter((a) => a.status === statusFilter);

  return (
    <div className="padb lift">
      <div style={{ padding: '20px 20px 14px' }}>
        <h1 style={{ fontSize: 30, margin: 0 }}>Mon suivi</h1>
        <p className="text-muted" style={{ fontSize: 13, margin: '4px 0 0' }}>
          {apps.length} candidatures suivies
        </p>
      </div>

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px 14px',
        borderBottom: '2px solid var(--color-divider)',
      }}>
        {chips.map((c) => {
          const on = statusFilter === c.key;
          return (
            <button
              key={c.key}
              onClick={() => dispatch({ type: 'SET_FILTER', key: c.key })}
              style={{
                flex: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 800,
                fontSize: 12, padding: '7px 12px', whiteSpace: 'nowrap',
                border: '1px solid var(--color-divider)',
                background: on ? 'var(--color-neutral-900)' : 'var(--color-bg)',
                color: on ? '#fff' : 'var(--color-text)',
                borderColor: on ? 'var(--color-neutral-900)' : 'var(--color-divider)',
              }}
            >
              {c.label} {c.count}
            </button>
          );
        })}
      </div>

      {/* Application cards */}
      <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visible.map((a) => (
          <button
            key={a.id}
            onClick={() => dispatch({ type: 'OPEN_DETAIL', id: a.id })}
            style={{
              width: '100%', textAlign: 'left', background: 'var(--color-surface)', border: 0,
              borderLeft: '3px solid var(--color-accent)', cursor: 'pointer',
              padding: '14px 14px 14px 15px', display: 'flex', flexDirection: 'column', gap: 10,
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 38, height: 38, flex: 'none', background: 'var(--color-neutral-900)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16,
              }}>
                {a.logo}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, lineHeight: 1.15 }}>
                  {a.title}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>{a.company}</div>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5,
              color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} /> {a.city} · {a.distanceKm} km
              </span>
              <span>{a.salary}</span>
              <span style={{ marginLeft: 'auto' }}>{a.contract}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
