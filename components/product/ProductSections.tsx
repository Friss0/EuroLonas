import Image from "next/image";
import type { ProductoConVariantes } from "@/lib/queries";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl text-espresso">{children}</h2>
  );
}

export function ProductSections({
  producto,
}: {
  producto: ProductoConVariantes;
}) {
  const { descripcion, ficha_tecnica, fotos_referencia, aplicaciones } =
    producto;

  return (
    <div className="mt-20 space-y-14 border-t border-line pt-14">
      {descripcion && (
        <section className="max-w-[68ch]">
          <SectionTitle>Descripción</SectionTitle>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-bark/90">
            {descripcion}
          </p>
        </section>
      )}

      {ficha_tecnica && (
        <section className="max-w-[68ch]">
          <SectionTitle>Ficha técnica</SectionTitle>
          <p className="mt-4 whitespace-pre-line font-mono text-sm leading-relaxed text-bark/90">
            {ficha_tecnica}
          </p>
        </section>
      )}

      {aplicaciones.length > 0 && (
        <section>
          <SectionTitle>Aplicaciones</SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {aplicaciones.map((a) => (
              <span
                key={a.id}
                className="flex h-9 items-center rounded-sm border border-line px-3.5 font-mono text-xs uppercase tracking-[0.14em] text-cocoa"
              >
                {a.nombre}
              </span>
            ))}
          </div>
        </section>
      )}

      {fotos_referencia.length > 0 && (
        <section>
          <SectionTitle>Fotos de referencia</SectionTitle>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {fotos_referencia.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-sm bg-sand ring-1 ring-line"
              >
                <Image
                  src={src}
                  alt={`${producto.nombre} — referencia ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
