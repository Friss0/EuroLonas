"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { mpEnabled, createPreference } from "@/lib/payments/mercadopago";
import { getSiteUrl } from "@/lib/seo";

type ItemInput = { variantId: string; cantidad: number };

type Resultado =
  | { error: string }
  | { ok: true; pedidoId: string; redirectUrl?: string };

export async function crearPedido(input: {
  items: ItemInput[];
  nombre: string;
  email: string;
  telefono: string;
}): Promise<Resultado> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Tenés que iniciar sesión para finalizar la compra." };
  if (!input.items.length) return { error: "El carrito está vacío." };
  if (!input.nombre.trim() || !input.email.trim())
    return { error: "Completá tu nombre y email." };

  // Recalcular precios en el servidor (no confiar en los del cliente).
  const ids = input.items.map((i) => i.variantId);
  const { data: variantes } = await supabase
    .from("variantes")
    .select("id, nombre, precio_override, producto:productos ( nombre, precio_base )")
    .in("id", ids);

  type V = {
    id: string;
    nombre: string;
    precio_override: number | null;
    producto: { nombre: string; precio_base: number | null } | null;
  };
  const vmap = new Map(
    ((variantes ?? []) as unknown as V[]).map((v) => [v.id, v]),
  );

  let total = 0;
  const itemsToInsert: {
    variante_id: string;
    cantidad: number;
    precio_unitario: number;
  }[] = [];

  for (const it of input.items) {
    const v = vmap.get(it.variantId);
    if (!v || it.cantidad <= 0) continue;
    const precio = v.precio_override ?? v.producto?.precio_base ?? 0;
    total += precio * it.cantidad;
    itemsToInsert.push({
      variante_id: it.variantId,
      cantidad: it.cantidad,
      precio_unitario: precio,
    });
  }

  if (!itemsToInsert.length)
    return { error: "No pudimos validar los productos del carrito." };

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .insert({
      user_id: user.id,
      cliente_nombre: input.nombre,
      cliente_email: input.email,
      cliente_telefono: input.telefono || null,
      total,
      estado: "pendiente",
    })
    .select("id")
    .single();

  if (error || !pedido) return { error: "No se pudo crear el pedido." };

  const { error: e2 } = await supabase
    .from("pedido_items")
    .insert(itemsToInsert.map((i) => ({ ...i, pedido_id: pedido.id })));

  if (e2) return { error: "No se pudieron guardar los ítems del pedido." };

  revalidatePath("/perfil");

  // ── Pago online con Mercado Pago (si está configurado el token) ──
  if (mpEnabled()) {
    const prefItems = itemsToInsert.map((i) => {
      const v = vmap.get(i.variante_id);
      const prod = v?.producto?.nombre ?? "Producto";
      const varName = v?.nombre ? ` — ${v.nombre}` : "";
      return {
        title: `${prod}${varName} (×${i.cantidad})`,
        quantity: 1,
        unitPrice: Math.round(i.precio_unitario * i.cantidad),
      };
    });
    const pref = await createPreference({
      pedidoId: pedido.id,
      items: prefItems,
      payer: { name: input.nombre, email: input.email },
      baseUrl: getSiteUrl(),
    });
    if (pref) {
      return { ok: true, pedidoId: pedido.id, redirectUrl: pref.initPoint };
    }
    // Si MP falla, seguimos con el flujo sin pago online (pedido ya creado).
  }

  return { ok: true, pedidoId: pedido.id };
}
