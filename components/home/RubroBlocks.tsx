import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

function ArrowCta({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-paper">
      {children}
      <svg
        width="22"
        height="10"
        viewBox="0 0 22 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="transition-transform duration-300 group-hover:translate-x-1.5"
        aria-hidden
      >
        <path d="M0 5h20M16 1l5 4-5 4" />
      </svg>
    </span>
  );
}

// Glass card flotante: vidrio oscuro translúcido + blur, con degradado interno
// para que el texto quede legible y brillo superior tipo "liquid glass".
const cardClass =
  "group relative flex min-h-[clamp(320px,44vw,460px)] flex-col justify-end overflow-hidden rounded-[28px] border border-white/15 p-[clamp(26px,3.5vw,46px)] text-paper shadow-[0_30px_80px_-32px_rgba(20,12,6,0.7)] backdrop-blur-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_46px_110px_-34px_rgba(20,12,6,0.78)]";

export function RubroBlocks() {
  return (
    <section
      aria-label="Rubros"
      className="bg-cream pb-[clamp(48px,8vw,112px)] pt-[clamp(40px,6vw,84px)]"
    >
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)]">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
            Productos
          </p>
          <h2 className="mt-3 max-w-[18ch] font-display text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] leading-[1.05] text-espresso">
            ¿Qué estás buscando?
          </h2>
        </Reveal>

        <div className="mt-[clamp(36px,5vw,64px)] grid gap-5 md:grid-cols-2 md:gap-6">
          {/* TELAS */}
          <Reveal delay={60}>
            <SpotlightCard
              href="/telas"
              className={cardClass}
              spotlightColor="rgba(214,183,140,0.25)"
            >
              {/* Tinte del vidrio: marrón (color de marca / logo) */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#1f1109]/94 via-[#5a3d27]/72 to-[#3a2616]/55"
              />
              {/* Brillo superior (liquid gloss) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/sauleda-nobg.png"
                alt="Sauleda"
                className="pointer-events-none absolute right-6 top-6 w-28 opacity-95 transition-transform duration-500 group-hover:scale-105 sm:w-32"
              />

              <div className="relative z-10">
                <div className="max-w-[36ch]">
                  <h3 className="font-display text-[clamp(2rem,1.2rem+3vw,3.4rem)] leading-[1.0]">
                    Telas
                  </h3>
                  <p className="mt-3 text-sm text-paper/80 sm:text-base">
                    Acrílicas, Soltis y Cristal PVC para toldos, tapicería
                    exterior y náutica. Elegí el color y comprá por metro o por
                    rollo.
                  </p>
                  <ArrowCta>Ver telas</ArrowCta>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* INSUMOS */}
          <Reveal delay={140}>
            <SpotlightCard
              href="/insumos"
              className={cardClass}
              spotlightColor="rgba(150,178,214,0.22)"
            >
              {/* Tinte del vidrio: azul oscuro */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#080f1c]/95 via-[#243450]/72 to-[#16243a]/55"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/8 to-transparent"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/bat-logo.png"
                alt="BAT — Insumos para toldos"
                className="pointer-events-none absolute right-6 top-7 w-28 opacity-90 brightness-0 invert transition-transform duration-500 group-hover:scale-105 sm:w-32"
              />

              <div className="relative z-10">
                <div className="max-w-[36ch]">
                  <h3 className="font-display text-[clamp(2rem,1.2rem+3vw,3.4rem)] leading-[1.0]">
                    Insumos para toldos
                  </h3>
                  <p className="mt-3 text-sm text-paper/80 sm:text-base">
                    Tubos, brazos, motores, calotas y todo lo necesario para
                    armar y reparar. Por unidad, juego o metro.
                  </p>
                  <ArrowCta>Ver insumos</ArrowCta>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/productos"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-espresso px-7 text-sm font-medium text-cream transition-colors hover:bg-bark"
            >
              Ver todos los productos
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
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
