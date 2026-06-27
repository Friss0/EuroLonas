import Link from "next/link";

export const metadata = { title: "Pedido registrado — Eurolonas" };

export default function GraciasPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[560px] flex-col justify-center px-[clamp(20px,5vw,40px)] py-16 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-camel/15 text-camel"
        aria-hidden
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-[clamp(2rem,1.6rem+1.6vw,2.8rem)] leading-tight text-espresso">
        ¡Listo! Registramos tu pedido.
      </h1>
      <p className="mt-4 text-taupe">
        Lo coordinamos con vos por WhatsApp para el pago y la entrega. El pago
        online (Mercado Pago) se activa pronto.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/perfil"
          className="flex h-12 items-center rounded-sm bg-espresso px-7 text-sm font-medium text-cream transition-colors hover:bg-bark"
        >
          Ver mis pedidos
        </Link>
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
