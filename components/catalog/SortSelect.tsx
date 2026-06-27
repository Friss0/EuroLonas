"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ORDEN_OPCIONES } from "@/lib/format";

const selectClass =
  "h-11 cursor-pointer appearance-none rounded-sm border border-line bg-paper pl-4 pr-9 text-sm text-bark transition-colors hover:border-camel-soft focus:border-camel focus:outline-none";

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-taupe"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.get("orden") ?? "";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(sp.toString());
    const v = e.target.value;
    if (v) params.set("orden", v);
    else params.delete("orden");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-taupe">
        Ordenar
      </span>
      <div className="relative">
        <select
          value={current}
          onChange={onChange}
          aria-label="Ordenar productos"
          className={selectClass}
        >
          {ORDEN_OPCIONES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Chevron />
      </div>
    </div>
  );
}
