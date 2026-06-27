import { Catalogo } from "@/components/catalog/Catalogo";

export const metadata = {
  title: "Telas — Eurolonas",
  description:
    "Lonas acrílicas Sauleda, Soltis y Cristal PVC. Elegí color y comprá por metro o por rollo.",
};

export default async function TelasPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string;
    aplicacion?: string;
    orden?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  return <Catalogo rubroSlug="telas" params={params} />;
}
