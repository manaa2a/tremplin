import { Zap, Send, Search, ChevronRight } from 'lucide-react';
import { useAppState, useDispatch } from '../store';
import { USER_NAME } from '../data/mock';
import type { StatusKey } from '../types';

function firstName() {
  return USER_NAME.split(' ')[0];
}

export function Dashboard() {
  const { apps } = useAppState();
  const dispatch = useDispatch();

  const count = (k: StatusKey) => apps.filter((a) => a.status === k).length;
  const activeCount = apps.filter((a) => !['refuse', 'accepte'].includes(a.status)).length;

  const relanceToday = apps.filter((a) => a.status === 'a_relancer');
  const upcoming = apps.filter((a) => a.status === 'en_cours');

  const stats = [
    { value: activeCount, label: 'candidatures actives', accent: false },
    { value: count('en_cours'), label: 'entretien(s) à venir', accent: true },
    { value: count('a_relancer'), label: 'à relancer', accent: false },
    { value: apps.length, label: 'au total', accent: false },
  ];

  return (
    <div className="padb lift">
      <div style={{ padding: '20px 20px 0' }}>
        <h6 className="text-muted" style={{ margin: 0 }}>Jeudi 24 juillet</h6>
        <h1 style={{ fontSize: 30, margin: '6px 0 2px' }}>Salut {firstName()} 👋</h1>
        <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
          Tu tiens le rythme — 2 relances rapides et tu gardes la main.
        </p>
      </div>

      {/* 2×2 stat grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
        background: 'var(--color-divider)', margin: '20px 0 0',
        borderTop: '2px solid var(--color-divider)', borderBottom: '2px solid var(--color-divider)',
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: 'var(--color-bg)', padding: '16px 18px' }}>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 34, lineHeight: 1,
              color: s.accent ? 'var(--color-accent)' : undefined,
            }}>
              {s.value}
            </div>
            <div className="text-muted" style={{ fontSize: 12 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* À relancer aujourd'hui */}
      <div style={{ padding: '22px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Zap size={18} color="var(--color-accent)" />
          <h4 style={{ margin: 0 }}>À relancer aujourd'hui</h4>
        </div>

        {relanceToday.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {relanceToday.map((a) => (
              <div key={a.id} style={{ border: '2px solid var(--color-divider)', padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15, lineHeight: 1.15 }}>
                      {a.title}
                    </div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {a.company} · postulé le {a.appliedDate}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', whiteSpace: 'nowrap',
                    background: 'var(--color-accent-500)', color: '#fff',
                    fontFamily: 'var(--font-heading)', fontWeight: 800,
                  }}>
                    {a.waitDays > 0 ? `sans réponse · ${a.waitDays} j` : 'à relancer'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center', height: 40 }}
                    onClick={() => dispatch({ type: 'OPEN_RELANCE', id: a.id })}
                  >
                    <Send size={15} />
                    Relancer
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ justifyContent: 'center', height: 40, paddingInline: 16 }}
                    onClick={() => dispatch({ type: 'OPEN_DETAIL', id: a.id })}
                  >
                    Voir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: '2px dashed var(--color-divider)', padding: 20, textAlign: 'center' }}>
            <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>Rien à relancer. Tout est à jour 👌</p>
          </div>
        )}
      </div>

      {/* Prochains entretiens */}
      <div style={{ padding: '24px 20px 0' }}>
        <h4 style={{ margin: '0 0 12px' }}>Prochains entretiens</h4>
        {upcoming.map((a) => (
          <button
            key={a.id}
            onClick={() => dispatch({ type: 'OPEN_DETAIL', id: a.id })}
            style={{
              width: '100%', textAlign: 'left', background: 'var(--color-neutral-900)', color: '#fff',
              border: 0, cursor: 'pointer', padding: 16, display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10,
            }}
          >
            <div style={{ textAlign: 'center', flex: 'none' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 24, lineHeight: 1 }}>
                {a.interviewDay}
              </div>
              <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.7 }}>
                {a.interviewMonth}
              </div>
            </div>
            <div style={{ width: 2, alignSelf: 'stretch', background: 'rgba(255,255,255,.2)' }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15 }}>{a.title}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>{a.company} · {a.interviewTime}</div>
            </div>
            <ChevronRight size={18} style={{ marginLeft: 'auto', flex: 'none' }} />
          </button>
        ))}
      </div>

      {/* CTA search */}
      <div style={{ padding: '24px 20px 0' }}>
        <button
          className="btn btn-secondary btn-block"
          style={{ justifyContent: 'space-between', height: 52 }}
          onClick={() => dispatch({ type: 'SET_TAB', tab: 'search' })}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={18} />
            Chercher de nouvelles offres
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
