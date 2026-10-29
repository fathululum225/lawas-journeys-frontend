'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/shared/Icon';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  visible: boolean;
}

type ShowToast = (message: string, type?: ToastType, duration?: number) => void;

const ToastContext = createContext<ShowToast | null>(null);

const TOAST_ICONS: Record<ToastType, IconName> = { success: 'check-circle', error: 'alert', info: 'info' };
const DEFAULT_DURATION = 4500;
const EXIT_DURATION = 400;

/** Renders the toast region and exposes showToast() through useToast(). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const showToast = useCallback<ShowToast>((message, type = 'info', duration = DEFAULT_DURATION) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, type, visible: false }]);

    // One frame later so the CSS transition has a starting state to animate from.
    requestAnimationFrame(() => setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, visible: true } : toast))));

    schedule(() => {
      setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, visible: false } : toast)));
      schedule(() => setToasts((current) => current.filter((toast) => toast.id !== id)), EXIT_DURATION);
    }, duration);
  }, [schedule]);

  const value = useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}${toast.visible ? ' is-visible' : ''}`}>
            <Icon name={TOAST_ICONS[toast.type]} size={18} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** const showToast = useToast(); showToast('Saved', 'success'); */
export const useToast = (): ShowToast => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
};
