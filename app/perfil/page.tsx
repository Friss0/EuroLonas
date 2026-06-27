import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { getMisPedidos } from "@/lib/queries";
import { formatPrecio } from "@/lib/format";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const metadata = { title: "Mi perfil — Eurolonas" };

const fecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "long" });

const estadoLabel: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  preparando: "Preparando",
  enviado: "Enviado",
  cancelado: "Cancelado",
};

const estadoStyle: Record<string, string> = {
  pendiente: "bg-sand text-cocoa",
  pagado: "bg-[#7e8a6b]/20 text-[#52613f]",
  preparando: "bg-camel/15 text-camel",
  enviado: "bg-[#3c5a6e]/15 text-[#3c5a6e]",
  cancelado: "bg-[#b5483d]/12 text-[#b5483d]",
};

export default async function PerfilPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const esAdmin = profile.rol === "admin";
  const pedidos = esAdmin ? [] : await getMisPedidos();

  const inicial = (profile.nombre || profile.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <main className="mx-auto max-w-[820px] px-[clamp(20px,5vw,80px)] pb-24 pt-12">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-line pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-camel/15 font-display text-2xl text-camel">
            {inicial}
          </div>
          <div>
            <h1 className="font-display text-[clamp(1.8rem,1.4rem+1.6vw,2.6rem)] leading-tight text-espresso">
              {profile.nombre || "Mi cuenta"}
            </h1>
            <p className="text-sm text-taupe">{profile.email}</p>
            {profile.telefono && (
              <p className="font-mono text-xs text-taupe">{profile.telefono}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {esAdmin && (
            <Link
              href="/admin"
              className="flex h-11 items-center rounded-sm bg-espresso px-4 text-sm font-medium text-cream transition-colors hover:bg-bark"
            >
              Ir al panel
            </Link>
          )}
          <Link
            href="/perfil/configuracion"
            className="flex h-11 items-center gap-2 rounded-sm border border-line px-4 text-sm text-bark transition-colors hover:border-camel hover:text-camel"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.2.61.78 1.05 1.51 1.05H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Configuración
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Pedidos (solo clientes) */}
      {!esAdmin && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-espresso">Mis pedidos</h2>

          {pedidos.length === 0 ? (
            <div className="mt-6 rounded-sm border border-dashed border-line py-16 text-center">
              <p className="font-mono text-sm text-taupe">
                Todavía no hiciste ningún pedido.
              </p>
              <Link
                href="/productos"
                className="mt-4 inline-flex h-11 items-center rounded-sm border border-line px-5 text-sm text-bark transition-colors hover:border-camel hover:text-camel"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-5">
              {pedidos.map((p) => (
                <li
                  key={p.id}
                  className="overflow-hidden rounded-sm border border-line bg-paper"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-sand/50 px-5 py-3">
                    <div className="font-mono text-xs text-taupe">
                      <span className="text-bark">
                        #{p.id.slice(0, 8).toUpperCase()}
                      </span>{" "}
                      · {fecha.format(new Date(p.created_at))}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] ${
                        estadoStyle[p.estado] ?? "bg-sand text-cocoa"
                      }`}
                    >
                      {estadoLabel[p.estado] ?? p.estado}
                    </span>
                  </div>

                  <div className="px-5 py-4">
                    <ul className="space-y-1.5 text-sm">
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
                    <div className="mt-3 flex justify-between border-t border-line pt-3">
                      <span className="font-mono text-xs uppercase tracking-[0.16em] text-taupe">
                        Total
                      </span>
                      <span className="text-espresso">
                        {formatPrecio(p.total)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
