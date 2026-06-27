"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const PERIODOS = [
  { value: "", label: "Todo" },
  { value: "hoy", label: "Hoy" },
  { value: "mes", label: "Este mes" },
  { value: "anio", label: "Este año" },
];

export function DashboardFilters({
  productos,
}: {
  productos: { id: string; nombre: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const periodo = sp.get("periodo") ?? "";
  const producto = sp.get("producto") ?? "";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {PERIODOS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setParam("periodo", p.value)}
            className={`flex h-9 items-center rounded-lg border px-3.5 text-sm transition ${
              periodo === p.value
                ? "border-camel bg-camel text-paper"
                : "border-line text-bark hover:border-camel-soft"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <select
          value={producto}
          onChange={(e) => setParam("producto", e.target.value)}
          aria-label="Filtrar por producto"
          className="h-9 cursor-pointer appearance-none rounded-lg border border-line bg-paper pl-3 pr-8 text-sm text-bark outline-none transition-colors hover:border-camel-soft focus:border-camel"
        >
          <option value="">Todos los productos</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-taupe"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
