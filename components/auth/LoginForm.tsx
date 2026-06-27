"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "h-11 w-full rounded-sm border border-line bg-paper px-3 text-bark outline-none transition-colors focus:border-camel";
const labelClass = "font-mono text-xs uppercase tracking-[0.16em] text-cocoa";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/perfil";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }
    // Admin → directo al panel; cliente → al destino pedido (o su perfil).
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let dest = next;
    if (user) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("rol")
        .eq("id", user.id)
        .maybeSingle();
      if (prof?.rol === "admin") dest = "/admin";
    }
    router.push(dest);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block space-y-2">
        <span className={labelClass}>Contraseña</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </label>
      {error && <p className="font-mono text-xs text-[#b5483d]">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-sm bg-espresso text-sm font-medium text-cream transition-colors hover:bg-bark disabled:opacity-50"
      >
        {loading ? "Entrando…" : "Ingresar"}
      </button>
    </form>
  );
}
