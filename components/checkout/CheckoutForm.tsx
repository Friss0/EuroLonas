"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrecio } from "@/lib/format";
import { crearPedido } from "@/app/checkout/actions";

const inputClass =
  "h-11 w-full rounded-sm border border-line bg-paper px-3 text-bark outline-none transition-colors focus:border-camel";
const labelClass = "font-mono text-xs uppercase tracking-[0.16em] text-cocoa";

export function CheckoutForm({
  defaultNombre,
  defaultEmail,
  defaultTelefono,
}: {
  defaultNombre: string;
  defaultEmail: string;
  defaultTelefono: string;
}) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [nombre, setNombre] = useState(defaultNombre);
  const [email, setEmail] = useState(defaultEmail);
  const [telefono, setTelefono] = useState(defaultTelefono);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Guard SSR-safe: el carrito vive en localStorage (cliente). Renderizamos
  // recién tras montar para no desincronizar el HTML del servidor.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- guard de montaje client-only
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-sm border border-dashed border-line py-16 text-center">
        <p className="font-mono text-sm text-taupe">Tu carrito está vacío.</p>
        <Link
          href="/productos"
          className="mt-4 inline-flex h-11 items-center rounded-sm border border-line px-5 text-sm text-bark transition-colors hover:border-camel hover:text-camel"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await crearPedido({
      items: items.map((i) => ({ variantId: i.variantId, cantidad: i.cantidad })),
      nombre,
      email,
      telefono,
    });
    if ("error" in res) {
      setError(res.error);
      setLoading(false);
      return;
    }
    clear();
    router.push("/checkout/gracias");
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
      <form onSubmit={onSubmit} className="space-y-5">
        <h2 className="font-display text-2xl text-espresso">Tus datos</h2>
        <label className="block space-y-2">
          <span className={labelClass}>Nombre completo</span>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block space-y-2">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block space-y-2">
          <span className={labelClass}>Teléfono</span>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className={inputClass}
          />
        </label>
        {error && <p className="font-mono text-xs text-[#b5483d]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center rounded-sm bg-espresso text-sm font-medium text-cream transition-colors hover:bg-bark disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {loading ? "Registrando…" : "Confirmar pedido"}
        </button>
        <p className="font-mono text-[11px] text-taupe">
          Registramos tu pedido y lo coordinamos por WhatsApp. El pago online
          (Mercado Pago) se activa pronto.
        </p>
      </form>

      <aside className="h-fit rounded-sm border border-line bg-paper p-5">
        <h2 className="font-display text-xl text-espresso">Tu pedido</h2>
        <ul className="mt-4 space-y-3">
          {items.map((it) => (
            <li
              key={it.variantId}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="min-w-0">
                <span className="block truncate text-bark">
                  {it.productoNombre}
                </span>
                <span className="font-mono text-xs text-taupe">
                  {it.varianteNombre} ×{it.cantidad}
                  {it.unidad === "metro" ? " m" : ""}
                </span>
              </span>
              <span className="shrink-0 text-bark">
                {formatPrecio(it.precioUnitario * it.cantidad)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-taupe">
            Total
          </span>
          <span className="text-lg text-espresso">{formatPrecio(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
