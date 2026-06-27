-- Eurolonas — esquema inicial del e-commerce (telas + insumos para toldos).
-- Aplicar en Supabase (SQL Editor o `supabase db push`).
-- NOTA: confirmar/refinar el modelo con el equipo antes de aplicar en producción.

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────────────────────
-- Taxonomía (SEMBRADA y fija; NO editable desde el admin)
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists rubros (
  id     uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug   text not null unique
);

create table if not exists categorias (
  id       uuid primary key default gen_random_uuid(),
  rubro_id uuid not null references rubros(id) on delete cascade,
  nombre   text not null,
  slug     text not null,
  orden    int  not null default 0,
  unique (rubro_id, slug)
);

create table if not exists aplicaciones (
  id     uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug   text not null unique
);

-- ────────────────────────────────────────────────────────────────────────────
-- Catálogo (EDITABLE desde el admin)
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists productos (
  id               uuid primary key default gen_random_uuid(),
  codigo           text,
  nombre           text not null,
  slug             text not null unique,
  rubro_id         uuid not null references rubros(id),
  categoria_id     uuid references categorias(id),
  descripcion      text,
  ficha_tecnica    text,
  specs            jsonb not null default '{}'::jsonb,
  precio_base      numeric(12,2),
  unidad_venta     text not null default 'unidad'
                     check (unidad_venta in ('metro','rollo','unidad','juego')),
  imagenes         text[] not null default '{}',
  fotos_referencia text[] not null default '{}',
  destacado        boolean not null default false,
  activo           boolean not null default true,
  orden            int not null default 0,
  created_at       timestamptz not null default now()
);

create table if not exists variantes (
  id              uuid primary key default gen_random_uuid(),
  producto_id     uuid not null references productos(id) on delete cascade,
  tipo            text not null check (tipo in ('color','medida','modelo')),
  nombre          text not null,
  codigo          text,                       -- ej. código Sauleda
  swatch_url      text,                       -- muestra de color: foto de la tela (Storage)
  swatch_hex      text,                       -- color plano de respaldo para el chip (ej. '#B5483D')
  sku             text,
  precio_override numeric(12,2),
  stock           numeric(12,2),
  activo          boolean not null default true,
  orden           int not null default 0
);

-- many-to-many: sólo Telas (toldos / tapicería exterior / náutica)
create table if not exists producto_aplicacion (
  producto_id   uuid not null references productos(id) on delete cascade,
  aplicacion_id uuid not null references aplicaciones(id) on delete cascade,
  primary key (producto_id, aplicacion_id)
);

-- ────────────────────────────────────────────────────────────────────────────
-- Checkout
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists pedidos (
  id               uuid primary key default gen_random_uuid(),
  cliente_nombre   text not null,
  cliente_email    text not null,
  cliente_telefono text,
  total            numeric(12,2) not null default 0,
  estado           text not null default 'pendiente'
                     check (estado in ('pendiente','pagado','preparando','enviado','cancelado')),
  mp_payment_id    text,
  created_at       timestamptz not null default now()
);

create table if not exists pedido_items (
  id              uuid primary key default gen_random_uuid(),
  pedido_id       uuid not null references pedidos(id) on delete cascade,
  variante_id     uuid not null references variantes(id),
  cantidad        numeric(12,2) not null check (cantidad > 0),
  precio_unitario numeric(12,2) not null
);

-- ────────────────────────────────────────────────────────────────────────────
-- Índices
-- ────────────────────────────────────────────────────────────────────────────

create index if not exists idx_productos_rubro     on productos(rubro_id);
create index if not exists idx_productos_categoria  on productos(categoria_id);
create index if not exists idx_productos_activo     on productos(activo);
create index if not exists idx_variantes_producto   on variantes(producto_id);
create index if not exists idx_categorias_rubro     on categorias(rubro_id);
create index if not exists idx_pedido_items_pedido  on pedido_items(pedido_id);

-- ────────────────────────────────────────────────────────────────────────────
-- RLS (Row Level Security)
--   · Lectura pública: taxonomía + productos/variantes activos.
--   · Escritura del catálogo: sólo usuarios autenticados (admin).
--   · Pedidos: lectura/gestión sólo autenticados. Las inserciones del checkout
--     se hacen server-side con la service role (Server Actions), que bypassa RLS.
-- ────────────────────────────────────────────────────────────────────────────

alter table rubros              enable row level security;
alter table categorias          enable row level security;
alter table aplicaciones        enable row level security;
alter table productos           enable row level security;
alter table variantes           enable row level security;
alter table producto_aplicacion enable row level security;
alter table pedidos             enable row level security;
alter table pedido_items        enable row level security;

-- Taxonomía: lectura pública (la siembra y cambios se hacen por SQL / service role)
create policy "rubros_read"       on rubros       for select using (true);
create policy "categorias_read"   on categorias   for select using (true);
create policy "aplicaciones_read" on aplicaciones for select using (true);

-- Productos: lectura pública sólo de activos; gestión completa para autenticados
create policy "productos_public_read" on productos
  for select using (activo = true);
create policy "productos_admin_all" on productos
  for all to authenticated using (true) with check (true);

-- Variantes: lectura pública sólo de activas; gestión para autenticados
create policy "variantes_public_read" on variantes
  for select using (activo = true);
create policy "variantes_admin_all" on variantes
  for all to authenticated using (true) with check (true);

-- producto_aplicacion: lectura pública; gestión para autenticados
create policy "prodapp_public_read" on producto_aplicacion
  for select using (true);
create policy "prodapp_admin_all" on producto_aplicacion
  for all to authenticated using (true) with check (true);

-- Pedidos: sólo autenticados (admin). El checkout inserta con service role.
create policy "pedidos_admin_all" on pedidos
  for all to authenticated using (true) with check (true);
create policy "pedido_items_admin_all" on pedido_items
  for all to authenticated using (true) with check (true);
