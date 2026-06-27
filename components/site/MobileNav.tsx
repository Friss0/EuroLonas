"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { CartButton } from "@/components/cart/CartButton";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { SITE } from "@/lib/site";
import { APLICACIONES } from "@/lib/aplicaciones";

type CardLink = { label: string; href: string; external?: boolean };
type NavCard = {
  label: string;
  bg: string;
  links: CardLink[];
  logout?: boolean; // muestra "Cerrar sesión" dentro de la tarjeta
};

// Flecha ↗ (estilo CardNav, sin react-icons)
function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 opacity-70"
      aria-hidden
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function MobileNav({
  links,
  account,
}: {
  links: { href: string; label: string }[];
  account: { loggedIn: boolean; isAdmin: boolean };
}) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = usePathname();

  // Cerrar paneles al navegar: ajuste de estado en el render al cambiar la ruta.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenu(false);
    setSearch(false);
  }

  const cuentaLinks: CardLink[] = account.loggedIn
    ? account.isAdmin
      ? [{ label: "Panel admin", href: "/admin" }]
      : [
          { label: "Mi perfil", href: "/perfil" },
          { label: "Configuración", href: "/perfil/configuracion" },
        ]
    : [
        { label: "Ingresar", href: "/login" },
        { label: "Crear cuenta", href: "/registro" },
      ];

  const cards: NavCard[] = [
    { label: "Productos", bg: "#6b4a33", links },
    {
      label: "Aplicaciones",
      bg: "#271b12",
      links: APLICACIONES.map((a) => ({
        label: a.nombre,
        href: `/aplicaciones/${a.slug}`,
      })),
    },
    { label: "Cuenta", bg: "#4a3324", links: cuentaLinks, logout: account.loggedIn },
    {
      label: "Contacto",
      bg: "#8a5f3e",
      links: [
        {
          label: "Escribinos por WhatsApp",
          href: SITE.whatsappUrl,
          external: true,
        },
      ],
    },
  ];

  const iconBtn =
    "flex h-11 w-11 items-center justify-center text-bark transition-colors hover:text-camel";

  return (
    <>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          aria-label="Buscar"
          aria-expanded={search}
          onClick={() => {
            setSearch((s) => !s);
            setMenu(false);
          }}
          className={iconBtn}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>

        <CartButton />

        {/* Hamburguesa 2 líneas → X (estilo CardNav) */}
        <button
          type="button"
          aria-label={menu ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menu}
          onClick={() => {
            setMenu((m) => !m);
            setSearch(false);
          }}
          className={`${iconBtn} flex-col gap-[6px]`}
        >
          <span
            className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
              menu ? "translate-y-[4px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
              menu ? "-translate-y-[4px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Panel de búsqueda */}
      {search && (
        <div className="absolute inset-x-0 top-16 z-40 border-b border-line bg-cream/80 px-[clamp(20px,5vw,80px)] py-3 backdrop-blur-md">
          <SearchBar autoFocus />
        </div>
      )}

      {/* Panel del menú: tarjetas que se expanden (grid-rows 0fr→1fr) */}
      <div
        className={`absolute inset-x-0 top-16 z-40 grid transition-[grid-template-rows] duration-[400ms] ease-out ${
          menu ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        aria-hidden={!menu}
      >
        <div className="overflow-hidden">
          <div
            data-lenis-prevent
            className={`max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-cream/80 p-3 backdrop-blur-md ${
              menu ? "" : "pointer-events-none"
            }`}
          >
            <div className="grid gap-2.5">
              {cards.map((card, i) => (
                <div
                  key={card.label}
                  style={{
                    backgroundColor: card.bg,
                    transitionDelay: menu ? `${i * 70 + 90}ms` : "0ms",
                  }}
                  className={`rounded-lg p-4 text-paper transition-all duration-300 ease-out ${
                    menu ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-display text-xl leading-tight text-paper">
                    {card.label}
                  </p>
                  <div className="mt-3 flex flex-col gap-0.5">
                    {card.links.map((lnk) =>
                      lnk.external ? (
                        <a
                          key={lnk.label}
                          href={lnk.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMenu(false)}
                          className="flex items-center gap-2 py-1.5 text-[15px] text-paper/90 transition-opacity hover:opacity-70"
                        >
                          <ArrowUpRight />
                          {lnk.label}
                        </a>
                      ) : (
                        <Link
                          key={lnk.label}
                          href={lnk.href}
                          onClick={() => setMenu(false)}
                          className="flex items-center gap-2 py-1.5 text-[15px] text-paper/90 transition-opacity hover:opacity-70"
                        >
                          <ArrowUpRight />
                          {lnk.label}
                        </Link>
                      ),
                    )}

                    {card.logout && (
                      <LogoutButton className="mt-1 flex items-center gap-2 border-t border-paper/15 py-1.5 pt-2.5 text-[15px] text-paper/80 transition-opacity hover:opacity-70" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
