# DESIGN.md — Sistema de diseño de Eurolonas

> Documento vivo. Define la dirección estética, los tokens y las reglas de UI antes de escribir
> componentes. Stack objetivo: **Next.js 16 + Tailwind 4** (config CSS-first con `@theme`).

---

## 1. Dirección estética

Minimalista, editorial, premium. Mucho aire, tipografía grande, imágenes a sangre completa.
La marca aporta calma (crema + marrón); **el color lo ponen los productos**: las lonas Sauleda
tienen 30-50 colores por línea, y ese muestrario es el héroe visual del sitio.

Tres principios:

1. **El color es del producto, no de la marca.** La paleta de marca es restringida y cálida
   (cremas y marrones). La vibración llega de los swatches reales de las telas. Nada de gradientes
   morados ni acentos saturados de marca.
2. **Restricción como lujo.** Pocos elementos por pantalla, jerarquía por escala y espacio, no por
   cajas. Sin tarjetas dentro de tarjetas. Bordes hairline antes que sombras pesadas.
3. **Detalle técnico cálido.** Códigos, SKU, medidas y metros van en monoespaciada — un guiño
   spec-sheet que diferencia de la competencia recargada (tolder / printemps) sin perder calidez.

**Elemento memorable:** la **grilla de swatches** (muestrario de color). Aparece como motivo en el
hero, como separador editorial entre secciones, en el catálogo y como selector en la ficha. Se
revela en cascada (stagger) al entrar en viewport.

---

## 2. Color

Paleta cálida: base crema/off-white + rampa de marrón para texto y acentos + camel/tierra
intermedio para jerarquía y decoración. Definida como variables para Tailwind 4 `@theme`.

```css
@theme {
  /* Fondos / superficies */
  --color-cream:       #F7F2E8; /* fondo de página */
  --color-sand:        #EFE6D6; /* banda alterna / bloque mute */
  --color-paper:       #FCFAF4; /* superficie más clara (uso puntual) */

  /* Marrones — texto y marca */
  --color-espresso:    #271B12; /* máximo contraste, overlays, titulares fuertes */
  --color-bark:        #4A3324; /* TEXTO principal + wordmark "EURO LONAS" */
  --color-cocoa:       #6B4A33; /* títulos sobre fondo sand */
  --color-taupe:       #6E5D49; /* texto secundario / labels (cumple WCAG AA en cream) */

  /* Tierra / camel — acento y decoración */
  --color-camel:       #A97C54; /* acento, líneas marcadas, estados hover */
  --color-camel-soft:  #C7A781; /* decoración, swatches placeholder */

  /* Utilidad */
  --color-line:        rgba(39, 27, 18, 0.12); /* hairlines / divisores */
  --color-line-strong: rgba(39, 27, 18, 0.24);
  --color-overlay:     rgba(31, 21, 14, 0.42); /* overlay del hero sobre el video */
}
```

**Reglas de contraste (WCAG AA):**
- Texto de cuerpo: `bark` o `espresso` sobre `cream`/`paper` (contraste alto, OK).
- Texto secundario: `taupe` sobre `cream` — verificado ~4.6:1, sólo a partir de 14px.
- `camel` y `camel-soft` **no** se usan para texto chico: sólo titulares grandes, íconos,
  bordes y decoración.
- Overlay del hero: `--color-overlay` garantiza legibilidad del titular blanco/crema sobre video.

---

## 3. Tipografía

| Rol | Familia | Uso |
|---|---|---|
| Display | **Fraunces** (variable, optical sizing) | h1–h3, hero, frases editoriales. Pesos 300–600. |
| Texto / UI | **Geist Sans** | cuerpo, navegación, botones, labels, precios. |
| Datos técnicos | **Geist Mono** | códigos Sauleda, SKU, medidas, "× metro", specs. |

Se cargan con `next/font` (self-host, sin FOUT, sin costo de licencia — todas open-source).

**Escala fluida** (clamp, mobile-first; `1rem = 16px`):

```css
--text-xs:   0.75rem;                          /* 12px — labels mono, captions */
--text-sm:   0.875rem;                         /* 14px — secundario */
--text-base: 1rem;                             /* 16px — cuerpo */
--text-lg:   1.125rem;                         /* 18px — cuerpo destacado */
--text-xl:   clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
--text-2xl:  clamp(1.6rem, 1.3rem + 1.4vw, 2.25rem);
--text-3xl:  clamp(2.1rem, 1.5rem + 2.6vw, 3.5rem);   /* títulos de sección */
--text-display: clamp(2.8rem, 1.6rem + 5.6vw, 6rem);  /* hero */
```

