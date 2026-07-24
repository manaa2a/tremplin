import { Zap, ArrowRight } from 'lucide-react';
import { useDispatch } from '../store';

/** Welcome screen — the app is dedicated to a single user, so there's no sign-in
 *  form: one tap to enter. */
export function Login() {
  const dispatch = useDispatch();
  const enter = () => dispatch({ type: 'LOGIN' });

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
        <h1 style={{ fontSize: 38, lineHeight: 1.02, margin: '0 0 14px' }}>
          Chaque candidature te rapproche du poste.
        </h1>
        <p className="text-muted" style={{ fontSize: 15, margin: 0, maxWidth: 330 }}>
          Suis tes candidatures logistique autour d'Orly, relance en un clic et ne rate plus jamais
          un retour — toutes les offres à proximité, au même endroit.
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
