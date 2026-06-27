"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const field =
  "w-full border-b border-line bg-transparent pb-2 pt-1 text-bark outline-none transition-colors placeholder:text-taupe/40 focus:border-camel";
const label = "font-mono text-[11px] uppercase tracking-[0.18em] text-cocoa";

/**
 * Formulario de contacto (reutilizable). Sin backend de email: arma el mensaje
 * y lo abre en WhatsApp. Todos los campos llevan id/name/autocomplete.
 */
export function ContactFormFields() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
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
    const texto =
      `Hola Eurolonas, soy ${nombre}.` +
      (telefono.trim() ? ` Mi teléfono: ${telefono}.` : "") +
      `\n\n${mensaje}\n\nMi email: ${email}`;
    window.open(
      `${SITE.whatsappUrl}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener",
    );
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <div className="grid gap-7 sm:grid-cols-2">
        <label htmlFor="contacto-nombre" className="block space-y-2">
          <span className={label}>Nombre completo</span>
          <input
            id="contacto-nombre"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            type="text"
            autoComplete="name"
            placeholder="Tu nombre"
            className={field}
          />
        </label>
        <label htmlFor="contacto-email" className="block space-y-2">
          <span className={label}>Email</span>
          <input
            id="contacto-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="vos@email.com"
            className={field}
          />
        </label>
        <label
          htmlFor="contacto-telefono"
          className="block space-y-2 sm:col-span-2"
        >
          <span className={label}>
            Teléfono <span className="text-taupe/60">(opcional)</span>
          </span>
          <input
            id="contacto-telefono"
            name="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            type="tel"
            autoComplete="tel"
            placeholder="+54 9 11 ..."
            className={field}
          />
        </label>
      </div>

      <label htmlFor="contacto-mensaje" className="block space-y-2">
        <span className={label}>Mensaje</span>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={5}
          placeholder="Contanos qué necesitás —metros, color, una reparación—"
          className={`${field} resize-none`}
        />
      </label>

      <div className="flex items-start gap-3 text-sm text-taupe">
        <input
          id="contacto-acepta"
          name="acepta"
          type="checkbox"
          checked={acepta}
          onChange={(e) => setAcepta(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#a97c54]"
        />
        <label htmlFor="contacto-acepta">
          Acepto el tratamiento de mis datos para responder esta consulta.
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={!valido}
          className="flex h-12 items-center justify-center rounded-full bg-espresso px-8 text-sm font-medium text-cream transition enabled:hover:bg-bark disabled:cursor-not-allowed disabled:opacity-40"
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
  );
}
