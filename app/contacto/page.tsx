import type { Metadata } from "next";
import { ContactFormFields } from "@/components/contact/ContactFormFields";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto — Eurolonas",
  description:
    "Escribinos tu consulta sobre lonas Sauleda, telas por metro o insumos para toldos. Te respondemos a la brevedad.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-[clamp(20px,5vw,80px)] pb-24 pt-12">
      <header className="max-w-[60ch]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Contacto
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,1.6rem+3vw,4rem)] leading-[1.02] text-espresso">
          Hablemos de tu proyecto
        </h1>
        <p className="mt-4 max-w-[52ch] text-taupe">
          Contanos qué necesitás —metros, color, una reparación— y te
          respondemos a la brevedad.
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
        <ContactFormFields />

        <aside className="space-y-8 lg:border-l lg:border-line lg:pl-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cocoa">
              Directo
            </p>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-bark transition-colors hover:text-camel"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3-.8-2.5-1.1-4.1-3.7-4.2-3.9-.1-.2-1-1.3-1-2.5s.6-1.8.8-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.2 1.6 1.9 1.1.9 1.9 1.2 2.2 1.3.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.3.1.7-.1 1.2Z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 text-bark transition-colors hover:text-camel"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-bark transition-colors hover:text-camel"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <p className="max-w-[34ch] text-xs leading-relaxed text-taupe">
            Atendemos a toldistas, astilleros y particulares en todo el país.
            Distribuidor oficial Sauleda.
          </p>
        </aside>
      </div>
    </main>
  );
}
