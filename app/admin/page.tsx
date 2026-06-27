import Link from "next/link";
import {
  getDashboardStats,
  getPedidosAdmin,
  getProductosAdmin,
} from "@/lib/admin";
import { formatPrecio } from "@/lib/format";
import { EstadoSelect } from "@/components/admin/EstadoSelect";
import { DashboardFilters } from "@/components/admin/DashboardFilters";

const fecha = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string; producto?: string }>;
}) {
  const sp = await searchParams;
  const periodo = sp.periodo ?? "";
  const productoId = sp.producto ?? "";

  const [stats, pedidos, productos] = await Promise.all([
    getDashboardStats(),
    getPedidosAdmin(),
    getProductosAdmin(),
  ]);

  const now = new Date();
  let desde: Date | null = null;
  if (periodo === "hoy")
    desde = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  else if (periodo === "mes")
    desde = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (periodo === "anio") desde = new Date(now.getFullYear(), 0, 1);

  let filtrados = pedidos;
  if (desde) filtrados = filtrados.filter((p) => new Date(p.created_at) >= desde!);
  if (productoId)
    filtrados = filtrados.filter((p) =>
      p.pedido_items.some((it) => it.variante?.producto?.id === productoId),
    );

  const cantidad = filtrados.length;
  const ingresos = filtrados.reduce((s, p) => s + p.total, 0);
  const cobrado = filtrados
    .filter((p) => ["pagado", "preparando", "enviado"].includes(p.estado))
    .reduce((s, p) => s + p.total, 0);

  const cards = [
    { label: "Productos", value: String(stats.productos) },
    { label: "Pedidos totales", value: String(stats.pedidos) },
    { label: "Pendientes", value: String(stats.pendientes) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[clamp(2rem,1.6rem+1.6vw,2.8rem)] leading-tight text-espresso">
          Resumen
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex h-11 items-center rounded-sm bg-espresso px-5 text-sm font-medium text-cream transition-colors hover:bg-bark"
        >
          + Nuevo producto
        </Link>
      </div>

      {/* Tarjetas */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-sm border border-line bg-paper p-5"
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-taupe">
              {c.label}
            </p>
            <p className="mt-3 font-display text-4xl text-espresso">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Dashboard de pedidos */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-espresso">
          Pedidos recibidos
        </h2>

        <div className="mt-4">
          <DashboardFilters
            productos={productos.map((p) => ({ id: p.id, nombre: p.nombre }))}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 sm:max-w-xl">
          <div className="rounded-sm border border-line bg-sand/40 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-taupe">
              Pedidos
            </p>
            <p className="mt-2 font-display text-3xl text-espresso">
              {cantidad}
            </p>
          </div>
          <div className="rounded-sm border border-line bg-sand/40 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-taupe">
              Total
            </p>
            <p className="mt-2 font-display text-3xl text-espresso">
              {formatPrecio(ingresos)}
            </p>
          </div>
          <div className="rounded-sm border border-line bg-sand/40 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-taupe">
              Cobrado
            </p>
            <p className="mt-2 font-display text-3xl text-[#4f7d4a]">
              {formatPrecio(cobrado)}
            </p>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <p className="mt-8 font-mono text-sm text-taupe">
            No hay pedidos en este filtro.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {filtrados.map((p) => (
              <li
                key={p.id}
                className="rounded-sm border border-line bg-paper p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-3">
                  <div>
                    <p className="font-mono text-xs text-taupe">
                      <span className="text-bark">
                        #{p.id.slice(0, 8).toUpperCase()}
                      </span>{" "}
                      · {fecha.format(new Date(p.created_at))}
                    </p>
                    <p className="mt-1 text-sm text-espresso">
                      {p.cliente_nombre}
                    </p>
                    <p className="font-mono text-xs text-taupe">
                      {p.cliente_email}
                      {p.cliente_telefono ? ` · ${p.cliente_telefono}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.mp_payment_id && (
                      <span
                        title={`MP · ${p.mp_payment_id}`}
                        className="inline-flex items-center rounded-full bg-[#5b8a4f]/12 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-[#4f7d4a]"
                      >
                        Pago online
                      </span>
                    )}
                    <span className="text-base text-espresso">
                      {formatPrecio(p.total)}
                    </span>
                    <EstadoSelect pedidoId={p.id} estado={p.estado} />
                  </div>
                </div>

                <ul className="mt-3 space-y-1.5 text-sm">
                  {p.pedido_items.map((it) => (
                    <li
                      key={it.id}
                      className="flex justify-between gap-4 text-bark"
                    >
                      <span className="min-w-0 truncate">
                        {it.variante?.producto?.nombre ?? "Producto"}
                        <span className="text-taupe">
                          {" "}
                          · {it.variante?.nombre}
                        </span>
                        <span className="font-mono text-xs text-taupe">
                          {" "}
                          ×{it.cantidad}
                        </span>
                      </span>
                      <span className="shrink-0">
                        {formatPrecio(it.precio_unitario * it.cantidad)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
