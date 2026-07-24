import { ExternalLink, MapPin } from 'lucide-react';
import { AGENCIES, agencyMapsUrl } from '../data/agencies';

export function Agences() {
  return (
    <div className="padb lift">
      <div style={{ padding: '20px 20px 14px', borderBottom: '2px solid var(--color-divider)' }}>
        <h1 style={{ fontSize: 30, margin: 0 }}>Agences d'intérim</h1>
        <p className="text-muted" style={{ fontSize: 13, margin: '4px 0 0' }}>
          {AGENCIES.length} réseaux qui recrutent en logistique autour d'Orly. Contacte l'agence la plus proche.
        </p>
      </div>

      <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {AGENCIES.map((a) => (
          <div key={a.name} style={{ border: '2px solid var(--color-divider)', padding: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 42, height: 42, flex: 'none', background: 'var(--color-neutral-900)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16,
              }}>
                {a.logo}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16 }}>{a.name}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>Intérim · Logistique</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <a
                className="btn btn-secondary"
                href={a.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, justifyContent: 'center', height: 40 }}
              >
                <ExternalLink size={14} /> Site web
              </a>
              <a
                className="btn btn-primary"
                href={agencyMapsUrl(a.name)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, justifyContent: 'center', height: 40 }}
              >
                <MapPin size={14} /> Agences près d'Orly
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
