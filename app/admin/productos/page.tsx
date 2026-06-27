import Link from "next/link";
import { getProductosAdmin } from "@/lib/admin";
import { formatPrecio } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductos() {
  const productos = await getProductosAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[clamp(2rem,1.6rem+1.6vw,2.8rem)] leading-tight text-espresso">
          Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex h-11 items-center rounded-sm bg-espresso px-5 text-sm font-medium text-cream transition-colors hover:bg-bark"
        >
          + Nuevo producto
        </Link>
      </div>

      <p className="mt-2 font-mono text-xs text-taupe">
        {productos.length} producto{productos.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 divide-y divide-line border-y border-line">
        {productos.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/productos/${p.id}`}
                  className="truncate text-bark hover:text-camel"
                >
                  {p.nombre}
                </Link>
                {!p.activo && (
                  <span className="rounded-sm bg-sand px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-taupe">
                    inactivo
                  </span>
                )}
                {p.destacado && (
                  <span className="rounded-sm bg-camel/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-camel">
                    destacado
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-taupe">
                {p.rubro?.nombre ?? "—"} · {p.categoria?.nombre ?? "sin categoría"}
                {p.codigo ? ` · ${p.codigo}` : ""}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-5">
              <span className="text-sm text-bark">
                {formatPrecio(p.precio_base)}
              </span>
              <Link
                href={`/admin/productos/${p.id}`}
                className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-bark transition-colors hover:text-camel"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Editar
              </Link>
              <DeleteProductButton id={p.id} nombre={p.nombre} />
            </div>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <p className="mt-8 font-mono text-sm text-taupe">
          No hay productos. Creá el primero con “Nuevo producto”.
        </p>
      )}
    </div>
  );
}
