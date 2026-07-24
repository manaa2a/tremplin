import { Zap } from 'lucide-react';
import { useDispatch } from '../store';

export function Login() {
  const dispatch = useDispatch();
  const login = () => dispatch({ type: 'LOGIN' });

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: '36px 28px 28px' }}>
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
        <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
          Suis tes offres logistique autour d'Orly, relance en un clic, et ne rate plus jamais un retour.
        </p>
      </div>

      <form
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        onSubmit={(e) => { e.preventDefault(); login(); }}
      >
        <div className="field">
          <label>E-mail</label>
          <input className="input" type="email" placeholder="radouane@mail.com" defaultValue="radouane.bensaid@gmail.com" />
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input className="input" type="password" placeholder="••••••••" defaultValue="tremplin" />
        </div>
        <button className="btn btn-primary btn-block" type="submit" style={{ justifyContent: 'center', marginTop: 6, height: 46 }}>
          Se connecter
        </button>
        <button className="btn btn-secondary" type="button" style={{ justifyContent: 'center', height: 44 }} onClick={login}>
          Continuer avec France Travail
        </button>
        <p className="text-muted" style={{ textAlign: 'center', fontSize: 12, margin: '4px 0 0' }}>
          Pas encore de compte ?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); login(); }} style={{ fontWeight: 800 }}>
            Créer un compte
          </a>
        </p>
      </form>
    </div>
  );
}
