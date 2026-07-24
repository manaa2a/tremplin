import { Home, ClipboardList, MapPin, User } from 'lucide-react';
import type { Tab } from '../store';
import { useAppState, useDispatch } from '../store';

const TABS: { key: Tab; label: string; Icon: typeof Home }[] = [
  { key: 'dashboard', label: 'Accueil', Icon: Home },
  { key: 'apps', label: 'Suivi', Icon: ClipboardList },
  { key: 'search', label: 'Offres', Icon: MapPin },
  { key: 'profile', label: 'Profil', Icon: User },
];

export function TabBar() {
  const { tab, detailId } = useAppState();
  const dispatch = useDispatch();

  return (
    <div className="nav">
      {TABS.map(({ key, label, Icon }) => {
        const active = tab === key && !detailId;
        return (
          <button
            key={key}
            onClick={() => dispatch({ type: 'SET_TAB', tab: key })}
            style={{ color: active ? 'var(--color-accent)' : 'var(--color-neutral-500)' }}
            aria-current={active ? 'page' : undefined}
          >
            <Icon />
            {label}
          </button>
        );
      })}
    </div>
  );
}
