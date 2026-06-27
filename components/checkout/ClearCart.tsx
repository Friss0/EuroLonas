"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Vacía el carrito al volver de un pago confirmado/pendiente. */
export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
