"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrecio, unidadCantidad } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, close, subtotal, setCantidad, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Foco atrapado + ESC + bloqueo de scroll mientras está abierto
  useEffect(() => {
    if (!isOpen) return;
    const prevFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocused?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <div
      className={`fixed inset-0 z-[100] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-espresso/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compra"
        className={`absolute right-0 top-0 flex h-full w-full flex-col bg-cream shadow-[0_12px_40px_rgba(31,21,14,0.16)] transition-transform duration-300 sm:max-w-md ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl text-espresso">Carrito</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Cerrar carrito"
            className="flex h-11 w-11 items-center justify-center text-bark hover:text-camel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
            <p className="font-mono text-sm text-taupe">Tu carrito está vacío.</p>
          </div>
        ) : (
          <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="space-y-5">
              {items.map((it) => {
                const cfg = unidadCantidad(it.unidad);
                return (
                  <li key={it.variantId} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-sand ring-1 ring-line">
                      {it.imagen ? (
                        <Image
                          src={it.imagen}
                          alt={it.productoNombre}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : it.swatchHex ? (
                        <div
                          className="h-full w-full"
                          style={{ backgroundColor: it.swatchHex }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-[10px] text-bark">
                          {it.varianteCodigo}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-espresso">
                        {it.productoNombre}
                      </p>
                      <p className="font-mono text-xs text-taupe">
                        {it.varianteNombre}
                        {it.varianteCodigo ? ` · ${it.varianteCodigo}` : ""}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-sm border border-line">
                          <button
                            type="button"
                            aria-label="Restar cantidad"
                            onClick={() =>
                              setCantidad(
                                it.variantId,
                                +(it.cantidad - cfg.step).toFixed(2),
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-bark hover:text-camel"
                          >
                            –
                          </button>
                          <span className="w-12 text-center font-mono text-xs text-bark">
                            {it.cantidad}
                            {it.unidad === "metro" ? " m" : ""}
                          </span>
                          <button
                            type="button"
                            aria-label="Sumar cantidad"
                            onClick={() =>
                              setCantidad(
                                it.variantId,
                                +(it.cantidad + cfg.step).toFixed(2),
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-bark hover:text-camel"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm text-bark">
                          {formatPrecio(it.precioUnitario * it.cantidad)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(it.variantId)}
                      aria-label={`Quitar ${it.productoNombre}`}
                      className="self-start p-1 text-taupe hover:text-camel"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <footer className="border-t border-line px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-taupe">
              Subtotal
            </span>
            <span className="text-lg text-espresso">{formatPrecio(subtotal)}</span>
          </div>
          {items.length === 0 ? (
            <button
              type="button"
              disabled
              className="mt-4 flex h-12 w-full items-center justify-center rounded-sm bg-espresso text-sm font-medium text-cream opacity-40"
            >
              Finalizar compra
            </button>
          ) : (
            <Link
              href="/checkout"
              onClick={close}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-sm bg-espresso text-sm font-medium text-cream transition-colors hover:bg-bark"
            >
              Finalizar compra
            </Link>
          )}
          <p className="mt-2 text-center font-mono text-[11px] text-taupe">
            El pago online (Mercado Pago) se activa pronto.
          </p>
        </footer>
      </div>
    </div>
  );
}
