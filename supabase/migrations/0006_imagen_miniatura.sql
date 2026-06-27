-- Miniatura de la card de producto.
-- Si es NULL, el front usa como fallback la foto del primer color cargado
-- (o, si no hay color con foto, la primera imagen del producto).
alter table productos
  add column if not exists imagen_miniatura text;
