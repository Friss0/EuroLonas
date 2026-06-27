"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { SortSelect } from "./SortSelect";

type Cat = { id: string; nombre: string; slug: string };

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

function CatSelect({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: Cat[];
  value: string;
  onPick: (slug: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onPick(e.target.value)}
        aria-label={`Categorías de ${label}`}
        className={selectClass}
      >
        <option value="">{label} — todas</option>
        {options.map((o) => (
          <option key={o.id} value={o.slug}>
            {o.nombre}
          </option>
        ))}
      </select>
      <Chevron />
    </div>
  );
}

export function ProductosFilters({
  telas,
  insumos,
}: {
  telas: Cat[];
  insumos: Cat[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const current = sp.get("categoria") ?? "";

  function pick(slug: string) {
    const params = new URLSearchParams(sp.toString());
    if (slug) params.set("categoria", slug);
    else params.delete("categoria");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/productos?${qs}` : "/productos");
  }

  const telasVal = telas.some((c) => c.slug === current) ? current : "";
  const insumosVal = insumos.some((c) => c.slug === current) ? current : "";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <CatSelect label="Telas" options={telas} value={telasVal} onPick={pick} />
        <CatSelect
          label="Insumos"
          options={insumos}
          value={insumosVal}
          onPick={pick}
        />
        {current && (
          <button
            type="button"
            onClick={() => pick("")}
            className="flex h-11 items-center rounded-sm px-3 font-mono text-xs uppercase tracking-[0.14em] text-taupe transition-colors hover:text-camel"
          >
            Limpiar
          </button>
        )}
      </div>
      <SortSelect />
    </div>
  );
}
