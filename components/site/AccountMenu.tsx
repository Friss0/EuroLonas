"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AccountMenu({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Cerrar al navegar: ajustar estado en el render cuando cambia la ruta
  // (patrón recomendado de React, sin efecto).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const itemClass =
    "flex h-10 w-full items-center px-4 text-left text-sm text-bark transition-colors hover:bg-sand hover:text-camel";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Cuenta"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center text-bark transition-colors hover:text-camel"
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
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-48 overflow-hidden rounded-sm border border-line bg-paper py-1 shadow-[0_12px_40px_rgba(31,21,14,0.16)]"
        >
          {isAdmin ? (
            <Link href="/admin" role="menuitem" className={itemClass}>
              Panel
            </Link>
          ) : (
            <>
              <Link href="/perfil" role="menuitem" className={itemClass}>
                Mi perfil
              </Link>
              <Link
                href="/perfil/configuracion"
                role="menuitem"
                className={itemClass}
              >
                Configuración
              </Link>
            </>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className={`${itemClass} border-t border-line`}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
