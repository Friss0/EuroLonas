"use client";

import { useState } from "react";
import type { ProductoConVariantes } from "@/lib/queries";
import { precioEfectivo } from "@/lib/types";
import { unidadCantidad } from "@/lib/format";
import { useCart } from "@/context/CartContext";

/**
 * Botón "Comprar" para la card: agrega la variante por defecto (el primer
 * color/modelo activo, igual que la ficha) al carrito y abre el drawer.
 * Sólo se renderiza si el producto es comprable (ver ProductCard).
 */
export function CardBuyButton({
  producto,
}: {
  producto: ProductoConVariantes;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const variante =
      producto.variantes.find(
        (v) => v.activo && precioEfectivo(producto, v) > 0,
      ) ?? producto.variantes.find((v) => v.activo);
    if (!variante) return;
    const precio = precioEfectivo(producto, variante);
    if (precio <= 0) return;
    add(
      {
        variantId: variante.id,
        productId: producto.id,
        slug: producto.slug,
        productoNombre: producto.nombre,
        varianteNombre: variante.nombre,
        varianteCodigo: variante.codigo,
        sku: variante.sku,
        unidad: producto.unidad_venta,
        precioUnitario: precio,
        swatchHex: variante.swatch_hex,
        imagen: variante.swatch_url ?? producto.imagenes?.[0] ?? null,
      },
      unidadCantidad(producto.unidad_venta).min,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Comprar ${producto.nombre}`}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-espresso text-[11px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-bark"
    >
      {added ? (
        "Agregado ✓"
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 8h12l-1 11H7L6 8Z" />
            <path d="M9 8a3 3 0 0 1 6 0" />
          </svg>
          Comprar
        </>
      )}
    </button>
  );
}
