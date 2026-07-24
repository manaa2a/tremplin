import type { StatusKey } from '../types';

export interface StatusMeta {
  label: string;
  bg: string;
  fg: string;
  border: string;
}

const META: Record<StatusKey, StatusMeta> = {
  enregistre: { label: 'Enregistré', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-800)', border: '0' },
  a_postuler: { label: 'À postuler', bg: 'transparent', fg: 'var(--color-accent-700)', border: '1px solid var(--color-accent)' },
  postule:    { label: 'Postulé', bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)', border: '0' },
  a_relancer: { label: 'À relancer', bg: 'var(--color-accent-500)', fg: '#fff', border: '0' },
  en_cours:   { label: 'En cours', bg: 'var(--color-neutral-900)', fg: '#fff', border: '0' },
  refuse:     { label: 'Refusé', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-500)', border: '0' },
  accepte:    { label: 'Accepté', bg: 'var(--color-accent-700)', fg: '#fff', border: '0' },
};

export function meta(k: StatusKey): StatusMeta {
  return META[k] ?? META.enregistre;
}

/** Inline style for a status badge/chip. */
export function chipStyle(k: StatusKey): React.CSSProperties {
  const m = meta(k);
  return {
    background: m.bg,
    color: m.fg,
    border: m.border === '0' ? undefined : m.border,
    fontFamily: 'var(--font-heading)',
    fontWeight: 800,
  };
}

/** Two-letter initials from a full name. */
export function initials(name: string): string {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Sort priority for the default "Tout" view. */
export const STATUS_ORDER: Record<StatusKey, number> = {
  a_relancer: 0,
  en_cours: 1,
  postule: 2,
  a_postuler: 3,
  enregistre: 4,
  accepte: 5,
  refuse: 6,
};
