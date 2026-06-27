"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** ¿Está configurado el captcha? (site key pública de Turnstile) */
export const captchaSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Captcha de Cloudflare Turnstile. Si no hay site key configurada, no renderiza
 * nada (los forms siguen funcionando). El token resultante se pasa a Supabase.
 */
export function Captcha({
  onVerify,
  refreshKey = 0,
}: {
  onVerify: (token: string | null) => void;
  refreshKey?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!captchaSiteKey) return;
    let cancelled = false;
    let interval: number | undefined;

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: captchaSiteKey,
        theme: "light",
        callback: (token: string) => onVerifyRef.current(token),
        "expired-callback": () => onVerifyRef.current(null),
        "error-callback": () => onVerifyRef.current(null),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      if (!document.querySelector("script[data-turnstile]")) {
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        s.async = true;
        s.defer = true;
        s.setAttribute("data-turnstile", "true");
        document.head.appendChild(s);
      }
      interval = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(interval);
          render();
        }
      }, 200);
    }

    return () => {
      cancelled = true;
      if (interval) window.clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ya removido */
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  // Reset al cambiar refreshKey (ej. tras un intento fallido: el token es de un solo uso).
  useEffect(() => {
    if (refreshKey > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onVerifyRef.current(null);
    }
  }, [refreshKey]);

  if (!captchaSiteKey) return null;
  return <div ref={containerRef} className="min-h-[65px]" />;
}
