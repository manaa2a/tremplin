import { Check } from 'lucide-react';
import { useAppState } from '../store';

export function Toast() {
  const { toast } = useAppState();
  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <Check size={16} strokeWidth={2.5} />
      {toast}
    </div>
  );
}
