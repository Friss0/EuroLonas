import Link from "next/link";
import Image from "next/image";
import type { ProductoConVariantes } from "@/lib/queries";
import { formatPrecio, unidadSufijo, precioDesde } from "@/lib/format";
import { SwatchMosaic } from "./SwatchMosaic";

export function ProductCard({ producto }: { producto: ProductoConVariantes }) {
  const { imagenes, variantes, nombre, slug, codigo, unidad_venta, precio_base } =
    producto;
  const hexes = variantes
    .map((v) => v.swatch_hex)
    .filter((h): h is string => !!h);
  const desde = precioDesde(precio_base, variantes);
  const esColor = variantes.some((v) => v.tipo === "color");
  const img = imagenes?.[0];

  return (
    <Link href={`/producto/${slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand ring-1 ring-line">
        {img ? (
          <Image
            src={img}
            alt={nombre}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : hexes.length ? (
          <SwatchMosaic
            hexes={hexes}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-taupe">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Insumo
            </span>
            {codigo && (
              <span className="font-mono text-sm text-bark">{codigo}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-display text-lg leading-tight text-espresso">
          {nombre}
        </h3>
        <p className="mt-1 text-sm text-taupe">
          {desde ? (
            <>
              desde <span className="text-bark">{formatPrecio(desde)}</span>{" "}
              <span className="font-mono text-xs">
                {unidadSufijo(unidad_venta)}
              </span>
            </>
          ) : (
            "Consultar"
          )}
        </p>

        {esColor && hexes.length > 0 && (
          <div className="mt-2 flex items-center gap-1">
            {hexes.slice(0, 6).map((h, i) => (
              <span
                key={i}
                className="h-3.5 w-3.5 rounded-[1px] ring-1 ring-line"
                style={{ backgroundColor: h }}
              />
            ))}
            {hexes.length > 6 && (
              <span className="ml-1 font-mono text-[10px] text-taupe">
                +{hexes.length - 6}
              </span>
            )}
          </div>
        )}

        {!esColor && variantes.length > 0 && (
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-taupe">
            {variantes.length}{" "}
            {variantes[0].tipo === "medida" ? "medidas" : "modelos"}
          </p>
        )}
      </div>
    </Link>
  );
}
