import Link from "next/link";
import { SITE } from "@/lib/site";

// Cierre del home: CTA hacia la página de contacto (el formulario vive en /contacto).
export function ContactForm() {
  return (
    <section
      id="contacto"
      className="scroll-mt-20 border-t border-line bg-cream"
    >
      <div className="mx-auto max-w-[820px] px-[clamp(20px,5vw,80px)] py-[clamp(56px,8vw,128px)] text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Contacto
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] leading-[1.05] text-espresso">
          ¿Tenés un proyecto en mente?
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-taupe">
          Contanos qué necesitás —metros, color, una reparación— y te ayudamos a
          resolverlo.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contacto"
            className="flex h-12 items-center justify-center rounded-full bg-espresso px-8 text-sm font-medium text-cream transition-colors hover:bg-bark"
          >
            Contactanos
          </Link>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-line px-7 text-sm font-medium text-bark transition-colors hover:border-camel hover:text-camel"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm5.5 14.1c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3-.8-2.5-1.1-4.1-3.7-4.2-3.9-.1-.2-1-1.3-1-2.5s.6-1.8.8-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.2 1.6 1.9 1.1.9 1.9 1.2 2.2 1.3.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.3.1.7-.1 1.2Z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
