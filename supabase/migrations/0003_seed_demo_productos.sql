-- Eurolonas — productos DEMO para desarrollar y mostrar la Fase 2.
-- Reemplazar por el catálogo real cuando esté la lista de precios.
-- Idempotente: los productos usan `on conflict (slug) do nothing` y las variantes sólo
-- se insertan si el producto aún no tiene ninguna (guard `not exists`).
-- Requiere haber corrido 0001_schema.sql y 0002_seed_taxonomia.sql.

-- ── Productos ───────────────────────────────────────────────────────────────
insert into productos (codigo, nombre, slug, rubro_id, categoria_id, descripcion, ficha_tecnica, precio_base, unidad_venta, destacado, activo, orden)
select v.codigo, v.nombre, v.slug, r.id, c.id, v.descripcion, v.ficha_tecnica, v.precio_base, v.unidad_venta, v.destacado, true, v.orden
from (values
  -- TELAS
  ('LA120', 'Lona Acrílica Sauleda 1,20', 'lona-acrilica-120', 'telas', 'lona-acrilica',
   'Acrílico teñido en masa para toldos y tapicería exterior. Ancho 1,20 m. Resistente a la intemperie y a la decoloración.',
   'Composición: 100% acrílico teñido en masa. Ancho: 1,20 m. Peso: ~300 g/m². Tratamiento antihongos e hidrófugo.',
   12400, 'metro', true, 1),
  ('LA150', 'Lona Acrílica Sauleda 1,50', 'lona-acrilica-150', 'telas', 'lona-acrilica',
   'Acrílico teñido en masa, ancho 1,50 m. Ideal para toldos de mayor luz y aplicaciones náuticas.',
   'Composición: 100% acrílico teñido en masa. Ancho: 1,50 m. Peso: ~300 g/m². Tratamiento antihongos e hidrófugo.',
   15600, 'metro', true, 2),
  ('SOL92', 'Lona Microperforada Soltis 92', 'soltis-92', 'telas', 'lona-microperforada',
   'Textil microperforado que filtra el sol sin cortar la visión ni la ventilación. Para toldos y protección solar.',
   'Composición: PVC sobre malla de poliéster. Apertura: ~5%. Ancho: 1,77 m.',
   21800, 'metro', false, 3),
  ('CRPVC', 'Cristal PVC Achilles', 'cristal-pvc-achilles', 'telas', 'cristal-pvc',
   'Film de PVC cristal de alta transparencia para cerramientos náuticos y de exterior.',
   'Material: PVC cristal. Espesor: 0,5 mm. Ancho: 1,40 m.',
   18900, 'rollo', false, 4),
  -- INSUMOS PARA TOLDOS
  ('BRZINV', 'Brazo invisible reforzado', 'brazo-invisible', 'insumos', 'brazos',
   'Brazo articulado invisible para toldos extensibles. Se vende por juego (par).',
   'Material: aluminio + cable de acero. Tensión por resorte. Juego = 2 brazos.',
   null, 'juego', true, 5),
  ('TUBNERV', 'Tubo nervado Ø70', 'tubo-nervado-70', 'insumos', 'tubos-barras',
   'Tubo de enrolle nervado de 70 mm para toldos. Disponible nacional o italiano.',
   'Material: aluminio. Diámetro: 70 mm. Nervado para fijación de lona.',
   null, 'metro', false, 6),
  ('MOT40', 'Motor tubular 40 Nm', 'motor-tubular-40', 'insumos', 'motores-automatizacion',
   'Motor tubular para toldos de hasta 40 Nm. Opción con o sin receptor de radio.',
   'Torque: 40 Nm. Alimentación: 220 V. Final de carrera mecánico.',
   null, 'unidad', false, 7)
) as v(codigo, nombre, slug, rubro_slug, cat_slug, descripcion, ficha_tecnica, precio_base, unidad_venta, destacado, orden)
join rubros r     on r.slug = v.rubro_slug
join categorias c on c.slug = v.cat_slug and c.rubro_id = r.id
on conflict (slug) do nothing;

