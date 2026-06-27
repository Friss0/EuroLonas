"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/format";

type Resultado = { ok: true } | { error: string };

export type VarianteInput = {
  id?: string;
  tipo: string;
  nombre: string;
  codigo: string | null;
  swatch_hex: string | null;
  swatch_url: string | null;
  sku: string | null;
  precio_override: number | null;
  stock: number | null;
  activo: boolean;
  orden: number;
};

export type ProductoInput = {
  id?: string;
  nombre: string;
  codigo: string | null;
  rubro_id: string;
  categoria_id: string | null;
  descripcion: string | null;
  ficha_tecnica: string | null;
  precio_base: number | null;
  unidad_venta: string;
  imagenes: string[];
  fotos_referencia: string[];
  destacado: boolean;
  activo: boolean;
  orden: number;
  aplicaciones: string[];
  variantes: VarianteInput[];
};

export async function guardarProducto(
  input: ProductoInput,
): Promise<{ ok: true; id: string } | { error: string }> {
  const supabase = await createClient();

  if (!input.nombre.trim()) return { error: "El nombre es obligatorio." };
  if (!input.rubro_id) return { error: "Elegí un rubro." };

  // Máximo 4 productos destacados.
  if (input.destacado) {
    let q = supabase
      .from("productos")
      .select("id", { count: "exact", head: true })
      .eq("destacado", true);
    if (input.id) q = q.neq("id", input.id);
    const { count } = await q;
    if ((count ?? 0) >= 4)
      return {
        error:
          "Ya hay 4 productos destacados. Quitá uno antes de destacar este.",
      };
  }

  const campos = {
    nombre: input.nombre.trim(),
    codigo: input.codigo,
    rubro_id: input.rubro_id,
    categoria_id: input.categoria_id,
    descripcion: input.descripcion,
    ficha_tecnica: input.ficha_tecnica,
    precio_base: input.precio_base,
    unidad_venta: input.unidad_venta,
    imagenes: input.imagenes,
    fotos_referencia: input.fotos_referencia,
    destacado: input.destacado,
    activo: input.activo,
    orden: input.orden,
  };

  let productoId = input.id;

  if (productoId) {
    const { error } = await supabase
      .from("productos")
      .update(campos)
      .eq("id", productoId);
    if (error) return { error: "No se pudo actualizar el producto." };
  } else {
    const base = slugify(input.nombre);
    let slug = base;
    let intento = await supabase
      .from("productos")
      .insert({ ...campos, slug })
      .select("id")
      .single();
    if (intento.error) {
      // probable colisión de slug → reintentar con sufijo
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      intento = await supabase
        .from("productos")
        .insert({ ...campos, slug })
        .select("id")
        .single();
      if (intento.error) return { error: "No se pudo crear el producto." };
    }
    productoId = intento.data!.id;
  }

  // ── Variantes: actualizar existentes, insertar nuevas, borrar/desactivar las quitadas
  const { data: existentes } = await supabase
    .from("variantes")
    .select("id")
    .eq("producto_id", productoId);
  const idsExistentes = (existentes ?? []).map((v) => v.id as string);
  const idsEnviados = input.variantes
    .map((v) => v.id)
    .filter((id): id is string => !!id);
  const aBorrar = idsExistentes.filter((id) => !idsEnviados.includes(id));

  for (const id of aBorrar) {
    const { error } = await supabase.from("variantes").delete().eq("id", id);
    if (error)
      await supabase.from("variantes").update({ activo: false }).eq("id", id);
  }

  for (const v of input.variantes) {
    if (!v.nombre.trim()) continue;
    const fila = {
      producto_id: productoId,
      tipo: v.tipo,
      nombre: v.nombre.trim(),
      codigo: v.codigo,
      swatch_hex: v.swatch_hex,
      swatch_url: v.swatch_url,
      sku: v.sku,
      precio_override: v.precio_override,
      stock: v.stock,
      activo: v.activo,
      orden: v.orden,
    };
    if (v.id) await supabase.from("variantes").update(fila).eq("id", v.id);
    else await supabase.from("variantes").insert(fila);
  }

  // ── Aplicaciones (many-to-many): reemplazar el set
  await supabase
    .from("producto_aplicacion")
    .delete()
    .eq("producto_id", productoId);
  if (input.aplicaciones.length) {
    await supabase.from("producto_aplicacion").insert(
      input.aplicaciones.map((aid) => ({
        producto_id: productoId,
        aplicacion_id: aid,
      })),
    );
  }

  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/telas");
  revalidatePath("/insumos");
  return { ok: true, id: productoId! };
}

/** Borra un producto (sus variantes caen en cascada). Si una variante está en
 *  un pedido, no se puede borrar: en ese caso se desactiva el producto. */
export async function eliminarProducto(id: string): Promise<Resultado> {
  const supabase = await createClient();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) {
    const { error: e2 } = await supabase
      .from("productos")
      .update({ activo: false })
      .eq("id", id);
    if (e2) return { error: "No se pudo borrar ni desactivar el producto." };
    revalidatePath("/admin/productos");
    return {
      error:
        "El producto tiene variantes en pedidos, así que no se puede borrar. Lo desactivamos.",
    };
  }
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  return { ok: true };
}

const ESTADOS = [
  "pendiente",
  "pagado",
  "preparando",
  "enviado",
  "cancelado",
] as const;

export async function cambiarEstadoPedido(
  id: string,
  estado: string,
): Promise<Resultado> {
  if (!ESTADOS.includes(estado as (typeof ESTADOS)[number]))
    return { error: "Estado inválido." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("pedidos")
    .update({ estado })
    .eq("id", id);
  if (error) return { error: "No se pudo actualizar el estado." };
  revalidatePath("/admin/pedidos");
  return { ok: true };
}
