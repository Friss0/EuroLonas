"use client";
import { useState } from "react";
import { SITE } from "@/lib/site";

export function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [sent, setSent] = useState(false);

  const valido =
    nombre.trim() !== "" &&
    email.trim() !== "" &&
    mensaje.trim() !== "" &&
    acepta;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    const texto = `Hola Eurolonas, soy ${nombre}.\n\n${mensaje}\n\nMi email: ${email}`;
    window.open(
      `${SITE.whatsappUrl}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener",
    );
    setSent(true);
  }

  const inputClass =
    "mt-2 w-full border-b border-line bg-transparent pb-2 text-bark outline-none transition-colors placeholder:text-taupe/50 focus:border-camel";
  const labelClass =
    "font-mono text-xs uppercase tracking-[0.16em] text-cocoa";

  return (
    <section id="contacto" className="scroll-mt-20 border-t border-line bg-cream">
      <div className="mx-auto max-w-[820px] px-[clamp(20px,5vw,80px)] py-[clamp(56px,8vw,128px)]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Contacto
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] leading-[1.05] text-espresso">
          ¿Tenés un proyecto en mente?
        </h2>
        <p className="mt-4 max-w-[52ch] text-taupe">
          Contanos qué necesitás —metros, color, una reparación— y te ayudamos a
          resolverlo. Te respondemos por WhatsApp.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Nombre completo</span>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                autoComplete="name"
                placeholder="Tu nombre"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="vos@email.com"
                className={inputClass}
              />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Mensaje</span>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              placeholder="Contanos qué necesitás"
              className={`${inputClass} resize-none`}
            />
          </label>

          <label className="flex items-start gap-3 text-sm text-taupe">
            <input
              type="checkbox"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#a97c54]"
            />
            <span>
              Leí y acepto el tratamiento de mis datos para responder esta
              consulta.
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={!valido}
              className="flex h-12 items-center justify-center rounded-sm bg-espresso px-8 text-sm font-medium text-cream transition enabled:hover:bg-bark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enviar consulta
            </button>
            {sent && (
              <p className="font-mono text-xs text-camel">
                Te abrimos WhatsApp con tu mensaje. ¡Gracias!
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
