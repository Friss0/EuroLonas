import { createClient } from "@/lib/supabase/server";
import type { Producto, Variante } from "@/lib/types";

export type OpcionRubro = { id: string; nombre: string; slug: string };
export type OpcionCategoria = {
  id: string;
  nombre: string;
  slug: string;
  rubro_id: string;
};
export type OpcionAplicacion = { id: string; nombre: string; slug: string };

export async function getOpcionesForm(): Promise<{
  rubros: OpcionRubro[];
  categorias: OpcionCategoria[];
  aplicaciones: OpcionAplicacion[];
}> {
  const supabase = await createClient();
  const [rubros, categorias, aplicaciones] = await Promise.all([
    supabase.from("rubros").select("id, nombre, slug").order("nombre"),
    supabase
      .from("categorias")
      .select("id, nombre, slug, rubro_id")
      .order("orden"),
    supabase.from("aplicaciones").select("id, nombre, slug").order("nombre"),
  ]);
  return {
    rubros: (rubros.data ?? []) as OpcionRubro[],
    categorias: (categorias.data ?? []) as OpcionCategoria[],
    aplicaciones: (aplicaciones.data ?? []) as OpcionAplicacion[],
  };
}

export type ProductoEdit = Producto & {
  variantes: Variante[];
  producto_aplicacion: { aplicacion_id: string }[];
};

export async function getProductoAdminById(
  id: string,
): Promise<ProductoEdit | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select("*, variantes(*), producto_aplicacion(aplicacion_id)")
    .eq("id", id)
    .maybeSingle();
  return (data as unknown as ProductoEdit) ?? null;
}

export type ProductoAdmin = {
  id: string;
  nombre: string;
  codigo: string | null;
  precio_base: number | null;
  unidad_venta: string;
  activo: boolean;
  destacado: boolean;
  orden: number;
  rubro: { nombre: string } | null;
  categoria: { nombre: string } | null;
};

export async function getProductosAdmin(): Promise<ProductoAdmin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select(
      "id, nombre, codigo, precio_base, unidad_venta, activo, destacado, orden, rubro:rubros(nombre), categoria:categorias(nombre)",
    )
    .order("orden");
  return (data ?? []) as unknown as ProductoAdmin[];
}

export type PedidoAdmin = {
  id: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string | null;
  total: number;
  estado: string;
  created_at: string;
  pedido_items: {
    id: string;
    cantidad: number;
    precio_unitario: number;
    variante: {
      nombre: string;
      codigo: string | null;
      producto: { id: string; nombre: string } | null;
    } | null;
  }[];
};

export async function getPedidosAdmin(): Promise<PedidoAdmin[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pedidos")
    .select(
      `id, cliente_nombre, cliente_email, cliente_telefono, total, estado, created_at,
       pedido_items ( id, cantidad, precio_unitario,
         variante:variantes ( nombre, codigo, producto:productos ( id, nombre ) ) )`,
    )
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as PedidoAdmin[];
}

/** Cuenta los productos destacados (opcionalmente excluyendo uno, p/ edición). */
export async function contarDestacados(excludeId?: string): Promise<number> {
  const supabase = await createClient();
  let q = supabase
    .from("productos")
    .select("id", { count: "exact", head: true })
    .eq("destacado", true);
  if (excludeId) q = q.neq("id", excludeId);
  const { count } = await q;
  return count ?? 0;
}

export const MAX_DESTACADOS = 4;

export async function getDashboardStats() {
  const supabase = await createClient();
  const [productos, pedidos, pendientes] = await Promise.all([
    supabase.from("productos").select("*", { count: "exact", head: true }),
    supabase.from("pedidos").select("*", { count: "exact", head: true }),
    supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("estado", "pendiente"),
  ]);
  return {
    productos: productos.count ?? 0,
    pedidos: pedidos.count ?? 0,
    pendientes: pendientes.count ?? 0,
  };
}
