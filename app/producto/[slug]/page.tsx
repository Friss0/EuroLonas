import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductoBySlug } from "@/lib/queries";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductSections } from "@/components/product/ProductSections";
import { productoThumbnail } from "@/components/product/ProductCard";
import { precioDesde } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) return { title: "Producto — Eurolonas" };
  const img = productoThumbnail(producto);
  const description =
    producto.descripcion ??
    `${producto.nombre} — Sauleda en Eurolonas, distribuidor oficial en Argentina.`;
  return {
    title: `${producto.nombre} — Eurolonas`,
    description,
    alternates: { canonical: `/producto/${producto.slug}` },
    openGraph: {
      type: "website",
      title: producto.nombre,
      description,
      url: `/producto/${producto.slug}`,
      ...(img ? { images: [{ url: img }] } : {}),
    },
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
  const img = productoThumbnail(producto);
  const desde = precioDesde(producto.precio_base, producto.variantes);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    ...(producto.descripcion ? { description: producto.descripcion } : {}),
    ...(producto.codigo ? { sku: producto.codigo } : {}),
    brand: { "@type": "Brand", name: "Sauleda" },
    ...(img ? { image: [img] } : {}),
    ...(desde
      ? {
          offers: {
            "@type": "Offer",
            price: desde,
            priceCurrency: "ARS",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <main className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] pb-24 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
