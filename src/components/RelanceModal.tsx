import { Send } from 'lucide-react';
import { useAppState, useDispatch } from '../store';

export function RelanceModal() {
  const { showRelance, relanceId, relanceText, apps } = useAppState();
  const dispatch = useDispatch();
  if (!showRelance) return null;

  const app = apps.find((a) => a.id === relanceId);
  if (!app) return null;

  const subject = 'Relance candidature — ' + app.title;

  const send = () => {
    // Prod hook: could fire a real mailto here. For now the send is mocked —
    // it advances the status, logs the timeline entry, and toasts.
    // const mailto = `mailto:${app.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(relanceText)}`;
    dispatch({ type: 'SEND_RELANCE' });
  };

  return (
    <div className="sheet-backdrop" onClick={() => dispatch({ type: 'CLOSE_RELANCE' })}>
      <div className="sheet lift" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Send size={18} color="var(--color-accent)" />
          <h3 style={{ margin: 0 }}>Relance en 1 clic</h3>
        </div>
        <p className="text-muted" style={{ fontSize: 13, margin: '0 0 16px' }}>
          À {app.contactName} · {app.company}
        </p>

        <div className="field" style={{ marginBottom: 8 }}>
          <label>Objet</label>
          <input className="input" defaultValue={subject} />
        </div>
        <div className="field">
          <label>Message</label>
          <textarea
            className="input"
            style={{ minHeight: 170, lineHeight: 1.5 }}
            value={relanceText}
            onChange={(e) => dispatch({ type: 'SET_RELANCE_TEXT', text: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center', height: 46 }}
            onClick={() => dispatch({ type: 'CLOSE_RELANCE' })}
          >
            Annuler
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 2, justifyContent: 'center', height: 46 }}
            onClick={send}
          >
            <Send size={16} />
            Envoyer la relance
          </button>
        </div>
      </div>
    </div>
  );
}
