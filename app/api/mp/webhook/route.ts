import { NextResponse } from "next/server";
import { getPayment, estadoFromMP } from "@/lib/payments/mercadopago";
import { createServiceClient } from "@/lib/supabase/admin";

// MP verifica la URL con un GET.
export async function GET() {
  return NextResponse.json({ ok: true });
}

// Notificación de Mercado Pago: actualiza el estado del pedido según el pago.
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    let paymentId =
      url.searchParams.get("data.id") || url.searchParams.get("id");
    let topic = url.searchParams.get("type") || url.searchParams.get("topic");

    let body: {
      type?: string;
      action?: string;
      data?: { id?: string | number };
    } | null = null;
    try {
      body = await req.json();
    } catch {
      /* algunas notificaciones vienen sin body JSON */
    }
    if (!paymentId && body?.data?.id != null) paymentId = String(body.data.id);
    if (!topic && body?.type) topic = body.type;

    // Sólo nos interesan los eventos de pago.
    if (topic && topic !== "payment") return NextResponse.json({ ok: true });
    if (!paymentId) return NextResponse.json({ ok: true });

    const pay = await getPayment(paymentId);
    if (!pay || !pay.externalReference) return NextResponse.json({ ok: true });

    const supabase = createServiceClient();
    await supabase
      .from("pedidos")
      .update({ estado: estadoFromMP(pay.status), mp_payment_id: pay.id })
      .eq("id", pay.externalReference);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("MP webhook:", e);
    // 200 igual para que MP no reintente indefinidamente.
    return NextResponse.json({ ok: true });
  }
}
