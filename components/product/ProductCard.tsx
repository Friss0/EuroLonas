import Link from "next/link";
import Image from "next/image";
import type { ProductoConVariantes } from "@/lib/queries";
import { formatPrecio, unidadSufijo, precioDesde } from "@/lib/format";
import { SwatchMosaic } from "./SwatchMosaic";

/**
 * Foto de la miniatura de la card, en orden:
 *  1) la elegida en el admin (imagen_miniatura)
 *  2) la del primer color cargado (variante color con foto)
 *  3) la primera imagen del producto
 */
export function productoThumbnail(p: ProductoConVariantes): string | null {
  if (p.imagen_miniatura) return p.imagen_miniatura;
  const colorFoto = p.variantes.find(
    (v) => v.tipo === "color" && v.activo && v.swatch_url,
  )?.swatch_url;
  if (colorFoto) return colorFoto;
  return p.imagenes?.[0] ?? null;
}

/**
 * Card de producto ESTÁNDAR (misma en catálogo, /productos, destacados y
 * aplicaciones). Esquinas redondeadas, miniatura, nombre, precio "desde" y
 * muestrario de colores. En las páginas de aplicaciones toma el color de acento
 * vía la variable CSS --accent; en el resto cae al camel/cocoa de marca.
 */
export function ProductCard({ producto }: { producto: ProductoConVariantes }) {
  const { variantes, nombre, slug, codigo, unidad_venta, precio_base } =
    producto;
  const hexes = variantes
    .filter((v) => v.activo)
    .map((v) => v.swatch_hex)
    .filter((h): h is string => !!h);
  const desde = precioDesde(precio_base, variantes);
  const esColor = variantes.some((v) => v.tipo === "color");
  const thumb = productoThumbnail(producto);

  return (
    <Link
      href={`/producto/${slug}`}
      className="group block overflow-hidden rounded-xl border border-line bg-cream transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent,#a97c54)] hover:shadow-[0_16px_34px_-16px_rgba(39,27,18,0.30)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {thumb ? (
          <Image
            src={thumb}
            alt={nombre}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : hexes.length ? (
          <SwatchMosaic
            hexes={hexes}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
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

      <div className="px-4 pb-4 pt-3">
        <h3 className="font-sans text-sm font-bold uppercase leading-snug tracking-wide text-[var(--accent,#6b4a33)]">
          {nombre}
        </h3>
        <p className="mt-1 text-sm text-taupe">
          {desde ? (
            <>
              Desde <span className="text-bark">{formatPrecio(desde)}</span>{" "}
              <span className="font-mono text-xs">
                {unidadSufijo(unidad_venta)}
              </span>
            </>
          ) : (
            "Consultar precio"
          )}
        </p>

        {esColor && hexes.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1">
            {hexes.slice(0, 6).map((h, i) => (
              <span
                key={i}
                className="h-3.5 w-3.5 rounded-[2px] ring-1 ring-line"
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
