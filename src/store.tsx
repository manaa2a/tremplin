import {
  createContext, useContext, useEffect, useReducer,
  type Dispatch, type ReactNode,
} from 'react';
import type { Application, FilterKey, Offer, StatusKey } from './types';
import { meta } from './lib/status';
import { MOCK_APPS, MOCK_OFFERS, USER_NAME } from './data/mock';
import { loadPersisted, savePersisted } from './lib/persist';

export type Screen = 'login' | 'app';
export type Tab = 'dashboard' | 'apps' | 'search' | 'profile';
export type View = 'map' | 'list';

export interface State {
  screen: Screen;
  tab: Tab;
  detailId: string | null;
  statusFilter: FilterKey;
  distance: number;
  view: View;
  selectedOfferId: string | null;
  savedIds: string[];
  toast: string;
  showRelance: boolean;
  relanceId: string | null;
  relanceText: string;
  apps: Application[];
  offers: Offer[];
  offersStatus: 'idle' | 'loading' | 'ready';
  offersSource: 'live' | 'mock';
  offersNote: string;
}

export const initialState: State = {
  screen: 'login',
  tab: 'dashboard',
  detailId: null,
  statusFilter: 'all',
  distance: 50,
  view: 'map',
  selectedOfferId: null,
  savedIds: [],
  toast: '',
  showRelance: false,
  relanceId: null,
  relanceText: '',
  apps: MOCK_APPS,
  offers: MOCK_OFFERS,
  offersStatus: 'idle',
  offersSource: 'mock',
  offersNote: '',
};

export type Action =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'SET_TAB'; tab: Tab }
  | { type: 'OPEN_DETAIL'; id: string }
  | { type: 'BACK' }
  | { type: 'SET_FILTER'; key: FilterKey }
  | { type: 'SET_DISTANCE'; km: number }
  | { type: 'SET_VIEW'; view: View }
  | { type: 'SELECT_OFFER'; id: string | null }
  | { type: 'SET_STATUS'; id: string; status: StatusKey }
  | { type: 'OPEN_RELANCE'; id: string }
  | { type: 'CLOSE_RELANCE' }
  | { type: 'SET_RELANCE_TEXT'; text: string }
  | { type: 'SEND_RELANCE' }
  | { type: 'SAVE_OFFER'; id: string }
  | { type: 'OFFERS_LOADING' }
  | { type: 'OFFERS_LOADED'; offers: Offer[]; source: 'live' | 'mock'; note?: string }
  | { type: 'TOAST'; msg: string }
  | { type: 'CLEAR_TOAST' };

