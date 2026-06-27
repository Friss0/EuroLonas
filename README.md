# Eurolonas

Sitio e-commerce de **Eurolonas**, distribuidor oficial en Argentina de lonas técnicas **Sauleda**.
Construido por el estudio Qvanta.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Supabase · Vercel.

Documentos de proyecto: [`DESIGN.md`](./DESIGN.md) (sistema de diseño) · [`PRODUCT.md`](./PRODUCT.md) (contexto y fases).

## Cómo correr

```bash
npm install
cp .env.local.example .env.local   # completar con los valores de Supabase
npm run dev                          # http://localhost:3000
```

Otros scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Estructura

```
app/                    App Router (layout, globals.css, páginas)
components/             Componentes de UI
hooks/                  Hooks de cliente (useReveal, …)
lib/
  supabase/             Clientes Supabase (client / server)
  types.ts              Tipos de dominio
supabase/migrations/    Esquema SQL + RLS + seed de taxonomía
public/                 Assets estáticos
  videos/Sauleda.mp4    Video del hero (ver nota abajo)
```

## Supabase

1. Crear un proyecto en Supabase y completar `.env.local`.
2. Aplicar las migraciones de `supabase/migrations/` en orden (SQL Editor o `supabase db push`):
   - `0001_schema.sql` — tablas + RLS.
   - `0002_seed_taxonomia.sql` — siembra rubros, aplicaciones y categorías (fijas, no editables).
   - `0003_seed_demo_productos.sql` — productos DEMO para ver el sitio (reemplazar por el catálogo real).
3. (Opcional) Generar tipos: `supabase gen types typescript --linked > lib/database.types.ts`.

**RLS:** lectura pública sólo de productos/variantes `activo = true`; escritura del catálogo
sólo para usuarios autenticados; pedidos restringidos a autenticados (el checkout inserta con la
service role en Server Actions).

## Nota sobre el video del hero

`public/videos/Sauleda.mp4` pesa ~101 MB: **no se commitea** (está en `.gitignore`) ni se sube tal
cual a Vercel. Antes de Fase 2 hay que **comprimirlo** (target ~5–10 MB para un loop de hero) o
**hospedarlo** en Supabase Storage / un CDN y referenciarlo por URL.

## Fases

Ver [`PRODUCT.md`](./PRODUCT.md). Estado actual: **Fase 1 (scaffold) completa**. Sigue Fase 2
(sitio público).
