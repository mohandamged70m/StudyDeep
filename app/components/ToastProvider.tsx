"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'default';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  default: Sparkles,
};

const COLORS: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  default: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'default') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center pointer-events-none" dir="rtl">
        {toasts.map(toast => {
          const Icon = ICONS[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-lg backdrop-blur-sm text-xs font-semibold font-arabic toast-enter ${COLORS[toast.type]}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="mr-1 opacity-60 hover:opacity-100 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
