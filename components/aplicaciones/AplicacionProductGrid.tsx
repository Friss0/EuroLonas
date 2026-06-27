import Link from "next/link";
import type { ProductoConVariantes } from "@/lib/queries";
import { formatPrecio, unidadSufijo, precioDesde } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

function Card({ p }: { p: ProductoConVariantes }) {
  const img = p.imagenes?.[0];
  const hex =
    p.variantes.find((v) => v.swatch_hex && v.activo)?.swatch_hex ?? "#efe6d6";
  const desde = precioDesde(p.precio_base, p.variantes);

  return (
    <Link
      href={`/producto/${p.slug}`}
      className="group block overflow-hidden rounded-xl border border-line bg-cream transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)]"
    >
      <div
        className="aspect-[4/3] w-full bg-cover bg-center"
        style={img ? { backgroundImage: `url(${img})` } : { backgroundColor: hex }}
        aria-hidden
      />
      <div className="px-4 pb-4">
        <p className="mt-3 font-sans text-sm font-black uppercase tracking-wide text-[var(--accent)] transition-colors duration-300 group-hover:text-paper">
          {p.nombre}
        </p>
        <p className="mt-1 text-sm text-taupe transition-colors duration-300 group-hover:text-paper/80">
          {desde
            ? `Desde ${formatPrecio(desde)} ${unidadSufijo(p.unidad_venta)}`
            : "Consultar precio"}
        </p>
      </div>
    </Link>
  );
}

export function AplicacionProductGrid({
  productos,
}: {
  productos: ProductoConVariantes[];
}) {
  return (
    <section className="border-t border-line bg-cream">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] py-[clamp(40px,6vw,72px)]">
        <p className="text-lg font-semibold text-espresso">
          {productos.length} producto{productos.length === 1 ? "" : "s"}
        </p>

        {productos.length === 0 ? (
          <p className="mt-8 font-mono text-sm text-taupe">
            Todavía no hay productos cargados para esta aplicación.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <Card p={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
