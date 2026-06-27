import { notFound } from "next/navigation";
import { getAplicacionPage } from "@/lib/aplicaciones";
import { getProductosByAplicacion } from "@/lib/queries";
import { AplicacionHero } from "@/components/aplicaciones/AplicacionHero";
import { AplicacionProductGrid } from "@/components/aplicaciones/AplicacionProductGrid";
import { CategoryContent } from "@/components/aplicaciones/CategoryContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = getAplicacionPage(slug);
  if (!app) return { title: "Aplicación — Eurolonas" };
  return {
    title: `${app.nombre} — Eurolonas`,
    description: app.acercaDe.texto,
  };
}

export default async function AplicacionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = getAplicacionPage(slug);
  if (!app) notFound();

  const productos = await getProductosByAplicacion(app.aplicacionSlug);

  return (
    <main style={{ "--accent": app.accent } as React.CSSProperties}>
      <AplicacionHero app={app} />
      <AplicacionProductGrid productos={productos} />
      <CategoryContent bloques={app.seo.bloques} />
    </main>
  );
}
