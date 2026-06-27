import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Ingresar — Eurolonas" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/perfil");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col justify-center px-[clamp(20px,5vw,40px)] py-16">
      <h1 className="font-display text-[clamp(2rem,1.6rem+1.6vw,2.6rem)] leading-tight text-espresso">
        Ingresar
      </h1>
      <p className="mt-2 text-sm text-taupe">
        Entrá para comprar más rápido y ver tus pedidos.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-sm text-taupe">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="text-camel hover:underline">
          Registrate
        </Link>
      </p>
    </main>
  );
}
