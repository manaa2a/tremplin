import { useAppState, useDispatch } from '../store';
import { USER_NAME } from '../data/mock';
import { initials } from '../lib/status';

const METIERS = ['Préparateur de commandes', 'Cariste CACES 1/3/5', 'Agent de quai', 'Manutentionnaire'];

export function Profil() {
  const { distance } = useAppState();
  const dispatch = useDispatch();

  const prefs: [string, string, boolean][] = [
    ['Zone de recherche', `Orly · ${distance} km`, false],
    ['Type de contrat', 'CDI · Intérim', false],
    ['CACES', '1B · 3 · 5', false],
    ['Alertes offres', 'Activées', true],
  ];

  return (
    <div className="padb lift">
      <div style={{
        padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '2px solid var(--color-divider)',
      }}>
        <div style={{
          width: 56, height: 56, flex: 'none', background: 'var(--color-accent)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 24,
        }}>
          {initials(USER_NAME)}
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{USER_NAME}</h3>
          <p className="text-muted" style={{ margin: '2px 0 0', fontSize: 13 }}>Orly (94) · Logistique</p>
        </div>
      </div>

      <div style={{ padding: '22px 20px 0' }}>
        <h6 style={{ margin: '0 0 12px' }}>Métiers recherchés</h6>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
          {METIERS.map((m) => (
            <span key={m} className="tag tag-accent">{m}</span>
          ))}
          <span className="tag tag-outline">+ ajouter</span>
        </div>

        <h6 style={{ margin: '0 0 12px' }}>Préférences</h6>
        <div style={{ borderTop: '2px solid var(--color-divider)' }}>
          {prefs.map(([label, value, accent]) => (
            <div
              key={label}
              style={{
                display: 'flex', justifyContent: 'space-between', padding: '14px 0',
                borderBottom: '1px solid var(--color-divider)',
              }}
            >
              <span style={{ fontSize: 14 }}>{label}</span>
              <span style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14,
                color: accent ? 'var(--color-accent)' : undefined,
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-secondary btn-block"
          style={{ justifyContent: 'center', height: 46, marginTop: 22 }}
          onClick={() => dispatch({ type: 'LOGOUT' })}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
