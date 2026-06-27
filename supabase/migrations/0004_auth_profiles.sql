-- Eurolonas — autenticación: perfiles, roles (cliente/admin) y pedidos por usuario.
-- Aplicar DESPUÉS de 0001/0002/0003.

-- ────────────────────────────────────────────────────────────────────────────
-- Perfiles (1:1 con auth.users)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nombre     text,
  telefono   text,
  rol        text not null default 'cliente' check (rol in ('cliente', 'admin')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Cada usuario ve y edita su propio perfil.
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ¿El usuario actual es admin? (security definer evita recursión de RLS)
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and rol = 'admin'
  );
$$;

-- Crear el perfil automáticamente al registrarse.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre)
  values (new.id, new.raw_user_meta_data->>'nombre')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ────────────────────────────────────────────────────────────────────────────
-- Pedidos ligados al usuario
-- ────────────────────────────────────────────────────────────────────────────
alter table pedidos
  add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists idx_pedidos_user on pedidos(user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- RLS: el catálogo y la taxonomía solo los edita un admin (lectura sigue pública)
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "productos_admin_all" on productos;
drop policy if exists "variantes_admin_all" on variantes;
drop policy if exists "prodapp_admin_all" on producto_aplicacion;

create policy "productos_admin_all" on productos
  for all using (is_admin()) with check (is_admin());
create policy "variantes_admin_all" on variantes
  for all using (is_admin()) with check (is_admin());
create policy "prodapp_admin_all" on producto_aplicacion
  for all using (is_admin()) with check (is_admin());

create policy "rubros_admin_all" on rubros
  for all using (is_admin()) with check (is_admin());
create policy "categorias_admin_all" on categorias
  for all using (is_admin()) with check (is_admin());
create policy "aplicaciones_admin_all" on aplicaciones
  for all using (is_admin()) with check (is_admin());

-- ────────────────────────────────────────────────────────────────────────────
-- RLS: pedidos — admin ve/gestiona todo; cada cliente ve y crea los suyos
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "pedidos_admin_all" on pedidos;
drop policy if exists "pedido_items_admin_all" on pedido_items;

create policy "pedidos_admin_all" on pedidos
  for all using (is_admin()) with check (is_admin());
create policy "pedidos_select_own" on pedidos
  for select using (auth.uid() = user_id);
create policy "pedidos_insert_own" on pedidos
  for insert with check (auth.uid() = user_id);

create policy "pedido_items_admin_all" on pedido_items
  for all using (is_admin()) with check (is_admin());
create policy "pedido_items_select_own" on pedido_items
  for select using (
    exists (
      select 1 from pedidos p
      where p.id = pedido_items.pedido_id and p.user_id = auth.uid()
    )
  );
create policy "pedido_items_insert_own" on pedido_items
  for insert with check (
    exists (
      select 1 from pedidos p
      where p.id = pedido_items.pedido_id and p.user_id = auth.uid()
    )
  );
