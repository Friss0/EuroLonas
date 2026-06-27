/** Mosaico de colores que rellena un área. Placeholder visual on-brand cuando no hay foto. */
export function SwatchMosaic({
  hexes,
  className = "",
}: {
  hexes: string[];
  className?: string;
}) {
  const colors = hexes.slice(0, 9);
  if (colors.length === 0) return null;
  const cols = colors.length <= 1 ? 1 : colors.length <= 4 ? 2 : 3;
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: "1fr",
      }}
      aria-hidden
    >
      {colors.map((c, i) => (
        <span key={i} style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}
