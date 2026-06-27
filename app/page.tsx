import { Hero } from "@/components/home/Hero";
import { RubroBlocks } from "@/components/home/RubroBlocks";
import { DestacadosCarousel } from "@/components/home/DestacadosCarousel";
import { AplicacionesStack } from "@/components/home/AplicacionesStack";
import { ContactForm } from "@/components/home/ContactForm";
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

      {/* Distribuidor oficial Sauleda — foto de lona roja de fondo */}
      <section
        className="relative overflow-hidden border-y border-line bg-cover bg-center"
        style={{ backgroundImage: "url(/banner-sauleda.jpg)" }}
      >
        {/* Oscurecido sutil hacia la izquierda para legibilidad del texto blanco */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-espresso/35 via-espresso/10 to-transparent"
        />
        <div className="relative z-10 mx-auto max-w-[1280px] px-[clamp(20px,5vw,80px)] py-[clamp(48px,7vw,96px)]">
          <Reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-bark">
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
        </div>
      </section>

      <ContactForm />
    </>
  );
}
