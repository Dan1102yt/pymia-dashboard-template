import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 lg:bottom-6 z-[60] flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl max-w-full">
        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
}
