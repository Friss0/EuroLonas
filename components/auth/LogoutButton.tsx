"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className={
        className ||
        "flex h-11 items-center rounded-sm border border-line px-4 text-sm text-bark transition-colors hover:border-camel-soft hover:text-camel"
      }
    >
      Cerrar sesión
    </button>
  );
}
