import { createClient } from "@/lib/supabase/server";
import type { Rubro, Categoria, Aplicacion, Producto, Variante } from "@/lib/types";

export type ProductoConVariantes = Producto & {
  rubro: Pick<Rubro, "nombre" | "slug"> | null;
  categoria: Pick<Categoria, "id" | "nombre" | "slug"> | null;
  variantes: Variante[];
  aplicaciones: Pick<Aplicacion, "id" | "nombre" | "slug">[];
};

type RawProducto = Producto & {
  rubro: Pick<Rubro, "nombre" | "slug"> | null;
  categoria: Pick<Categoria, "id" | "nombre" | "slug"> | null;
  variantes: Variante[] | null;
  aplicaciones:
    | { aplicacion: Pick<Aplicacion, "id" | "nombre" | "slug"> | null }[]
    | null;
};

const PRODUCTO_SELECT = `
  id, codigo, nombre, slug, rubro_id, categoria_id, descripcion, ficha_tecnica, specs,
  precio_base, unidad_venta, imagenes, fotos_referencia, destacado, activo, orden, created_at,
  rubro:rubros ( nombre, slug ),
  categoria:categorias ( id, nombre, slug ),
  variantes ( id, producto_id, tipo, nombre, codigo, swatch_url, swatch_hex, sku, precio_override, stock, activo, orden ),
  aplicaciones:producto_aplicacion ( aplicacion:aplicaciones ( id, nombre, slug ) )
`;

function mapProducto(row: RawProducto): ProductoConVariantes {
  return {
    ...row,
    rubro: row.rubro ?? null,
    categoria: row.categoria ?? null,
    variantes: (row.variantes ?? [])
      .slice()
      .sort((a, b) => a.orden - b.orden),
    aplicaciones: (row.aplicaciones ?? [])
      .map((x) => x.aplicacion)
      .filter((a): a is Pick<Aplicacion, "id" | "nombre" | "slug"> => a != null),
  };
}

export async function getRubros(): Promise<Rubro[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("rubros").select("*").order("nombre");
  return data ?? [];
}

export async function getRubroBySlug(slug: string): Promise<Rubro | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rubros")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getCategorias(rubroId: string): Promise<Categoria[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categorias")
    .select("*")
    .eq("rubro_id", rubroId)
    .order("orden");
  return data ?? [];
}

export async function getAplicaciones(): Promise<Aplicacion[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("aplicaciones")
    .select("*")
    .order("nombre");
  return data ?? [];
}

export async function getProductosByRubro(
  rubroSlug: string,
): Promise<ProductoConVariantes[]> {
  const supabase = await createClient();
  const rubro = await getRubroBySlug(rubroSlug);
  if (!rubro) return [];
  const { data } = await supabase
    .from("productos")
    .select(PRODUCTO_SELECT)
    .eq("rubro_id", rubro.id)
    .eq("activo", true)
    .order("orden");
  return ((data ?? []) as unknown as RawProducto[]).map(mapProducto);
}

/** Productos de una aplicación (náutica / toldos / tapicería exterior). */
export async function getProductosByAplicacion(
  aplicacionSlug: string,
): Promise<ProductoConVariantes[]> {
  const supabase = await createClient();
  const { data: app } = await supabase
    .from("aplicaciones")
    .select("id")
    .eq("slug", aplicacionSlug)
    .maybeSingle();
  if (!app) return [];
  const { data: pa } = await supabase
    .from("producto_aplicacion")
    .select("producto_id")
    .eq("aplicacion_id", app.id);
  const ids = (pa ?? []).map((x) => x.producto_id as string);
  if (!ids.length) return [];
  const { data } = await supabase
    .from("productos")
    .select(PRODUCTO_SELECT)
    .in("id", ids)
    .eq("activo", true)
    .order("orden");
  return ((data ?? []) as unknown as RawProducto[]).map(mapProducto);
}

export async function getProductoBySlug(
  slug: string,
): Promise<ProductoConVariantes | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select(PRODUCTO_SELECT)
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();
  return data ? mapProducto(data as unknown as RawProducto) : null;
}

export async function getDestacados(
  limit = 4,
): Promise<ProductoConVariantes[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select(PRODUCTO_SELECT)
    .eq("activo", true)
    .eq("destacado", true)
    .order("orden")
    .limit(limit);
  return ((data ?? []) as unknown as RawProducto[]).map(mapProducto);
}

/** Todos los productos activos (para el listado /productos; el filtrado se hace en memoria). */
export async function getAllProductos(): Promise<ProductoConVariantes[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select(PRODUCTO_SELECT)
    .eq("activo", true)
    .order("orden");
  return ((data ?? []) as unknown as RawProducto[]).map(mapProducto);
}

export type CategoriaConRubro = Categoria & {
  rubro: Pick<Rubro, "slug" | "nombre"> | null;
};

/** Todas las categorías, con el rubro al que pertenecen (para los filtros del listado). */
export async function getAllCategorias(): Promise<CategoriaConRubro[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categorias")
    .select("*, rubro:rubros ( slug, nombre )")
    .order("orden");
  return (data ?? []) as unknown as CategoriaConRubro[];
}

export type ProductoMenu = {
  id: string;
  nombre: string;
  slug: string;
};

/** Telas activas para el mega-menú de "Productos" (liviano). */
export async function getProductosMenu(): Promise<ProductoMenu[]> {
  const supabase = await createClient();
  const rubro = await getRubroBySlug("telas");
  if (!rubro) return [];
  const { data } = await supabase
    .from("productos")
    .select("id, nombre, slug")
    .eq("rubro_id", rubro.id)
    .eq("activo", true)
    .order("orden");
  return (data ?? []) as unknown as ProductoMenu[];
}

export type PedidoConItems = {
  id: string;
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
      producto: { nombre: string; slug: string } | null;
    } | null;
  }[];
};

/** Pedidos del usuario autenticado (con sus líneas). RLS limita a los propios. */
export async function getMisPedidos(): Promise<PedidoConItems[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("pedidos")
    .select(
      `id, total, estado, created_at,
       pedido_items ( id, cantidad, precio_unitario,
         variante:variantes ( nombre, codigo, producto:productos ( nombre, slug ) ) )`,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as PedidoConItems[];
}
