-- Eurolonas — siembra de la taxonomía fija (rubros, aplicaciones, categorías).
-- Idempotente (on conflict do nothing): se puede re-ejecutar sin duplicar.
-- NOTA: las categorías son PROVISORIAS; refinar con la lista de precios real de Eurolonas.

insert into rubros (nombre, slug) values
  ('Telas', 'telas'),
  ('Insumos para toldos', 'insumos')
on conflict (slug) do nothing;

insert into aplicaciones (nombre, slug) values
  ('Toldos', 'toldos'),
  ('Tapicería exterior', 'tapiceria-exterior'),
  ('Náutica', 'nautica')
on conflict (slug) do nothing;

-- Categorías de Telas
insert into categorias (rubro_id, nombre, slug, orden)
select r.id, c.nombre, c.slug, c.orden
from rubros r
cross join (values
  ('Lona acrílica',                'lona-acrilica',       1),
  ('Lona microperforada (Soltis)', 'lona-microperforada', 2),
  ('Cristal PVC',                  'cristal-pvc',         3)
) as c(nombre, slug, orden)
where r.slug = 'telas'
on conflict (rubro_id, slug) do nothing;

-- Categorías de Insumos para toldos
insert into categorias (rubro_id, nombre, slug, orden)
select r.id, c.nombre, c.slug, c.orden
from rubros r
cross join (values
  ('Tubos y barras',            'tubos-barras',           1),
  ('Calotas y soportes',        'calotas-soportes',       2),
  ('Brazos',                    'brazos',                 3),
  ('Terminales',                'terminales',             4),
  ('Motores y automatización',  'motores-automatizacion', 5),
  ('Máquinas',                  'maquinas',               6),
  ('Hilos',                     'hilos',                  7),
  ('Cubretoldos',               'cubretoldos',            8),
  ('Resortes y accesorios',     'resortes-accesorios',    9)
) as c(nombre, slug, orden)
where r.slug = 'insumos'
on conflict (rubro_id, slug) do nothing;
