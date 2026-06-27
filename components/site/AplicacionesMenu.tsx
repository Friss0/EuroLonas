"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APLICACIONES } from "@/lib/aplicaciones";

export function AplicacionesMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Cerrar al navegar: ajuste de estado en el render cuando cambia la ruta.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const idx = Math.min(active, APLICACIONES.length - 1);
  const act = APLICACIONES[idx];

  return (
    <div ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 items-center gap-1.5 px-3 text-sm text-bark transition-colors hover:text-camel"
      >
        Aplicaciones
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-40 overflow-hidden border-b border-line bg-cream shadow-[0_20px_40px_rgba(31,21,14,0.10)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
            <div className="grid grid-cols-1 gap-x-16 py-9 pl-[clamp(24px,4vw,72px)] pr-8 sm:grid-cols-[260px_auto]">
              <div className="flex flex-col justify-center">
                <p className="font-display text-2xl leading-tight text-espresso lg:whitespace-nowrap">
                  Nuestras
                  <br />
                  aplicaciones
                </p>
              </div>

              <ul className="mt-8 flex flex-col sm:mt-0">
                {APLICACIONES.map((a, i) => (
                  <li key={a.slug}>
                    <Link
                      href={`/aplicaciones/${a.slug}`}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setOpen(false)}
                      className={`flex h-12 items-center whitespace-nowrap text-lg transition-colors ${
                        act.slug === a.slug
                          ? "text-camel"
                          : "text-bark hover:text-camel"
                      }`}
                    >
                      {a.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Imagen (hero de la aplicación, con gradiente de respaldo) */}
            <div className="relative hidden self-stretch bg-sand lg:block">
              <div
                key={act.slug}
                className="absolute inset-0 animate-fade-in bg-cover bg-center"
                style={{
                  backgroundImage: `url(/aplicaciones/${act.slug}/hero.jpg), ${act.gradient}`,
                }}
                aria-hidden
              />
              <span className="absolute bottom-5 left-6 font-display text-3xl text-paper drop-shadow">
                {act.nombre}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
