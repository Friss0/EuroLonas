import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata = { title: "Panel — Eurolonas" };

const navItems = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/productos", label: "Productos" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/admin");
  if (profile.rol !== "admin") redirect("/");

  return (
    <ToastProvider>
      <div className="mx-auto grid max-w-[1280px] gap-8 px-[clamp(20px,5vw,80px)] py-10 md:grid-cols-[180px_1fr]">
        <aside className="md:sticky md:top-24 md:h-fit">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
          Panel admin
        </p>
        <nav className="mt-4 flex gap-2 md:flex-col md:gap-1">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="flex h-10 items-center rounded-lg px-3 text-sm text-bark transition-colors hover:bg-sand hover:text-camel"
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </ToastProvider>
  );
}
