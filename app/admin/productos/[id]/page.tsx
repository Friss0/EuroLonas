import { notFound } from "next/navigation";
import {
  getOpcionesForm,
  getProductoAdminById,
  contarDestacados,
} from "@/lib/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditarProducto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [opciones, producto, destacadosCount] = await Promise.all([
    getOpcionesForm(),
    getProductoAdminById(id),
    contarDestacados(id),
  ]);
  if (!producto) notFound();
  return (
    <ProductForm
      opciones={opciones}
      producto={producto}
      destacadosCount={destacadosCount}
    />
  );
}
