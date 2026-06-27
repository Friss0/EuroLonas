import { getOpcionesForm, contarDestacados } from "@/lib/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NuevoProducto() {
  const [opciones, destacadosCount] = await Promise.all([
    getOpcionesForm(),
    contarDestacados(),
  ]);
  return <ProductForm opciones={opciones} destacadosCount={destacadosCount} />;
}
