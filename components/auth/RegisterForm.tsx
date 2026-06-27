"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "./PasswordInput";
import { Captcha, captchaSiteKey } from "./Captcha";

const inputClass =
  "h-11 w-full rounded-lg border border-line bg-paper px-3 text-bark outline-none transition-colors focus:border-camel";
const labelClass = "font-mono text-xs uppercase tracking-[0.16em] text-cocoa";

export function RegisterForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (captchaSiteKey && !captchaToken) {
      setError("Completá el captcha.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre }, captchaToken: captchaToken ?? undefined },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      setCaptchaKey((k) => k + 1);
      return;
    }
    if (data.session) {
      router.push("/perfil");
      router.refresh();
    } else {
      // Confirmación de email activada en Supabase.
      setConfirmar(true);
      setLoading(false);
    }
  }

  if (confirmar) {
    return (
      <div className="rounded-lg border border-line bg-paper p-5">
        <p className="text-bark">
          Te enviamos un email a <span className="font-medium">{email}</span>{" "}
          para confirmar tu cuenta. Confirmala y después ingresá.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className={labelClass}>Nombre completo</span>
        <input
          id="registro-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block space-y-2">
        <span className={labelClass}>Email</span>
        <input
          id="registro-email"
          name="email"
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
        <PasswordInput
          id="registro-password"
          name="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <span className="block font-mono text-[11px] text-taupe">
          Mínimo 6 caracteres.
        </span>
      </label>
      <Captcha onVerify={setCaptchaToken} refreshKey={captchaKey} />
      {error && <p className="font-mono text-xs text-[#b5483d]">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-full bg-espresso text-sm font-medium text-cream transition-colors hover:bg-bark disabled:opacity-50"
      >
        {loading ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
