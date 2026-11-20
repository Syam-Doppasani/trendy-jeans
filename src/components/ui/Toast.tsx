import React from 'react';
import { useToast } from '../../store/toast';

export function Toast(): React.ReactElement {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return <></>;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed z-[100] left-1/2 -translate-x-1/2 bottom-20 md:bottom-8 flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          onClick={() => removeToast(toast.id)}
          className="pointer-events-auto bg-ink text-surface px-5 py-3 rounded-card shadow-soft text-sm font-medium flex items-center justify-between gap-3 animate-fade-in border border-line/20"
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
