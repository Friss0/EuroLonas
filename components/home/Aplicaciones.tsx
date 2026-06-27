import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

type Aplicacion = {
  titulo: string;
  href: string;
  gradient: string;
  image?: string; // cuando haya foto real, se usa en lugar del gradiente
};

const aplicaciones: Aplicacion[] = [
  {
    titulo: "Toldos y Pérgolas",
    href: "/aplicaciones/toldos-y-pergolas",
    gradient: "linear-gradient(160deg, #8a5f3e 0%, #a97c54 100%)",
  },
  {
    titulo: "Náutica",
    href: "/aplicaciones/nautica",
    gradient: "linear-gradient(160deg, #1f3d45 0%, #356174 100%)",
  },
  {
    titulo: "Mobiliario exterior",
    href: "/aplicaciones/mobiliario-exterior",
    gradient: "linear-gradient(160deg, #4f4a3a 0%, #7e8a6b 100%)",
  },
];

export function Aplicaciones() {
  return (
    <section className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] py-[clamp(56px,8vw,128px)]">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Aplicaciones
        </p>
        <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] leading-[1.05] text-espresso">
          Una lona para cada uso.
        </h2>
      </Reveal>

      <div className="mt-10 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {aplicaciones.map((a, i) => (
          <Reveal key={a.titulo} delay={i * 90} className="min-w-[72%] sm:min-w-0">
            <Link
              href={a.href}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-sm ring-1 ring-line transition duration-300 hover:ring-camel"
            >
              {a.image ? (
                <Image
                  src={a.image}
                  alt={a.titulo}
                  fill
                  sizes="(max-width: 640px) 72vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ background: a.gradient }}
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(31,21,14,0.72) 0%, rgba(31,21,14,0.08) 52%, transparent 100%)",
                }}
              />
              {/* oscurecido extra en hover */}
              <div
                className="absolute inset-0 bg-espresso/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />

              <div className="absolute inset-x-4 bottom-4">
                <h3 className="font-sans text-lg font-semibold uppercase tracking-[0.08em] text-paper transition-transform duration-300 group-hover:-translate-y-1">
                  {a.titulo}
                </h3>
                <span className="mt-1.5 flex translate-y-1 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Ver aplicación
                  <svg
                    width="20"
                    height="9"
                    viewBox="0 0 22 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  >
                    <path d="M0 5h20M16 1l5 4-5 4" />
                  </svg>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
