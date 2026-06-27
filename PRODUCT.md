# PRODUCT.md — Contexto de producto: Eurolonas

> Qué es, para quién y cuál es la propuesta de valor. Base para el copy y las decisiones de UX.

---

## Qué es

**Eurolonas** es el **distribuidor oficial en Argentina de lonas técnicas Sauleda** (fabricante
español de textiles técnicos de alta gama). El sitio es un **e-commerce** con carrito, checkout y
panel de administración propio, construido por el estudio **Qvanta**.

Catálogo chico y curado: **~50 productos máximo**.

## Qué vende — dos rubros

Todo el catálogo se estructura en dos verticales. El mismo mecanismo de variantes sirve para los
dos: en Telas el eje es **color**, en Insumos es **medida/modelo**.

1. **Telas** — para toldos, tapicería exterior y náutica.
   Lona Acrílica Sauleda 1,20 y 1,50; Lona Microperforada Soltis; Cristal PVC Achilles; etc.
   - Variantes: **color** (~30-50 por producto), elegibles desde un selector de swatches.
   - Unidad de venta: **metro lineal** o **rollo**.
   - Tag adicional: aplicación (Toldos / Tapicería exterior / Náutica).

2. **Insumos para toldos** — todo lo demás de la lista de precios.
   Tubos nervados, calotas, soportes, brazos invisibles, terminales, barras, máquinas, motores y
   automatización, hilos, cubretoldos, resortes, etc.
   - Variantes: **medida/modelo** cuando aplica (brazo 1,60 / 2,10 / 2,60 m; tubo Ø70 / Ø80;
     nacional / italiano).
   - Unidad de venta: **unidad**, **juego** o **metro**.

## Para quién

- **Profesionales del rubro:** toldistas, tapiceros náuticos, arquitectos. Compran por código,
  conocen las líneas Sauleda, necesitan ficha técnica, medidas y disponibilidad claras.
- **Clientes finales:** llegan por estética y confianza; necesitan entender qué línea sirve para su
  uso (sol, lluvia, náutica) sin jerga.

El sitio tiene que servir a los dos: datos técnicos accesibles para el profesional, narrativa clara
y visual para el cliente final.

## Propuesta de valor

- **Representación oficial Sauleda** en Argentina: respaldo, originalidad y trazabilidad de las
  líneas (Solar Pro, Solar Pro Tech, Nautic, Textile).
- **Catálogo curado y honesto:** pocos productos, bien explicados, con su color/medida real y su
  precio por unidad de venta correcta (metro, rollo, juego).
- **Compra directa:** carrito y checkout, sin pasar por cotizaciones eternas. Pensado para que el
  toldista resuelva el pedido y el cliente final compre con confianza.

## Tono de voz (copy)

Español **rioplatense**, claro y sin AI-isms (se pasa por la skill `avoid-ai-writing` al cierre).

- Directo y con oficio: hablamos de lonas, metros, colores y usos reales, no de "soluciones".
- Sobrio y premium, sin grandilocuencia. La elegancia la da la claridad, no los adjetivos.
- Técnico cuando hace falta (ficha técnica, specs), humano en el resto.

## Estructura del sitio público

1. **Hero** con video de fondo (full-bleed) + titular editorial.
2. **Dos accesos de rubro:** Telas / Insumos para toldos (bloques a imagen completa).
3. **Catálogo por rubro** con filtros (categoría/subcategoría; en Telas, por aplicación).
4. **Ficha de producto:** imágenes + selector de variante (swatches en Telas / desplegable de
   medida en Insumos) → actualiza imagen, SKU, precio y stock. Secciones: Descripción, Ficha
   técnica, Fotos de referencia. Si se vende por metro, el carrito maneja cantidad en metros.
5. **Carrito + checkout** (líneas por producto + variante; pago con Mercado Pago en fase aparte).
6. **Páginas informativas estáticas:** Colecciones Sauleda y Aplicaciones (showcase de marca, no
   editables desde el admin).
7. **Marca:** representación oficial Sauleda, sobre Eurolonas, contacto (WhatsApp).

## Qué es editable y qué no

- **Editable desde `/admin`:** sólo el **catálogo** (productos, variantes, imágenes, fotos de
  referencia) y los **pedidos**.
- **Fijo/sembrado (no editable):** rubros, categorías, aplicaciones, colecciones Sauleda y la
  página de Aplicaciones (contenido estático).

## Alcance y fases

- Fase 0: diseño + contexto (este documento y `DESIGN.md`). ✅
- Fase 1: scaffold (Next 16 + Tailwind 4 + Supabase + migraciones SQL + RLS). ✅
- Fase 2: sitio público (hero → rubros → catálogo → ficha) con datos de Supabase. ✅
- Fase 3: carrito (estado client-side, drawer, subtotales). ✅
- Fase 4: auth (clientes + admin), perfil con pedidos, checkout básico (pedido sin pago) y admin (CRUD productos/variantes + Storage + pedidos). ✅
- Fase 5: pago con Mercado Pago Checkout Pro (el resto del checkout ya está hecho). ← pendiente

## Referencias

- Competencia (estructura, NO estética): tolder.com.ar, printemps.com.ar — recargadas y coloridas;
  vamos en la dirección opuesta (minimalista, editorial).
- Marca de origen: Sauleda (textiles técnicos premium) — referencia de tono, más claro y respirado.
