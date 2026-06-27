"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Beams (Three.js) sólo en el cliente y diferido: no pesa en el resto del sitio.
const Beams = dynamic(() => import("@/components/ui/Beams"), { ssr: false });

const fallbackStyle: React.CSSProperties = {
  background:
    "linear-gradient(120deg, #1d130b, #4a3324, #6b4a33, #a97c54, #4a3324, #1d130b)",
  backgroundSize: "300% 300%",
  animation: "contact-pan 18s ease-in-out infinite",
};

export function ContactBeamsBg() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check client-only
    setReduced(m.matches);
  }, []);

  if (reduced) {
    return <div aria-hidden className="absolute inset-0 -z-10" style={fallbackStyle} />;
  }

  return (
    <div aria-hidden className="absolute inset-0 -z-10 bg-black">
      <Beams
        beamWidth={2.4}
        beamHeight={16}
        beamNumber={14}
        lightColor="#caa063"
        speed={2}
        noiseIntensity={1.6}
        scale={0.2}
        rotation={28}
      />
      {/* leve oscurecido para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
