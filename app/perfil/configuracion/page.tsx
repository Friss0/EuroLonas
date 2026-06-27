import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { ConfigForm } from "@/components/profile/ConfigForm";

export const metadata = { title: "Configuración — Eurolonas" };

export default async function ConfiguracionPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/perfil/configuracion");

  return (
    <main className="mx-auto max-w-[520px] px-[clamp(20px,5vw,40px)] pb-24 pt-12">
      <Link
        href="/perfil"
        className="font-mono text-xs uppercase tracking-[0.16em] text-taupe transition-colors hover:text-camel"
      >
        ← Volver al perfil
      </Link>
      <h1 className="mt-4 font-display text-[clamp(2rem,1.6rem+1.6vw,2.8rem)] leading-tight text-espresso">
        Configuración
      </h1>
      <p className="mt-2 text-sm text-taupe">Modificá tus datos de contacto.</p>
      <div className="mt-8">
        <ConfigForm
          email={profile.email ?? ""}
          defaultNombre={profile.nombre ?? ""}
          defaultTelefono={profile.telefono ?? ""}
        />
      </div>
    </main>
  );
}
