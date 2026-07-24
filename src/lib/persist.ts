import type { Application } from '../types';

/**
 * Local persistence — the external user's tracked data lives on THEIR device
 * (localStorage), so it survives refreshes and "add to home screen" without any
 * backend. Only the user-owned slice is stored; offers are refetched live and
 * transient UI (screen, toast, modal) is not persisted.
 */

const KEY = 'tremplin.v1';
const VERSION = 1;

export interface PersistedState {
  apps: Application[];
  savedIds: string[];
  distance: number;
}

export function loadPersisted(): Partial<PersistedState> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { version?: number; state?: PersistedState };
    if (parsed.version !== VERSION || !parsed.state) return {};
    return parsed.state;
  } catch {
    return {};
  }
}

export function savePersisted(state: PersistedState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, state }));
  } catch {
    /* quota exceeded or private mode — fail silently */
  }
}

export function clearPersisted(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
