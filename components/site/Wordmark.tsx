/** Logotipo "EURO LONAS": sans en marrón, identidad de la marca. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-sans font-semibold uppercase tracking-[0.18em] text-bark ${className}`}
    >
      Euro<span className="text-camel">lonas</span>
    </span>
  );
}
