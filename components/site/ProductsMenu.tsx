"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ProductoMenu } from "@/lib/queries";
import { MENU_IMAGES } from "@/lib/menu-images";

type Item = { key: string; nombre: string; href: string; img: string | null };

// Gradientes "plantilla" para previsualizar el lugar de la imagen hasta que se
// carguen las fotos reales en lib/menu-images.ts.
const PLACEHOLDERS = [
  "linear-gradient(135deg, #a97c54, #6b4a33)",
  "linear-gradient(135deg, #8a5f3e, #c7a781)",
  "linear-gradient(135deg, #6b4a33, #a97c54)",
  "linear-gradient(135deg, #4f4a3a, #7e8a6b)",
  "linear-gradient(135deg, #3a2c20, #6b4a33)",
];

export function ProductsMenu({ products }: { products: ProductoMenu[] }) {
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

  const items: Item[] = [
    ...products.map((p) => ({
      key: p.id,
      nombre: p.nombre,
      href: `/producto/${p.slug}`,
      img: MENU_IMAGES[p.slug] ?? null,
    })),
    {
      key: "__insumos",
      nombre: "Insumos para toldos",
      href: "/insumos",
      img: MENU_IMAGES["insumos"] ?? null,
    },
  ];
  const idx = Math.min(active, items.length - 1);
  const act = items[idx] ?? items[0];

  return (
    <div ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 items-center gap-1.5 px-3 text-sm text-bark transition-colors hover:text-camel"
      >
        Productos
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
          {/* Dos mitades: contenido (izq) | imagen (der), como Serge Ferrari */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
            {/* Mitad izquierda: título + botón + lista */}
            <div className="grid grid-cols-1 gap-x-16 py-9 pl-[clamp(24px,4vw,72px)] pr-8 sm:grid-cols-[260px_auto]">
              <div className="flex flex-col justify-center">
                <p className="font-display text-2xl leading-tight text-espresso lg:whitespace-nowrap">
                  Nuestros productos
                </p>
                <Link
                  href="/productos"
                  onClick={() => setOpen(false)}
                  className="mt-5 flex h-12 w-full items-center justify-between gap-2 whitespace-nowrap rounded-full bg-espresso px-5 text-sm font-medium text-cream transition-colors hover:bg-bark"
                >
                  Ver todos los productos
                  <svg
                    width="18"
                    height="9"
                    viewBox="0 0 22 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden
                  >
                    <path d="M0 5h20M16 1l5 4-5 4" />
                  </svg>
                </Link>
              </div>

              <ul className="mt-8 flex flex-col sm:mt-0">
                {items.map((it, i) => (
                  <li key={it.key}>
                    <Link
                      href={it.href}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setOpen(false)}
                      className={`flex h-12 items-center whitespace-nowrap text-lg transition-colors ${
                        act.key === it.key
                          ? "text-camel"
                          : "text-bark hover:text-camel"
                      } ${
                        it.key === "__insumos"
                          ? "mt-2 border-t border-line pt-4 font-medium"
                          : ""
                      }`}
                    >
                      {it.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mitad derecha: imagen a sangre, full alto. Cambia con el hover.
                Mientras no haya foto real, muestra una plantilla (gradiente + nombre). */}
            <div className="relative hidden self-stretch bg-sand lg:block">
              {act.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={act.key}
                  src={act.img}
                  alt={act.nombre}
                  className="absolute inset-0 h-full w-full animate-fade-in object-cover"
                />
              ) : (
                <div
                  key={act.key}
                  className="absolute inset-0 flex animate-fade-in items-center justify-center p-8 text-center"
                  style={{ background: PLACEHOLDERS[idx % PLACEHOLDERS.length] }}
                >
                  <span className="font-display text-3xl text-paper/90">
                    {act.nombre}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
