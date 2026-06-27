import Link from "next/link";
import type { Categoria, Aplicacion } from "@/lib/types";

function build(base: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 items-center rounded-sm border px-4 text-sm transition ${
        active
          ? "border-camel bg-camel text-paper"
          : "border-line text-bark hover:border-camel-soft"
      }`}
    >
      {children}
    </Link>
  );
}

export function CatalogFilters({
  basePath,
  categorias,
  aplicaciones = [],
  active,
}: {
  basePath: string;
  categorias: Categoria[];
  aplicaciones?: Aplicacion[];
  active: { categoria?: string; aplicacion?: string; orden?: string };
}) {
  const orden = active.orden;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Chip
          href={build(basePath, { aplicacion: active.aplicacion, orden })}
          active={!active.categoria}
        >
          Todas
        </Chip>
        {categorias.map((c) => (
          <Chip
            key={c.id}
            href={build(basePath, {
              categoria: c.slug,
              aplicacion: active.aplicacion,
              orden,
            })}
            active={active.categoria === c.slug}
          >
            {c.nombre}
          </Chip>
        ))}
      </div>

      {aplicaciones.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-taupe">
            Aplicación
          </span>
          <Chip
            href={build(basePath, { categoria: active.categoria, orden })}
            active={!active.aplicacion}
          >
            Todas
          </Chip>
          {aplicaciones.map((a) => (
            <Chip
              key={a.id}
              href={build(basePath, {
                categoria: active.categoria,
                aplicacion: a.slug,
                orden,
              })}
              active={active.aplicacion === a.slug}
            >
              {a.nombre}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
