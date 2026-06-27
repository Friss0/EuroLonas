import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Crear cuenta — Eurolonas" };

export default async function RegistroPage() {
  const user = await getCurrentUser();
  if (user) redirect("/perfil");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col justify-center px-[clamp(20px,5vw,40px)] py-16">
      <h1 className="font-display text-[clamp(2rem,1.6rem+1.6vw,2.6rem)] leading-tight text-espresso">
        Crear cuenta
      </h1>
      <p className="mt-2 text-sm text-taupe">
        Registrate para comprar y seguir tus pedidos.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
      <p className="mt-6 text-sm text-taupe">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-camel hover:underline">
          Ingresá
        </Link>
      </p>
    </main>
  );
}
