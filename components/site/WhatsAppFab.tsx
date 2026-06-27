"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

export function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // La burbuja aparece sola un ratito después de cargar.
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const showBubble = open && !dismissed;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {showBubble && (
        <div className="relative max-w-[230px] animate-fade-up rounded-2xl rounded-br-md bg-paper px-4 py-3 pr-9 shadow-[0_14px_44px_rgba(31,21,14,0.20)] ring-1 ring-line">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setDismissed(true)}
            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-taupe transition-colors hover:bg-sand hover:text-bark"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-camel">
            Eurolonas
          </p>
          <p className="mt-1 text-sm leading-snug text-bark">
            ¿En qué puedo ayudarte?
          </p>
        </div>
      )}

      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        onMouseEnter={() => !dismissed && setOpen(true)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
        </svg>
      </a>
    </div>
  );
}
