import { Zap, ArrowRight } from 'lucide-react';
import { useDispatch } from '../store';
import { USER_NAME } from '../data/mock';

/** Welcome screen — the app is dedicated to a single user (Radouane), so there's
 *  no sign-in form: one tap to enter. */
export function Login() {
  const dispatch = useDispatch();
  const enter = () => dispatch({ type: 'LOGIN' });
  const firstName = USER_NAME.split(' ')[0];

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: '36px 28px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, background: 'var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}>
          <Zap size={20} fill="none" />
        </div>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, letterSpacing: '-.02em' }}>
          TREMPLIN
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '24px 0' }}>
        <h6 style={{ color: 'var(--color-accent)', margin: '0 0 12px' }}>Ta recherche, sous contrôle</h6>
        <h1 style={{ fontSize: 40, lineHeight: 1.0, margin: '0 0 16px' }}>
          Salut {firstName} 👋
        </h1>
        <p className="text-muted" style={{ fontSize: 15, margin: 0, maxWidth: 320 }}>
          Tes candidatures logistique autour d'Orly, tes relances en un clic, et toutes les
          offres à proximité — au même endroit.
        </p>
      </div>

      <button
        className="btn btn-primary btn-block"
        style={{ justifyContent: 'center', gap: 8, height: 52, fontSize: 16 }}
        onClick={enter}
      >
        Entrer
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
