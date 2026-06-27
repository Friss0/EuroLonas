-- Eurolonas — Storage: bucket público de imágenes de productos.
-- Aplicar después de 0004 (usa la función public.is_admin()).

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Lectura pública de las imágenes del bucket.
drop policy if exists "productos_storage_public_read" on storage.objects;
create policy "productos_storage_public_read" on storage.objects
  for select using (bucket_id = 'productos');

-- Escritura (subir / actualizar / borrar) solo para admin.
drop policy if exists "productos_storage_admin_insert" on storage.objects;
create policy "productos_storage_admin_insert" on storage.objects
  for insert with check (bucket_id = 'productos' and public.is_admin());

drop policy if exists "productos_storage_admin_update" on storage.objects;
create policy "productos_storage_admin_update" on storage.objects
  for update using (bucket_id = 'productos' and public.is_admin());

drop policy if exists "productos_storage_admin_delete" on storage.objects;
create policy "productos_storage_admin_delete" on storage.objects
  for delete using (bucket_id = 'productos' and public.is_admin());
