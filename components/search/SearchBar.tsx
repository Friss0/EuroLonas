"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  formatPrecio,
  unidadSufijo,
  precioDesde,
  normalizar,
} from "@/lib/format";
import type { UnidadVenta } from "@/lib/types";

type Hit = {
  id: string;
  nombre: string;
  slug: string;
  codigo: string | null;
  unidad_venta: UnidadVenta;
  precio_base: number | null;
  imagenes: string[];
  variantes: {
    swatch_hex: string | null;
    precio_override: number | null;
    activo: boolean;
  }[];
};

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState<Hit[] | null>(null);
  const loadingRef = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function ensureLoaded() {
    if (all || loadingRef.current) return;
    loadingRef.current = true;
    const supabase = createClient();
    const { data } = await supabase
      .from("productos")
      .select(
        "id,nombre,slug,codigo,unidad_venta,precio_base,imagenes,variantes(swatch_hex,precio_override,activo)",
      )
      .eq("activo", true)
      .order("orden");
    setAll((data ?? []) as Hit[]);
  }

  const term = normalizar(q);
  const hits =
    term.length >= 1 && all
      ? all
          .filter((h) =>
            normalizar(`${h.nombre} ${h.codigo ?? ""}`).includes(term),
          )
          .slice(0, 4)
      : [];

  const showDropdown = open && q.trim().length >= 1;

  function goAll() {
    const t = q.trim();
    router.push(t ? `/productos?q=${encodeURIComponent(t)}` : "/productos");
    setOpen(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    goAll();
  }

  return (
    <div
      ref={boxRef}
      className="relative w-full"
      onBlur={(e) => {
        if (!boxRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <form onSubmit={onSubmit} role="search">
        <div className="flex h-10 items-center gap-2 rounded-full bg-sand/70 px-4 transition-colors focus-within:bg-paper focus-within:ring-1 focus-within:ring-camel">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="shrink-0 text-taupe"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              setOpen(true);
              ensureLoaded();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            type="search"
            name="q"
            autoFocus={autoFocus}
            placeholder="Buscar productos…"
            aria-label="Buscar productos"
            className="h-full w-full bg-transparent text-sm text-bark outline-none placeholder:text-taupe/60"
          />
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_12px_40px_rgba(31,21,14,0.16)]">
          {!all ? (
            <p className="px-4 py-3 font-mono text-xs text-taupe">Buscando…</p>
          ) : hits.length === 0 ? (
            <p className="px-4 py-3 font-mono text-xs text-taupe">
              Sin resultados para “{q.trim()}”.
            </p>
          ) : (
            <ul>
              {hits.map((h) => {
                const hex =
                  h.variantes.find((v) => v.swatch_hex && v.activo)
                    ?.swatch_hex ?? null;
                const desde = precioDesde(h.precio_base, h.variantes);
                const img = h.imagenes?.[0];
                return (
                  <li key={h.id}>
                    <Link
                      href={`/producto/${h.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-sand"
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[2px] bg-sand ring-1 ring-line">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : hex ? (
                          <span
                            className="block h-full w-full"
                            style={{ backgroundColor: hex }}
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center font-mono text-[9px] text-bark">
                            {h.codigo}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-espresso">
                          {h.nombre}
                        </span>
                        <span className="block font-mono text-[11px] text-taupe">
                          {desde
                            ? `desde ${formatPrecio(desde)} ${unidadSufijo(h.unidad_venta)}`
                            : "Consultar"}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={goAll}
            className="block w-full border-t border-line bg-cream px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.16em] text-bark transition-colors hover:text-camel"
          >
            Ver todos los productos →
          </button>
        </div>
      )}
    </div>
  );
}
