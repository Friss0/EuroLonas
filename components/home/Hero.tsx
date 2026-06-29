import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] w-full overflow-hidden bg-espresso">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/videos/hero-poster.jpg"
        aria-hidden
      >
        <source src="/videos/Sauleda.mp4" type="video/mp4" />
      </video>

      {/* Overlay para legibilidad */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, rgba(31,21,14,0.74) 0%, rgba(31,21,14,0.30) 50%, rgba(31,21,14,0.28) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[1280px] flex-col justify-center px-[clamp(20px,5vw,80px)] py-[clamp(40px,6vw,80px)]">
        <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.22em] text-[#e8decf]">
          Distribuidor oficial Sauleda · Argentina
        </p>
        <h1
          className="mt-7 max-w-[16ch] animate-fade-up font-display text-[clamp(2.8rem,1.4rem+6vw,6.5rem)] leading-[1.0] tracking-[-0.015em] text-[#fbf8f2] sm:mt-5"
          style={{ animationDelay: "80ms" }}
        >
          Lonas técnicas que respiran.
        </h1>
        <p
          className="mt-9 max-w-[52ch] animate-fade-up text-lg text-[#ede5d8] sm:mt-6"
          style={{ animationDelay: "160ms" }}
        >
          Acrílicas, Soltis y Cristal PVC, por metro o por rollo. Y todos los
          insumos para armar el toldo, de punta a punta.
        </p>

        <div
          className="mt-12 flex animate-fade-up flex-wrap gap-4 sm:mt-9 sm:gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="#contacto"
            className="flex h-12 items-center rounded-full bg-paper px-7 text-sm font-medium text-espresso transition-colors hover:bg-camel hover:text-paper"
          >
            Contáctanos
          </Link>
          <Link
            href="/productos"
            className="flex h-12 items-center rounded-full border border-[#fbf8f2]/40 px-7 text-sm font-medium text-paper transition-colors hover:bg-[#fbf8f2]/10"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </section>
  );
}
