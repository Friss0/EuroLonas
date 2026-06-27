import type { Metadata } from "next";
import { ContactFormFields } from "@/components/contact/ContactFormFields";
import { ContactBeamsBg } from "@/components/contact/ContactBeamsBg";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto — Eurolonas",
  description:
    "Escribinos tu consulta sobre lonas Sauleda, telas por metro o insumos para toldos. Te respondemos a la brevedad.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-[clamp(20px,5vw,80px)] py-[clamp(40px,8vw,100px)]">
      {/* Container flotante: mitad título (con fondo animado) + mitad formulario */}
      <div className="grid overflow-hidden rounded-[28px] shadow-[0_34px_90px_-34px_rgba(31,21,14,0.4)] ring-1 ring-line md:grid-cols-2">
        {/* ── Mitad 1: título + fondo animado ── */}
        <div className="relative flex min-h-[340px] flex-col justify-center gap-5 p-[clamp(28px,5vw,56px)] text-paper">
          {/* Fondo animado: Beams (Three.js), con fallback a gradiente. */}
          <ContactBeamsBg />

          <p className="font-mono text-xs uppercase tracking-[0.22em] text-paper/70">
            Contacto
          </p>
          <h1 className="font-display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] leading-[1.05]">
            Hablemos de tu proyecto
          </h1>
          <p className="hidden max-w-[42ch] text-paper/85 md:block">
            Contanos qué necesitás y te responderemos a la brevedad.
          </p>

          <ul className="mt-2 space-y-3 text-sm">
            <li>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-paper/85 transition-colors hover:text-camel-soft"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3-.8-2.5-1.1-4.1-3.7-4.2-3.9-.1-.2-1-1.3-1-2.5s.6-1.8.8-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.2 1.6 1.9 1.1.9 1.9 1.2 2.2 1.3.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.3.1.7-.1 1.2Z" />
                </svg>
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-paper/85 transition-colors hover:text-camel-soft"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2.5 text-paper/85 transition-colors hover:text-camel-soft"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>

        {/* ── Mitad 2: formulario ── */}
        <div className="bg-paper p-[clamp(28px,5vw,56px)]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-camel">
            Escribinos
          </p>
          <div className="mt-6">
            <ContactFormFields />
          </div>
        </div>
      </div>
    </main>
  );
}
