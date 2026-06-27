import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { CartButton } from "@/components/cart/CartButton";
import { SearchBar } from "@/components/search/SearchBar";
import { AccountMenu } from "./AccountMenu";
import { ProductsMenu } from "./ProductsMenu";
import { AplicacionesMenu } from "./AplicacionesMenu";
import { MobileNav } from "./MobileNav";
import { SITE } from "@/lib/site";
import { getProfile } from "@/lib/auth";
import { getProductosMenu } from "@/lib/queries";

const links = [
  { href: "/telas", label: "Telas" },
  { href: "/insumos", label: "Insumos para toldos" },
  { href: "/productos", label: "Productos" },
];

const linkClass =
  "flex h-11 items-center px-3 text-sm text-bark transition-colors hover:text-camel";

export async function Navbar() {
  const [profile, productosMenu] = await Promise.all([
    getProfile(),
    getProductosMenu(),
  ]);
  const isAdmin = profile?.rol === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-[clamp(20px,5vw,80px)]">
        <Link href="/" aria-label="Eurolonas — inicio" className="shrink-0">
          <Wordmark className="text-base" />
        </Link>

        {/* Desktop: búsqueda inline */}
        <div className="hidden flex-1 justify-center px-2 md:flex">
          <div className="w-full max-w-[420px]">
            <SearchBar />
          </div>
        </div>

        {/* Desktop: links + cuenta + carrito */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <ProductsMenu products={productosMenu} />
          <AplicacionesMenu />
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Contacto
          </a>
          {profile ? (
            <AccountMenu isAdmin={isAdmin} />
          ) : (
            <Link href="/login" className={linkClass}>
              Ingresar
            </Link>
          )}
          <CartButton />
        </nav>

        {/* Mobile: lupita + carrito + menú hamburguesa */}
        <div className="ml-auto md:hidden">
          <MobileNav
            links={links}
            account={{ loggedIn: !!profile, isAdmin }}
          />
        </div>
      </div>
    </header>
  );
}
