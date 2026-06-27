import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = { title: "Finalizar compra — Eurolonas" };

export default async function CheckoutPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/checkout");

  return (
    <main className="mx-auto max-w-[1100px] px-[clamp(20px,5vw,80px)] pb-24 pt-12">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-camel">
        Checkout
      </p>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,1.6rem+2vw,3.4rem)] leading-tight text-espresso">
        Finalizar compra
      </h1>
      <CheckoutForm
        defaultNombre={profile.nombre ?? ""}
        defaultEmail={profile.email ?? ""}
        defaultTelefono={profile.telefono ?? ""}
      />
    </main>
  );
}
