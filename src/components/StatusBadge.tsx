import type { StatusKey } from '../types';
import { chipStyle, meta } from '../lib/status';

/** Small status pill used across cards and the detail header. */
export function StatusBadge({ status, fontSize = 10.5 }: { status: StatusKey; fontSize?: number }) {
  return (
    <span style={{ ...chipStyle(status), fontSize, padding: '3px 9px', whiteSpace: 'nowrap' }}>
      {meta(status).label}
    </span>
  );
}