- Fraunces en titulares: `line-height` ajustado (1.0–1.08), `letter-spacing` levemente negativo en
  tamaños grandes (`-0.01em`).
- Geist en cuerpo: `line-height` 1.55–1.65, ancho de medida máx. ~68ch.
- Mono: `letter-spacing` 0, usar para `<code>`-like inline (código, SKU) y para el sufijo de unidad
  de venta (ej. `$ 12.400 / m`).

---

## 4. Espaciado

Base 4px. Escala usada por el layout y el ritmo vertical editorial (secciones con mucho aire):

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 px
```

- Padding de sección: `clamp(64px, 8vw, 160px)` vertical.
- Gutter de contenedor: `clamp(20px, 5vw, 80px)`.
- Ancho máximo de contenido editorial: `1280px`; texto largo: `68ch`.

---

## 5. Forma, bordes y profundidad

- **Radios mínimos.** Editorial = casi recto. `--radius-sm: 2px` (inputs, botones),
  `--radius-md: 4px` (contenedores puntuales). Imágenes y frames: `0` (sangre/recto).
- **Bordes hairline** (`--color-line`) antes que sombras. Una sola sombra suave permitida para
  drawers/modales: `0 12px 40px rgba(31,21,14,0.16)`.
- **Sin card-in-card.** Los "productos" del catálogo son imagen a sangre + texto debajo, separados
  por aire y una hairline, no por una caja con relleno y sombra.

---

## 6. Layout y grilla

- Mobile-first. Grilla de 12 columnas en desktop; el catálogo usa 2 col (mobile) → 3/4 (desktop).
- Asimetría intencional en bloques editoriales (hero, rubros, colecciones): texto desplazado,
  imágenes que rompen la grilla en momentos clave.
- Los dos accesos de rubro (Telas / Insumos) son **bloques full-bleed** a imagen completa, lado a
  lado en desktop, apilados en mobile.

---

## 7. Componente sello: la grilla de swatches

El muestrario es el motivo recurrente. Especificación base:

- Swatch = cuadrado (radius `0`), `aspect-ratio: 1`, mínimo táctil **44×44px** en el selector.
- En el selector de variante (Telas): grilla densa, swatch seleccionado con anillo `camel` +
  offset; muestra nombre + código Sauleda en mono al hover/focus.
- Como decoración (hero / separadores): fila o grilla de swatches que se **revela en cascada**
  (stagger, ver §8). Usa colores reales si hay datos, o `camel-soft`/`sand` como placeholder.
- Accesible: cada swatch es `button`/`radio` con `aria-label` (nombre + código), foco visible,
  navegable por teclado.

---

## 8. Movimiento

CSS sobre JS siempre que se pueda. La animación refuerza el sello (color que aparece), no decora.

- **Stagger de swatches:** entrada en cascada (`@keyframes`, `animation-delay` incremental o
  `transition` con `IntersectionObserver` para disparar al entrar en viewport).
- **Reveals al scroll:** fade + translateY corto (16–24px), 400–600ms, `ease-out`.
- **Hover:** subrayado que crece, leve `scale` en imágenes (1.0 → 1.03), cambio de color a `camel`.
- Respetar `prefers-reduced-motion`: desactivar translate/scale, dejar sólo opacidad.
- La entrada de página se decide en Fase 2 con la skill `page-intro-anim` (mostrar las 3 variantes:
  Stagger / Split / Loader). El Stagger encaja con el sello del muestrario.

---

## 9. Accesibilidad (línea base, no negociable)

- Tap targets ≥ **44×44px**.
- Navegación 100% operable por teclado; foco visible (anillo `camel`).
- Foco atrapado y restaurado en drawer de carrito y modales.
- Contrastes según §2. `prefers-reduced-motion` respetado.
- Imágenes con `alt` significativo; el video del hero es decorativo (`aria-hidden`, sin audio,
  con poster de fallback).

---

## 10. Tokens pendientes / a confirmar en build

- Posters/fallback del video del hero (frame estático mientras carga; el video pesa ~101MB y se
  comprimirá u hospedará aparte).
- Set final de colores de marca validado contra el logo real de Eurolonas (ajustar `bark` al
  marrón exacto del wordmark cuando tengamos el asset).
