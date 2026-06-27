import type { SeoBloque } from "@/lib/aplicaciones";

export function CategoryContent({ bloques }: { bloques: SeoBloque[] }) {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {bloques.map((b, i) => {
          if (b.tipo === "label")
            return (
              <p
                key={i}
                className={`font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] ${
                  i > 0 ? "mt-12" : ""
                }`}
              >
                {b.texto}
              </p>
            );
          if (b.tipo === "h2")
            return (
              <h2
                key={i}
                className="mb-4 mt-10 font-display text-3xl font-black text-[var(--accent)]"
              >
                {b.texto}
              </h2>
            );
          return (
            <p key={i} className="mt-4 text-base leading-relaxed text-bark/90">
              {b.texto}
            </p>
          );
        })}
      </div>
    </section>
  );
}