/** Build the pre-filled relance message for an application. */
export function relanceTemplate(a: Application): string {
  const contactFirst = a.contactName.split(' ')[0] || '';
  return (
    `Bonjour ${contactFirst},\n\n` +
    `Je me permets de revenir vers vous concernant le poste de ${a.title} chez ${a.company}, ` +
    `pour lequel j'ai candidaté le ${a.appliedDate}.\n\n` +
    `Toujours très motivé et disponible immédiatement, je reste à votre écoute pour un entretien.\n\n` +
    `Bien cordialement,\n${USER_NAME}`
  );
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, screen: 'app', tab: 'dashboard' };
    case 'LOGOUT':
      return { ...state, screen: 'login', detailId: null };
    case 'SET_TAB':
      return { ...state, tab: action.tab, detailId: null };
    case 'OPEN_DETAIL':
      return { ...state, detailId: action.id, selectedOfferId: null };
    case 'BACK':
      return { ...state, detailId: null };
    case 'SET_FILTER':
      return { ...state, statusFilter: action.key };
    case 'SET_DISTANCE':
      return { ...state, distance: action.km };
    case 'SET_VIEW':
      return {
        ...state,
        view: action.view,
        selectedOfferId: action.view === 'list' ? null : state.selectedOfferId,
      };
    case 'SELECT_OFFER':
      return { ...state, selectedOfferId: action.id };

    case 'SET_STATUS': {
      const apps = state.apps.map((a) =>
        a.id === action.id
          ? {
              ...a,
              status: action.status,
              timeline: [
                { label: 'Statut : ' + meta(action.status).label, date: "Aujourd'hui" },
                ...a.timeline,
              ],
            }
          : a,
      );
      return { ...state, apps, toast: 'Statut mis à jour' };
    }

    case 'OPEN_RELANCE': {
      const a = state.apps.find((x) => x.id === action.id);
      if (!a) return state;
      return { ...state, showRelance: true, relanceId: action.id, relanceText: relanceTemplate(a) };
    }
    case 'CLOSE_RELANCE':
      return { ...state, showRelance: false };
    case 'SET_RELANCE_TEXT':
      return { ...state, relanceText: action.text };

    case 'SEND_RELANCE': {
      const id = state.relanceId;
      const apps = state.apps.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                a.status === 'a_relancer' || a.status === 'enregistre' || a.status === 'a_postuler'
                  ? ('postule' as StatusKey)
                  : a.status,
              waitDays: 0,
              timeline: [{ label: 'Relance envoyée', date: "Aujourd'hui" }, ...a.timeline],
            }
          : a,
      );
      return { ...state, showRelance: false, apps, toast: 'Relance envoyée 🚀' };
    }

    case 'SAVE_OFFER': {
      if (state.savedIds.includes(action.id)) {
        return { ...state, toast: 'Déjà dans ton suivi' };
      }
      const o = state.offers.find((x) => x.id === action.id);
      if (!o) return state;
      const na: Application = {
        id: 'saved_' + action.id,
        title: o.title, company: o.company, logo: o.company[0], city: o.city,
        distanceKm: o.distanceKm, contract: o.contract, salary: o.salary, schedule: o.schedule,
        caces: o.caces, status: 'a_postuler', source: o.source, appliedDate: '—', waitDays: 0,
        contactName: o.contactName, contactRole: o.contactRole, contactPhone: o.contactPhone, contactEmail: o.contactEmail,
        timeline: [{ label: 'Offre enregistrée', date: "Aujourd'hui" }],
      };
      return {
        ...state,
        apps: [na, ...state.apps],
        savedIds: [...state.savedIds, action.id],
        toast: 'Offre ajoutée au suivi',
      };
    }

    case 'OFFERS_LOADING':
      return { ...state, offersStatus: 'loading' };
    case 'OFFERS_LOADED':
      return {
        ...state,
        offers: action.offers,
        offersStatus: 'ready',
        offersSource: action.source,
        offersNote: action.note ?? '',
        // Drop a stale selection that no longer exists in the new result set.
        selectedOfferId: action.offers.some((o) => o.id === state.selectedOfferId)
          ? state.selectedOfferId
          : null,
      };

    case 'TOAST':
      return { ...state, toast: action.msg };
    case 'CLEAR_TOAST':
      return { ...state, toast: '' };

    default:
      return state;
  }
}

const StateCtx = createContext<State>(initialState);
const DispatchCtx = createContext<Dispatch<Action>>(() => {});

/** Merge any persisted user data over the seed state on first render. */
function hydrate(): State {
  const saved = loadPersisted();
  return {
    ...initialState,
    ...(saved.apps ? { apps: saved.apps } : {}),
    ...(saved.savedIds ? { savedIds: saved.savedIds } : {}),
    ...(typeof saved.distance === 'number' ? { distance: saved.distance } : {}),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate);

  // Toast auto-dismiss after ~2.6s.
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2600);
    return () => clearTimeout(t);
  }, [state.toast]);

  // Persist the user-owned slice to their device whenever it changes.
  useEffect(() => {
    savePersisted({ apps: state.apps, savedIds: state.savedIds, distance: state.distance });
  }, [state.apps, state.savedIds, state.distance]);

  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export const useAppState = () => useContext(StateCtx);
export const useDispatch = () => useContext(DispatchCtx);
