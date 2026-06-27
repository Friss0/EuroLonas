import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductoBySlug } from "@/lib/queries";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductSections } from "@/components/product/ProductSections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) return { title: "Producto — Eurolonas" };
  return {
    title: `${producto.nombre} — Eurolonas`,
    description: producto.descripcion ?? undefined,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) notFound();

  const rubroHref = producto.rubro?.slug ? `/${producto.rubro.slug}` : "/";

  return (
    <main className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] pb-24 pt-8">
      <nav
        aria-label="Migas de pan"
        className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-taupe"
      >
        <Link href="/" className="hover:text-camel">
          Inicio
        </Link>
        <span aria-hidden>/</span>
        {producto.rubro && (
          <>
            <Link href={rubroHref} className="hover:text-camel">
              {producto.rubro.nombre}
            </Link>
            <span aria-hidden>/</span>
          </>
        )}
        <span className="text-bark">{producto.nombre}</span>
      </nav>

      <ProductPurchase producto={producto} />
      <ProductSections producto={producto} />
    </main>
  );
}