-- ── Variantes de color (Telas) ──────────────────────────────────────────────
insert into variantes (producto_id, tipo, nombre, codigo, swatch_hex, sku, precio_override, stock, activo, orden)
select p.id, 'color', d.nombre, d.codigo, d.hex, p.codigo || '-' || d.codigo, null, d.stock, true, d.orden
from productos p
join (values
  ('lona-acrilica-120', 'Crudo',       'U104', '#E8E0CE', 120, 1),
  ('lona-acrilica-120', 'Beige',       'U108', '#D9C7A3',  80, 2),
  ('lona-acrilica-120', 'Terracota',   'U171', '#B5483D',  60, 3),
  ('lona-acrilica-120', 'Verde Oliva', 'U145', '#7E8A6B',  45, 4),
  ('lona-acrilica-120', 'Azul Marino', 'U188', '#2F3D52',  90, 5),
  ('lona-acrilica-120', 'Gris Plomo',  'U160', '#5A5145',  30, 6),
  ('lona-acrilica-150', 'Crudo',       'U104', '#E8E0CE', 100, 1),
  ('lona-acrilica-150', 'Terracota',   'U171', '#B5483D',  50, 2),
  ('lona-acrilica-150', 'Azul Marino', 'U188', '#2F3D52',  70, 3),
  ('lona-acrilica-150', 'Bordó',       'U176', '#6E2A33',  40, 4),
  ('soltis-92',         'Perla',       'S2044', '#D8D2C4', 60, 1),
  ('soltis-92',         'Antracita',   'S2135', '#3A3A3C', 55, 2),
  ('soltis-92',         'Arena',       'S2171', '#C2A878', 48, 3),
  ('cristal-pvc-achilles', 'Transparente', 'CR00', '#EAF2F2', 20, 1),
  ('cristal-pvc-achilles', 'Humo',         'CR07', '#9AA0A0', 15, 2)
) as d(prod_slug, nombre, codigo, hex, stock, orden) on d.prod_slug = p.slug
where not exists (select 1 from variantes vx where vx.producto_id = p.id);

-- ── Variantes de medida / modelo (Insumos) ──────────────────────────────────
insert into variantes (producto_id, tipo, nombre, codigo, sku, precio_override, stock, activo, orden)
select p.id, d.tipo, d.nombre, d.codigo, p.codigo || '-' || d.codigo, d.precio, d.stock, true, d.orden
from productos p
join (values
  ('brazo-invisible',   'medida', '1,60 m',           '160', 86000,  12, 1),
  ('brazo-invisible',   'medida', '2,10 m',           '210', 98000,  10, 2),
  ('brazo-invisible',   'medida', '2,60 m',           '260', 112000,  8, 3),
  ('tubo-nervado-70',   'modelo', 'Nacional',         'NAC', 7400,   40, 1),
  ('tubo-nervado-70',   'modelo', 'Italiano',         'ITA', 9900,   25, 2),
  ('motor-tubular-40',  'modelo', 'Sin receptor',     'SR',  78000,  15, 1),
  ('motor-tubular-40',  'modelo', 'Con receptor RF',  'RF',  94000,  11, 2)
) as d(prod_slug, tipo, nombre, codigo, precio, stock, orden) on d.prod_slug = p.slug
where not exists (select 1 from variantes vx where vx.producto_id = p.id);

-- ── Aplicaciones de las Telas (many-to-many) ────────────────────────────────
insert into producto_aplicacion (producto_id, aplicacion_id)
select p.id, a.id
from productos p
join (values
  ('lona-acrilica-120', 'toldos'),
  ('lona-acrilica-120', 'tapiceria-exterior'),
  ('lona-acrilica-150', 'toldos'),
  ('lona-acrilica-150', 'nautica'),
  ('soltis-92',         'toldos'),
  ('cristal-pvc-achilles', 'nautica')
) as d(prod_slug, app_slug) on d.prod_slug = p.slug
join aplicaciones a on a.slug = d.app_slug
on conflict do nothing;
