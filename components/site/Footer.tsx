import Link from "next/link";
import { SITE } from "@/lib/site";

const catalogo = [
  { href: "/telas", label: "Telas" },
  { href: "/insumos", label: "Insumos para toldos" },
  { href: "/productos", label: "Todos los productos" },
];

const aplicaciones = [
  { href: "/telas?aplicacion=toldos", label: "Toldos y Pérgolas" },
  { href: "/telas?aplicacion=nautica", label: "Náutica" },
  { href: "/telas?aplicacion=tapiceria-exterior", label: "Mobiliario exterior" },
];

function Col({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-camel-soft">
        {titulo}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-espresso text-cream">
      {/* CTA */}
      <div className="border-b border-cream/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-[clamp(20px,5vw,80px)] py-14 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[18ch] font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] leading-[1.08]">
            ¿Buscás una lona o un repuesto puntual?
          </p>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-camel px-7 text-sm font-medium text-paper transition-colors hover:bg-camel-soft"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3-.8-2.5-1.1-4.1-3.7-4.2-3.9-.1-.2-1-1.3-1-2.5s.6-1.8.8-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.2 1.6 1.9 1.1.9 1.9 1.2 2.2 1.3.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.3.1.7-.1 1.2Z" />
            </svg>
            Escribinos por WhatsApp
          </a>
        </div>
      </div>

      {/* Columnas */}
      <div className="mx-auto grid max-w-[1280px] gap-10 px-[clamp(20px,5vw,80px)] py-16 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <span className="font-sans text-lg font-semibold uppercase tracking-[0.18em] text-cream">
            Euro<span className="text-camel-soft">lonas</span>
          </span>
          <p className="mt-4 max-w-[34ch] text-sm text-cream/65">
            Distribuidor oficial de lonas técnicas Sauleda en Argentina. Telas e
            insumos para toldos, tapicería exterior y náutica.
          </p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-cream/70 transition-colors hover:text-camel-soft"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Instagram
          </a>
        </div>

        <Col titulo="Catálogo">
          {catalogo.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-cream/80 transition-colors hover:text-camel-soft"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </Col>

        <Col titulo="Aplicaciones">
          {aplicaciones.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-cream/80 transition-colors hover:text-camel-soft"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </Col>

        <Col titulo="Contacto">
          <li>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/80 transition-colors hover:text-camel-soft"
            >
              WhatsApp
            </a>
          </li>
          <li>
            <a
              href={`mailto:${SITE.email}`}
              className="text-cream/80 transition-colors hover:text-camel-soft"
            >
              {SITE.email}
            </a>
          </li>
        </Col>
      </div>

      {/* Legal */}
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-[clamp(20px,5vw,80px)] py-6 font-mono text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Eurolonas · Representante oficial Sauleda</span>
          <span>Hecho por Qvanta</span>
        </div>
      </div>
    </footer>
  );
}
