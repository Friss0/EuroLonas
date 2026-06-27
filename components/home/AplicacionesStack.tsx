"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { APLICACIONES } from "@/lib/aplicaciones";

// Eyebrow corto por aplicación (estilo editorial, como el "Tenero/Szczecin"
// del ejemplo). No vive en el modelo de datos porque es puramente de copy.
const TAGLINES: Record<string, string> = {
  nautica: "Para el agua",
  "toldos-y-pergolas": "Sombra a medida",
  "mobiliario-exterior": "Confort que aguanta",
};

function fotoStyle(slug: string, gradient: string): React.CSSProperties {
  // La foto real cae al gradiente de respaldo mientras no esté subida.
  return { backgroundImage: `url(/aplicaciones/${slug}/hero.jpg), ${gradient}` };
}

function ArrowIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function AplicacionesStack() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    let ticking = false;

    // Card activa = la última cuyo borde superior ya cruzó la línea (~42% vh).
    // Las fijadas tienen top chico; las que faltan están más abajo.
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.42;
      let idx = 0;
      for (let i = 0; i < cardRefs.current.length; i++) {
        const c = cardRefs.current[i];
        if (c && c.getBoundingClientRect().top <= line) idx = i;
      }
      setActive(idx);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(update);

    // Mostrar los puntos solo con la sección en pantalla.
    const sect = sectionRef.current;
    const sectObs = sect
      ? new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
          threshold: 0.04,
        })
      : null;
    if (sect && sectObs) sectObs.observe(sect);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      sectObs?.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Aplicaciones" className="relative bg-cream">
      {/* Encabezado */}
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] pb-[clamp(20px,3vw,40px)] pt-[clamp(40px,6vw,84px)]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Aplicaciones
        </p>
        <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] leading-[1.05] text-espresso">
          Una lona para cada uso.
        </h2>
      </div>

      {/* Stack con márgenes laterales (estilo Serge Ferrari) */}
      <div className="px-[clamp(20px,7vw,160px)] pb-[clamp(48px,10vw,160px)]">
        {APLICACIONES.map((app, i) => (
          <article
            key={app.slug}
            data-idx={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="sticky"
            style={{ top: `${72 + i * 16}px`, zIndex: 10 + i }}
          >
            <Link
              href={`/aplicaciones/${app.slug}`}
              className="group relative block h-[78svh] max-h-[780px] w-full overflow-hidden rounded-[clamp(18px,2vw,32px)] shadow-[0_30px_80px_-30px_rgba(20,12,6,0.6)] ring-1 ring-black/5"
            >
              {/* Imagen de fondo */}
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                style={fotoStyle(app.slug, app.gradient)}
              />
              {/* Oscurecido arriba y abajo para legibilidad del texto */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(10,8,5,0.52) 0%, rgba(10,8,5,0.05) 30%, rgba(10,8,5,0.05) 58%, rgba(10,8,5,0.62) 100%)",
                }}
              />

              {/* Contenido: mobile arriba, desktop abajo */}
              <div className="absolute inset-0 flex flex-col justify-start p-[clamp(22px,4vw,60px)] md:justify-end">
                <div className="max-w-[46ch]">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/80">
                    {TAGLINES[app.slug] ?? "Aplicación"}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <h3
                      className="font-display font-black uppercase leading-[0.95] text-paper"
                      style={{ fontSize: "clamp(2.4rem,5.5vw,5rem)" }}
                    >
                      {app.nombre}
                    </h3>
                    {/* Flecha inline (desktop) */}
                    <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-md bg-camel text-paper transition-colors duration-300 group-hover:bg-cocoa md:inline-flex">
                      <ArrowIcon />
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 max-w-[42ch] text-sm text-paper/85 sm:text-base">
                    {app.acercaDe.texto}
                  </p>
                </div>

                {/* Flecha en la esquina (mobile) */}
                <span className="absolute bottom-5 right-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-camel text-paper transition-colors duration-300 group-hover:bg-cocoa md:hidden">
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Indicador de puntos (desktop), en el margen derecho, visible solo con
          la sección en pantalla */}
      <div
        aria-hidden
        className={`fixed right-[clamp(14px,2.4vw,40px)] top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3.5 transition-opacity duration-300 md:flex ${
          inView ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {APLICACIONES.map((app, i) => (
          <span
            key={app.slug}
            className={`block rounded-full transition-all duration-300 ${
              active === i
                ? "h-3 w-3 bg-camel ring-2 ring-camel/40 ring-offset-2 ring-offset-cream"
                : "h-2 w-2 bg-bark/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
