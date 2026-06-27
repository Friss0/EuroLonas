import Link from "next/link";

function build(basePath: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export function Pagination({
  basePath,
  current,
  totalPages,
  params,
}: {
  basePath: string;
  current: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) =>
    build(basePath, { ...params, page: p > 1 ? String(p) : undefined });

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Paginación"
      className="mt-14 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={href(Math.max(1, current - 1))}
        aria-disabled={current === 1}
        className={`flex h-10 items-center rounded-sm border border-line px-3 font-mono text-xs uppercase tracking-[0.14em] ${
          current === 1
            ? "pointer-events-none opacity-40"
            : "text-bark hover:border-camel-soft"
        }`}
      >
        ← Anterior
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === current ? "page" : undefined}
          className={`flex h-10 w-10 items-center justify-center rounded-sm border font-mono text-xs ${
            p === current
              ? "border-camel bg-camel text-paper"
              : "border-line text-bark hover:border-camel-soft"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={href(Math.min(totalPages, current + 1))}
        aria-disabled={current === totalPages}
        className={`flex h-10 items-center rounded-sm border border-line px-3 font-mono text-xs uppercase tracking-[0.14em] ${
          current === totalPages
            ? "pointer-events-none opacity-40"
            : "text-bark hover:border-camel-soft"
        }`}
      >
        Siguiente →
      </Link>
    </nav>
  );
}
