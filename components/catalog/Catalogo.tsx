import {
  getRubroBySlug,
  getCategorias,
  getAplicaciones,
  getProductosByRubro,
  type ProductoConVariantes,
} from "@/lib/queries";
import type { Categoria, Aplicacion } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { CatalogFilters } from "./CatalogFilters";
import { Pagination } from "./Pagination";
import { SortSelect } from "./SortSelect";
import { ordenarProductos } from "@/lib/format";

const PAGE_SIZE = 9;

const RUBRO_META: Record<string, { nombre: string; desc: string }> = {
  telas: {
    nombre: "Telas",
    desc: "Acrílicas, Soltis y Cristal PVC para toldos, tapicería exterior y náutica. Elegí el color y comprá por metro o por rollo.",
  },
  insumos: {
    nombre: "Insumos para toldos",
    desc: "Tubos, brazos, motores, calotas y todo lo necesario para armar y reparar. Por unidad, juego o metro.",
  },
};

export async function Catalogo({
  rubroSlug,
  params,
}: {
  rubroSlug: "telas" | "insumos";
  params: {
    categoria?: string;
    aplicacion?: string;
    orden?: string;
    page?: string;
  };
}) {
  const meta = RUBRO_META[rubroSlug];
  const rubro = await getRubroBySlug(rubroSlug);

  let categorias: Categoria[] = [];
  let productos: ProductoConVariantes[] = [];
  let aplicaciones: Aplicacion[] = [];

  if (rubro) {
    [categorias, productos, aplicaciones] = await Promise.all([
      getCategorias(rubro.id),
      getProductosByRubro(rubroSlug),
      rubroSlug === "telas" ? getAplicaciones() : Promise.resolve<Aplicacion[]>([]),
    ]);
  }

  let lista = productos;
  if (params.categoria)
    lista = lista.filter((p) => p.categoria?.slug === params.categoria);
  if (params.aplicacion)
    lista = lista.filter((p) =>
      p.aplicaciones.some((a) => a.slug === params.aplicacion),
    );

  lista = ordenarProductos(lista, params.orden);

  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(lista.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = lista.slice(start, start + PAGE_SIZE);

  return (
    <main className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] pb-24 pt-12">
      <header className="max-w-[60ch]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Catálogo
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,1.6rem+3vw,4rem)] leading-[1.02] text-espresso">
          {meta.nombre}
        </h1>
        <p className="mt-4 text-taupe">{meta.desc}</p>
      </header>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <CatalogFilters
          basePath={`/${rubroSlug}`}
          categorias={categorias}
          aplicaciones={aplicaciones}
          active={params}
        />
        <SortSelect />
      </div>

      {pageItems.length > 0 ? (
        <>
          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
          <Pagination
            basePath={`/${rubroSlug}`}
            current={current}
            totalPages={totalPages}
            params={{
              categoria: params.categoria,
              aplicacion: params.aplicacion,
              orden: params.orden,
            }}
          />
        </>
      ) : (
        <div className="mt-12 rounded-sm border border-dashed border-line py-20 text-center">
          <p className="font-mono text-sm text-taupe">
            {rubro
              ? "No hay productos con esos filtros."
              : "Todavía no hay datos. Aplicá las migraciones de Supabase (0001 → 0002 → 0003)."}
          </p>
        </div>
      )}
    </main>
  );
}
