// Tipos de dominio de Eurolonas. Reflejan el modelo de datos de supabase/migrations/.
// Los tipos generados por Supabase (`supabase gen types typescript`) se agregan una vez
// aplicada la migración; mientras tanto, estos sirven para el sitio público.

export type UnidadVenta = "metro" | "rollo" | "unidad" | "juego";
export type TipoVariante = "color" | "medida" | "modelo";
export type EstadoPedido =
  | "pendiente"
  | "pagado"
  | "preparando"
  | "enviado"
  | "cancelado";

export interface Rubro {
  id: string;
  nombre: string;
  slug: string;
}

export interface Categoria {
  id: string;
  rubro_id: string;
  nombre: string;
  slug: string;
  orden: number;
}

export interface Aplicacion {
  id: string;
  nombre: string;
  slug: string;
}

export interface Producto {
  id: string;
  codigo: string | null;
  nombre: string;
  slug: string;
  rubro_id: string;
  categoria_id: string | null;
  descripcion: string | null;
  ficha_tecnica: string | null;
  specs: Record<string, unknown>;
  precio_base: number | null;
  unidad_venta: UnidadVenta;
  imagenes: string[];
  fotos_referencia: string[];
  destacado: boolean;
  activo: boolean;
  orden: number;
  created_at: string;
}

export interface Variante {
  id: string;
  producto_id: string;
  tipo: TipoVariante;
  nombre: string;
  codigo: string | null;
  swatch_url: string | null;
  swatch_hex: string | null;
  sku: string | null;
  precio_override: number | null;
  stock: number | null;
  activo: boolean;
  orden: number;
}

export interface Pedido {
  id: string;
  user_id: string | null;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string | null;
  total: number;
  estado: EstadoPedido;
  mp_payment_id: string | null;
  created_at: string;
}

export type RolUsuario = "cliente" | "admin";

export interface Profile {
  id: string;
  nombre: string | null;
  telefono: string | null;
  rol: RolUsuario;
  created_at: string;
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  variante_id: string;
  cantidad: number;
  precio_unitario: number;
}

/** Precio efectivo de una variante: override si existe, si no el precio base del producto. */
export function precioEfectivo(
  producto: Pick<Producto, "precio_base">,
  variante: Pick<Variante, "precio_override">,
): number {
  return variante.precio_override ?? producto.precio_base ?? 0;
}
