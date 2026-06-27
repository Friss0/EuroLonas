"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UnidadVenta } from "@/lib/types";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  productoNombre: string;
  varianteNombre: string;
  varianteCodigo: string | null;
  sku: string | null;
  unidad: UnidadVenta;
  precioUnitario: number;
  swatchHex: string | null;
  imagen: string | null;
  cantidad: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "cantidad">, cantidad: number) => void;
  setCantidad: (variantId: string, cantidad: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "eurolonas:cart:v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Cargar de localStorage al montar. localStorage no existe en SSR, así que
  // este setState dentro del efecto es la forma correcta y necesaria de hidratar
  // el carrito persistido (no puede hacerse en render sin romper la hidratación).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación client-only desde localStorage
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignorar JSON corrupto */
    }
    setHydrated(true);
  }, []);

  // Persistir en cada cambio (después de hidratar)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [items, hydrated]);

  const add = useCallback(
    (item: Omit<CartItem, "cantidad">, cantidad: number) => {
      setItems((prev) => {
        const i = prev.findIndex((x) => x.variantId === item.variantId);
        if (i >= 0) {
          const next = prev.slice();
          next[i] = {
            ...next[i],
            cantidad: +(next[i].cantidad + cantidad).toFixed(2),
          };
          return next;
        }
        return [...prev, { ...item, cantidad }];
      });
      setIsOpen(true);
    },
    [],
  );

  const setCantidad = useCallback((variantId: string, cantidad: number) => {
    setItems((prev) =>
      prev
        .map((x) => (x.variantId === variantId ? { ...x, cantidad } : x))
        .filter((x) => x.cantidad > 0),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((x) => x.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const count = items.length;
  const subtotal = useMemo(
    () => items.reduce((s, x) => s + x.precioUnitario * x.cantidad, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      count,
      subtotal,
      add,
      setCantidad,
      remove,
      clear,
      open,
      close,
    }),
    [items, isOpen, count, subtotal, add, setCantidad, remove, clear, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
