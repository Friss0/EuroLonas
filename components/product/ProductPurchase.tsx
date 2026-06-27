"use client";
import { useState } from "react";
import Image from "next/image";
import type { ProductoConVariantes } from "@/lib/queries";
import { precioEfectivo } from "@/lib/types";
import {
  formatPrecio,
  unidadSufijo,
  unidadCantidad,
  precioDesde,
} from "@/lib/format";
import { useCart } from "@/context/CartContext";

export function ProductPurchase({
  producto,
}: {
  producto: ProductoConVariantes;
}) {
  const { add } = useCart();
  const variantes = producto.variantes.filter((v) => v.activo);
  const tipo = variantes[0]?.tipo ?? "modelo";
  const esColor = tipo === "color";

  // Por defecto queda seleccionada la primera variante (el primer color).
  const [selId, setSelId] = useState<string | null>(variantes[0]?.id ?? null);
  const [added, setAdded] = useState(false);
  const qtyCfg = unidadCantidad(producto.unidad_venta);
  const [cant, setCant] = useState(qtyCfg.min);

  const sel = variantes.find((v) => v.id === selId) ?? null;
  const precio = sel ? precioEfectivo(producto, sel) : null;
  const subtotal = precio != null ? precio * cant : null;
  const desde = precioDesde(producto.precio_base, variantes);

  const firstHex = variantes.find((v) => v.swatch_hex)?.swatch_hex ?? null;
  const previewHex = sel?.swatch_hex ?? firstHex;
  const previewImg = sel?.swatch_url ?? producto.imagenes?.[0] ?? null;

  function step(dir: number) {
    setCant((c) => Math.max(qtyCfg.min, +(c + dir * qtyCfg.step).toFixed(2)));
    setAdded(false);
  }

  function pick(id: string) {
    setSelId(id);
    setAdded(false);
  }

  function handleAdd() {
    if (!sel || precio == null) return;
    add(
      {
        variantId: sel.id,
        productId: producto.id,
        slug: producto.slug,
        productoNombre: producto.nombre,
        varianteNombre: sel.nombre,
        varianteCodigo: sel.codigo,
        sku: sel.sku,
        unidad: producto.unidad_venta,
        precioUnitario: precio,
        swatchHex: sel.swatch_hex,
        imagen: sel.swatch_url ?? producto.imagenes?.[0] ?? null,
      },
      cant,
    );
    setAdded(true);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      {/* Media */}
      <div className="relative aspect-square overflow-hidden rounded-sm bg-sand ring-1 ring-line">
        {previewImg ? (
          <Image
            src={previewImg}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : previewHex ? (
          <div className="h-full w-full" style={{ backgroundColor: previewHex }} />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-2xl text-bark">
            {producto.codigo}
          </div>
        )}
        {esColor && sel && (
          <div className="absolute bottom-3 left-3 rounded-sm bg-cream/90 px-3 py-1.5 font-mono text-xs text-bark backdrop-blur">
            {sel.nombre}
            {sel.codigo ? ` · ${sel.codigo}` : ""}
          </div>
        )}
      </div>

      {/* Info + selector */}
      <div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-taupe">
          {producto.categoria?.nombre && <span>{producto.categoria.nombre}</span>}
          {producto.codigo && <span className="text-camel">· {producto.codigo}</span>}
        </div>

        <h1 className="mt-3 font-display text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] leading-[1.05] text-espresso">
          {producto.nombre}
        </h1>

        <div className="mt-4 flex items-baseline gap-2">
          {sel ? (
            <span className="text-2xl text-bark">{formatPrecio(precio)}</span>
          ) : (
            <span className="text-2xl text-bark">
              {desde ? (
                <>
                  <span className="text-base text-taupe">desde </span>
                  {formatPrecio(desde)}
                </>
              ) : (
                "Consultar"
              )}
            </span>
          )}
          <span className="font-mono text-xs text-taupe">
            {unidadSufijo(producto.unidad_venta)}
          </span>
        </div>

        {/* Selector de variante */}
        {esColor ? (
          <div className="mt-7" role="radiogroup" aria-label="Color">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-cocoa">
                Color
              </span>
              {sel && <span className="font-mono text-xs text-taupe">{sel.nombre}</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {variantes.map((v) => {
                const on = sel?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={`${v.nombre}${v.codigo ? ` (${v.codigo})` : ""}`}
                    title={`${v.nombre}${v.codigo ? ` · ${v.codigo}` : ""}`}
                    onClick={() => pick(v.id)}
                    className={`h-11 w-11 overflow-hidden rounded-sm bg-cover bg-center ring-1 ring-line transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-camel ${
                      on ? "outline outline-2 outline-offset-2 outline-camel" : ""
                    }`}
                    style={
                      v.swatch_url
                        ? { backgroundImage: `url(${v.swatch_url})` }
                        : { backgroundColor: v.swatch_hex ?? "#cbb89c" }
                    }
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="mt-7 space-y-2"
            role="radiogroup"
            aria-label={tipo === "medida" ? "Medida" : "Modelo"}
          >
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-cocoa">
              {tipo === "medida" ? "Medida" : "Modelo"}
            </span>
            {variantes.map((v) => {
              const on = sel?.id === v.id;
              const p = precioEfectivo(producto, v);
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => pick(v.id)}
                  className={`flex min-h-11 w-full items-center justify-between rounded-sm border px-4 py-2.5 text-left transition ${
                    on
                      ? "border-camel bg-paper"
                      : "border-line hover:border-camel-soft"
                  }`}
                >
                  <span className="font-mono text-sm text-bark">{v.nombre}</span>
                  <span className="flex items-center gap-3">
                    {v.stock != null && (
                      <span className="font-mono text-[11px] text-taupe">
                        {v.stock > 0 ? `${v.stock} disp.` : "sin stock"}
                      </span>
                    )}
                    <span className="text-sm text-bark">{formatPrecio(p)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Detalle de la variante elegida */}
        {sel && (sel.sku || sel.stock != null) && (
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-taupe">
            {sel.sku && (
              <span>
                SKU: <span className="text-bark">{sel.sku}</span>
              </span>
            )}
            {sel.stock != null && (
              <span>
                Stock:{" "}
                <span className="text-bark">
                  {sel.stock > 0 ? sel.stock : "sin stock"}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Cantidad */}
        <div className="mt-6">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-cocoa">
            {qtyCfg.label}
          </span>
          <div className="mt-2 inline-flex items-center rounded-sm border border-line">
            <button
              type="button"
              aria-label="Restar"
              onClick={() => step(-1)}
              className="flex h-11 w-11 items-center justify-center text-lg text-bark hover:text-camel"
            >
              –
            </button>
            <span className="w-20 text-center font-mono text-sm text-bark">
              {cant}
              {producto.unidad_venta === "metro" ? " m" : ""}
            </span>
            <button
              type="button"
              aria-label="Sumar"
              onClick={() => step(1)}
              className="flex h-11 w-11 items-center justify-center text-lg text-bark hover:text-camel"
            >
              +
            </button>
          </div>
        </div>

        {/* Agregar al carrito */}
        <div className="mt-7">
          <button
            type="button"
            disabled={!sel}
            onClick={handleAdd}
            className="flex h-12 w-full items-center justify-center rounded-sm bg-espresso px-7 text-sm font-medium text-cream transition enabled:hover:bg-bark disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {sel
              ? `Agregar al carrito · ${formatPrecio(subtotal)}`
              : "Elegí una variante"}
          </button>
          {added && (
            <p className="mt-3 font-mono text-xs text-camel">
              Agregado al carrito.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
