// Integración modular con Mercado Pago (Checkout Pro), vía REST API.
// Si MP_ACCESS_TOKEN no está seteado, todo queda inactivo y el checkout sigue
// funcionando sin pago online.

const MP_API = "https://api.mercadopago.com";

export function mpEnabled(): boolean {
  return !!process.env.MP_ACCESS_TOKEN;
}

export type PrefItem = { title: string; quantity: number; unitPrice: number };

/** Crea una preferencia de pago y devuelve el init_point (URL del checkout). */
export async function createPreference(opts: {
  pedidoId: string;
  items: PrefItem[];
  payer: { name?: string; email?: string };
  baseUrl: string;
}): Promise<{ initPoint: string } | null> {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return null;

  // auto_return y el webhook requieren una URL pública (https), no localhost.
  const isPublic = opts.baseUrl.startsWith("https://");
  const back = `${opts.baseUrl}/checkout/gracias`;

  const body: Record<string, unknown> = {
    items: opts.items.map((i, idx) => ({
      id: String(idx),
      title: i.title.slice(0, 250),
      quantity: i.quantity,
      unit_price: i.unitPrice,
      currency_id: "ARS",
    })),
    payer: { name: opts.payer.name, email: opts.payer.email },
    external_reference: opts.pedidoId,
    back_urls: { success: back, pending: back, failure: back },
    statement_descriptor: "EUROLONAS",
  };
  if (isPublic) {
    body.auto_return = "approved";
    body.notification_url = `${opts.baseUrl}/api/mp/webhook`;
  }

  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error("MP createPreference:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { init_point?: string };
  return data.init_point ? { initPoint: data.init_point } : null;
}

/** Trae un pago por id (para el webhook). */
export async function getPayment(paymentId: string): Promise<{
  id: string;
  status: string;
  externalReference: string | null;
} | null> {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return null;
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    id: number | string;
    status: string;
    external_reference?: string | null;
  };
  return {
    id: String(data.id),
    status: data.status,
    externalReference: data.external_reference ?? null,
  };
}

export type EstadoPago = "pagado" | "pendiente" | "cancelado";

/** Mapea el status de MP a nuestro estado de pedido. */
export function estadoFromMP(status: string): EstadoPago {
  if (status === "approved") return "pagado";
  if (["rejected", "cancelled", "refunded", "charged_back"].includes(status))
    return "cancelado";
  return "pendiente"; // pending, in_process, authorized, etc.
}
