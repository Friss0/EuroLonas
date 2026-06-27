"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll global (Lenis). Usa el scroll real del documento, así que no
 * rompe position: sticky ni los observers de scroll. Se desactiva si el usuario
 * pidió menos movimiento (prefers-reduced-motion).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
