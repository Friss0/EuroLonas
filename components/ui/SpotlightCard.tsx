"use client";

import { useRef } from "react";
import Link from "next/link";

// Spotlight que sigue al cursor (adaptado de React Bits / SpotlightCard).
// Envuelve un <Link> y agrega una capa de resplandor radial por DEBAJO del
// contenido (el contenido va con z-10), así no lava el texto.
export function SpotlightCard({
  href,
  className = "",
  spotlightColor = "rgba(255,255,255,0.22)",
  children,
}: {
  href: string;
  className?: string;
  spotlightColor?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      className={className}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(440px circle at var(--mx, 50%) var(--my, 50%), ${spotlightColor}, transparent 70%)`,
        }}
      />
    </Link>
  );
}
