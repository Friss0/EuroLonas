import type { ProductoConVariantes } from "@/lib/queries";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

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
                <ProductCard producto={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
