import Link from "next/link";
import { ClearCart } from "@/components/checkout/ClearCart";

export const metadata = { title: "Pedido — Eurolonas" };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const pick = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const status = pick("status") ?? pick("collection_status");

  const variant =
    status === "approved"
      ? "approved"
      : status === "pending" || status === "in_process"
        ? "pending"
        : status === "rejected" ||
            status === "failure" ||
            status === "cancelled"
          ? "rejected"
          : "registrado";

  const limpiar = variant === "approved" || variant === "pending";

  const data = {
    approved: {
      title: "¡Pago aprobado!",
      text: "Recibimos tu pago. Preparamos tu pedido y te escribimos para coordinar la entrega.",
      tone: "ok" as const,
    },
    pending: {
      title: "Pago pendiente",
      text: "Tu pago está en proceso (puede demorar si elegiste efectivo o transferencia). Te avisamos apenas se acredite.",
      tone: "wait" as const,
    },
    rejected: {
      title: "El pago no se completó",
      text: "No pudimos procesar el pago. Podés intentarlo de nuevo o coordinar con nosotros por WhatsApp.",
      tone: "error" as const,
    },
    registrado: {
      title: "¡Listo! Registramos tu pedido.",
      text: "Lo coordinamos con vos por WhatsApp para el pago y la entrega.",
      tone: "ok" as const,
    },
  }[variant];

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[560px] flex-col justify-center px-[clamp(20px,5vw,40px)] py-16 text-center">
      {limpiar && <ClearCart />}

      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
          data.tone === "error"
            ? "bg-[#b5483d]/12 text-[#b5483d]"
            : "bg-camel/15 text-camel"
        }`}
        aria-hidden
      >
        {data.tone === "error" ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : data.tone === "wait" ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>

      <h1 className="mt-6 font-display text-[clamp(2rem,1.6rem+1.6vw,2.8rem)] leading-tight text-espresso">
        {data.title}
      </h1>
      <p className="mt-4 text-taupe">{data.text}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {variant === "rejected" ? (
          <Link
            href="/checkout"
            className="flex h-12 items-center rounded-sm bg-espresso px-7 text-sm font-medium text-cream transition-colors hover:bg-bark"
          >
            Reintentar
          </Link>
        ) : (
          <Link
            href="/perfil"
            className="flex h-12 items-center rounded-sm bg-espresso px-7 text-sm font-medium text-cream transition-colors hover:bg-bark"
          >
            Ver mis pedidos
          </Link>
        )}
        <Link
          href="/productos"
          className="flex h-12 items-center rounded-sm border border-line px-7 text-sm font-medium text-bark transition-colors hover:border-camel hover:text-camel"
        >
          Seguir comprando
        </Link>
      </div>
    </main>
  );
}
