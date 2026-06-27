"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { actualizarPerfil } from "@/app/perfil/actions";

const inputClass =
  "h-11 w-full rounded-sm border border-line bg-paper px-3 text-bark outline-none transition-colors focus:border-camel";
const labelClass = "font-mono text-xs uppercase tracking-[0.16em] text-cocoa";

export function ConfigForm({
  email,
  defaultNombre,
  defaultTelefono,
}: {
  email: string;
  defaultNombre: string;
  defaultTelefono: string;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(defaultNombre);
  const [telefono, setTelefono] = useState(defaultTelefono);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setDone(false);
    const res = await actualizarPerfil({ nombre, telefono });
    if ("error" in res) {
      setError(res.error);
      setSaving(false);
      return;
    }
    setDone(true);
    setSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className={labelClass}>Email</span>
        <input
          value={email}
          disabled
          className={`${inputClass} cursor-not-allowed text-taupe`}
        />
        <span className="block font-mono text-[11px] text-taupe">
          El email no se puede cambiar.
        </span>
      </label>
      <label className="block space-y-2">
        <span className={labelClass}>Nombre completo</span>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block space-y-2">
        <span className={labelClass}>Teléfono</span>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={inputClass}
        />
      </label>
      {error && <p className="font-mono text-xs text-[#b5483d]">{error}</p>}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex h-12 items-center justify-center rounded-sm bg-espresso px-8 text-sm font-medium text-cream transition-colors hover:bg-bark disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {done && (
          <span className="font-mono text-xs text-camel">Guardado ✓</span>
        )}
      </div>
    </form>
  );
}
