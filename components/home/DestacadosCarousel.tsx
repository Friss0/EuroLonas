import Link from "next/link";
import type { ProductoConVariantes } from "@/lib/queries";
import { ProductCard } from "@/components/product/ProductCard";

export function DestacadosCarousel({
  productos,
}: {
  productos: ProductoConVariantes[];
}) {
  if (productos.length === 0) return null;
  const items = productos.slice(0, 4);

  return (
    <section className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] pb-10 pt-[clamp(56px,8vw,128px)]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Selección
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] leading-[1.05] text-espresso">
          Productos destacados
        </h2>
      </div>

      {/* Mobile: slider horizontal con snap. Desktop: grilla. */}
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {items.map((p) => (
          <div key={p.id} className="min-w-[68%] snap-start sm:min-w-0">
            <ProductCard producto={p} compact />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/productos"
          className="group inline-flex h-12 items-center gap-2 rounded-full border border-line px-7 text-sm font-medium text-espresso transition-colors hover:border-camel hover:text-camel"
        >
          Ver todos los productos
          <svg
            width="22"
            height="10"
            viewBox="0 0 22 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M0 5h20M16 1l5 4-5 4" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
