import type { UnidadVenta } from "@/lib/types";

const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** Formatea un precio en pesos. Si no hay precio, devuelve "Consultar". */
export function formatPrecio(n: number | null | undefined): string {
  if (n == null || n === 0) return "Consultar";
  return ars.format(n);
}

/** Sufijo de unidad para mostrar junto al precio (ej. "/ m"). */
export function unidadSufijo(u: UnidadVenta): string {
  switch (u) {
    case "metro":
      return "/ m";
    case "rollo":
      return "/ rollo";
    case "juego":
      return "/ juego";
    case "unidad":
    default:
      return "c/u";
  }
}

/** Etiqueta legible de la unidad de venta. */
export function unidadLabel(u: UnidadVenta): string {
  switch (u) {
    case "metro":
      return "por metro lineal";
    case "rollo":
      return "por rollo";
    case "juego":
      return "por juego";
    case "unidad":
    default:
      return "por unidad";
  }
}

/** Cómo se cuenta la cantidad en el carrito según la unidad. */
export function unidadCantidad(u: UnidadVenta): { label: string; step: number; min: number } {
  if (u === "metro") return { label: "metros", step: 0.5, min: 0.5 };
  return { label: "cantidad", step: 1, min: 1 };
}

/** Normaliza texto para búsqueda: sin acentos, en minúsculas. */
export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

type PrecioVariante = { precio_override: number | null; activo: boolean };

/** Precio mínimo "desde": el más barato entre las variantes activas (o el precio base). */
export function precioDesde(
  precioBase: number | null,
  variantes: PrecioVariante[],
): number | null {
  const precios = variantes
    .filter((v) => v.activo)
    .map((v) => v.precio_override ?? precioBase)
    .filter((n): n is number => n != null && n > 0);
  if (precios.length) return Math.min(...precios);
  return precioBase;
}

/** Ordena una lista de productos según el criterio elegido en el desplegable. */
export function ordenarProductos<
  T extends {
    nombre: string;
    precio_base: number | null;
    orden: number;
    variantes: PrecioVariante[];
  },
>(items: T[], orden?: string): T[] {
  const arr = items.slice();
  const precio = (p: T) => precioDesde(p.precio_base, p.variantes);
  switch (orden) {
    case "precio-asc":
      return arr.sort((a, b) => (precio(a) ?? Infinity) - (precio(b) ?? Infinity));
    case "precio-desc":
      return arr.sort((a, b) => (precio(b) ?? -Infinity) - (precio(a) ?? -Infinity));
    case "nombre-az":
      return arr.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    case "nombre-za":
      return arr.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
    default:
      return arr.sort((a, b) => a.orden - b.orden);
  }
}

/** Genera un slug URL-friendly a partir de un texto. */
export function slugify(s: string): string {
  return (
    normalizar(s)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "producto"
  );
}

/** Opciones del desplegable de ordenamiento (compartidas). */
export const ORDEN_OPCIONES = [
  { value: "", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre-az", label: "Nombre: A → Z" },
  { value: "nombre-za", label: "Nombre: Z → A" },
] as const;
