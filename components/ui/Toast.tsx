"use client";
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type Toast = { id: number; msg: string };

const ToastCtx = createContext<(msg: string) => void>(() => {});

/** Hook para disparar un toast: const toast = useToast(); toast("Listo"). */
export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      3500,
    );
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex animate-fade-up items-center gap-3 rounded-sm border border-line bg-paper px-4 py-3 shadow-[0_12px_40px_rgba(31,21,14,0.16)]"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7e8a6b]/20 text-[#52613f]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="text-sm text-bark">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
