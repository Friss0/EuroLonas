"use client";
import { useCart } from "@/context/CartContext";

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Abrir carrito (${count} ${count === 1 ? "ítem" : "ítems"})`}
      className="relative ml-1 flex h-11 w-11 items-center justify-center text-bark transition-colors hover:text-camel"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-camel px-1 font-mono text-[10px] leading-none text-paper">
          {count}
        </span>
      )}
    </button>
  );
}
