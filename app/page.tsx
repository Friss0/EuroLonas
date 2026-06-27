import { Hero } from "@/components/home/Hero";
import { RubroBlocks } from "@/components/home/RubroBlocks";
import { DestacadosCarousel } from "@/components/home/DestacadosCarousel";
import { AplicacionesStack } from "@/components/home/AplicacionesStack";
import { ContactForm } from "@/components/home/ContactForm";
import { ParallaxBg } from "@/components/ui/ParallaxBg";
import { Reveal } from "@/components/ui/Reveal";
import { getDestacados } from "@/lib/queries";

export default async function Home() {
  const destacados = await getDestacados(4);

  return (
    <>
      <Hero />

      <RubroBlocks />

      <AplicacionesStack />

      <DestacadosCarousel productos={destacados} />

      {/* Distribuidor oficial Sauleda — container flotante (mismos márgenes que el stack) */}
      <section className="bg-cream px-[clamp(20px,7vw,160px)] py-[clamp(40px,6vw,80px)]">
        <div className="relative overflow-hidden rounded-[clamp(18px,2vw,32px)] shadow-[0_30px_80px_-30px_rgba(20,12,6,0.6)] ring-1 ring-black/5">
          <ParallaxBg src="/banner-sauleda.jpg" />
          {/* Oscurecido sutil hacia la izquierda para legibilidad del texto blanco */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-espresso/35 via-espresso/10 to-transparent"
          />
          <div className="relative z-10 flex flex-col items-start gap-10 px-[clamp(26px,5vw,72px)] py-[clamp(48px,7vw,96px)] md:flex-row md:items-center md:justify-between md:gap-12">
            <Reveal>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-sand">
                Representación oficial
              </p>
              <p className="mt-5 max-w-[24ch] font-display text-[clamp(1.8rem,1.2rem+2.2vw,2.8rem)] leading-[1.1] text-white">
                Somos el distribuidor oficial de Sauleda en Argentina.
              </p>
              <p className="mt-5 max-w-[58ch] text-white/90">
                Trabajamos las líneas Solar Pro, Nautic, Technical, Office y
                Textile. Lonas pensadas para durar a la intemperie, con respaldo y
                trazabilidad de origen.
              </p>
            </Reveal>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/sauleda-nobg.png"
              alt="Sauleda"
              className="w-[clamp(150px,16vw,280px)] shrink-0 opacity-95 drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
            />
          </div>
        </div>
      </section>

      <ContactForm />
    </>
  );
}
