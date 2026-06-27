import { ImageResponse } from "next/og";

export const alt = "Eurolonas — Lonas técnicas Sauleda en Argentina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen para compartir (Open Graph / Twitter). Marca crema/marrón/camel.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f2e8",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#a97c54",
            fontSize: 26,
            letterSpacing: 4,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 60, height: 8, background: "#a97c54" }} />
          Distribuidor oficial Sauleda · Argentina
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 140,
              fontWeight: 800,
              color: "#4a3324",
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            EURO LONAS
          </div>
          <div style={{ fontSize: 40, color: "#6e5d49", maxWidth: 960 }}>
            Lonas acrílicas, Soltis y Cristal PVC · Insumos para toldos
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#6b4a33",
            fontSize: 28,
          }}
        >
          <span>Telas por metro y por rollo</span>
          <span style={{ fontWeight: 700, letterSpacing: 1 }}>eurolonas</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
