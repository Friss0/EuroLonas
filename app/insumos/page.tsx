import { Catalogo } from "@/components/catalog/Catalogo";

export const metadata = {
  title: "Insumos para toldos — Eurolonas",
  description:
    "Tubos, brazos, motores, calotas y todo lo necesario para armar y reparar toldos.",
};

export default async function InsumosPage({
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
  return <Catalogo rubroSlug="insumos" params={params} />;
}
