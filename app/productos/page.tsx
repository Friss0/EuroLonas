import { getAllProductos, getAllCategorias } from "@/lib/queries";
import { normalizar, ordenarProductos } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductosFilters } from "@/components/catalog/ProductosFilters";
import { Pagination } from "@/components/catalog/Pagination";

const PAGE_SIZE = 9;

export const metadata = {
  title: "Todos los productos — Eurolonas",
  description:
    "Catálogo completo de telas e insumos para toldos. Buscá, ordená y filtrá por categoría.",
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    orden?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const categoriaSlug = sp.categoria;
  const orden = sp.orden;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const [productos, categorias] = await Promise.all([
    getAllProductos(),
    getAllCategorias(),
  ]);

  const telasCats = categorias
    .filter((c) => c.rubro?.slug === "telas")
    .map((c) => ({ id: c.id, nombre: c.nombre, slug: c.slug }));
  const insumosCats = categorias
    .filter((c) => c.rubro?.slug === "insumos")
    .map((c) => ({ id: c.id, nombre: c.nombre, slug: c.slug }));

  const nq = normalizar(q);
  let filtered = productos;
  if (categoriaSlug)
    filtered = filtered.filter((p) => p.categoria?.slug === categoriaSlug);
  if (nq)
    filtered = filtered.filter((p) =>
      normalizar(`${p.nombre} ${p.codigo ?? ""}`).includes(nq),
    );

  filtered = ordenarProductos(filtered, orden);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return (
    <main className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] pb-24 pt-12">
      <header className="max-w-[60ch]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Catálogo completo
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,1.6rem+3vw,4rem)] leading-[1.02] text-espresso">
          Todos los productos
        </h1>
        {q ? (
          <p className="mt-4 text-taupe">
            {total} resultado{total === 1 ? "" : "s"} para “{q}”.
          </p>
        ) : (
          <p className="mt-4 text-taupe">
            Telas e insumos, todo en un solo lugar. Elegí una categoría por rubro
            y ordená a gusto.
          </p>
        )}
      </header>

      <div className="mt-10">
        <ProductosFilters telas={telasCats} insumos={insumosCats} />
      </div>

      {pageItems.length > 0 ? (
        <>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
            {pageItems.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
          <Pagination
            basePath="/productos"
            current={current}
            totalPages={totalPages}
            params={{
              q: q || undefined,
              categoria: categoriaSlug,
              orden,
            }}
          />
        </>
      ) : (
        <div className="mt-12 rounded-sm border border-dashed border-line py-20 text-center">
          <p className="font-mono text-sm text-taupe">
            No encontramos productos con esos criterios.
          </p>
        </div>
      )}
    </main>
  );
}
