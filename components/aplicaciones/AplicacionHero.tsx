import type { AplicacionPage } from "@/lib/aplicaciones";

function fotoStyle(url: string, gradient: string): React.CSSProperties {
  return {
    backgroundImage: `url(${url}), ${gradient}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export function AplicacionHero({ app }: { app: AplicacionPage }) {
  const big = `/aplicaciones/${app.slug}/hero.jpg`;
  const small = `/aplicaciones/${app.slug}/uso.jpg`;

  return (
    <section className="text-paper" style={{ backgroundColor: app.heroBg }}>
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1400px] gap-8 px-[clamp(20px,5vw,80px)] py-[clamp(32px,5vh,64px)] lg:grid-cols-[40%_60%] lg:items-stretch lg:gap-12">
        {/* Columna izquierda (40%) */}
        <div className="flex flex-col">
          <div className="flex flex-1 flex-col justify-center">
            <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.22em] text-paper/70">
              {app.intro}
            </p>
            <h1
              className="mt-6 animate-fade-up font-display font-black leading-[0.95] text-paper"
              style={{
                fontSize: "clamp(3.2rem,7.5vw,6.25rem)",
                animationDelay: "60ms",
              }}
            >
              {app.tituloLineas
                ? app.tituloLineas.map((l, i) => (
                    <span key={i} className="block whitespace-nowrap">
                      {l}
                    </span>
                  ))
                : app.nombre}
            </h1>
          </div>

          <div className="pt-10">
            <div
              className="aspect-[3/4] w-full max-w-[260px] animate-fade-up overflow-hidden rounded-lg ring-1 ring-white/10"
              style={{ ...fotoStyle(small, app.gradient), animationDelay: "150ms" }}
              aria-hidden
            />
          </div>
        </div>

        {/* Columna derecha (60%) — sangra al borde derecho */}
        <div className="flex flex-col justify-center lg:-mr-[clamp(20px,5vw,80px)]">
          <div
            className="aspect-[16/9] w-full animate-fade-in overflow-hidden rounded-lg lg:rounded-r-none"
            style={fotoStyle(big, app.gradient)}
            aria-hidden
          />

          <div
            className="mt-6 animate-fade-up rounded-lg p-[clamp(20px,4vw,40px)] lg:rounded-r-none"
            style={{ backgroundColor: app.accent, animationDelay: "300ms" }}
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-paper/70">
              {app.acercaDe.label}
            </p>
            <p className="mt-3 max-w-[42ch] text-2xl font-bold leading-snug text-paper">
              {app.acercaDe.texto}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
