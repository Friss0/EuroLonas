"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo con efecto parallax: la imagen se desplaza levemente al scrollear.
 * Va como primer hijo de una <section className="relative overflow-hidden">.
 * Está escalada para que el desplazamiento no descubra los bordes.
 */
export function ParallaxBg({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scale(1.06)";
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 cuando la sección entra por abajo, 1 cuando sale por arriba.
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const shift = (clamped - 0.5) * 56; // ±28px
      el.style.transform = `translate3d(0, ${shift}px, 0) scale(1.2)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 bg-cover bg-center will-change-transform"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}
