import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con la service_role key (bypassa RLS). SOLO server-side, para tareas
 * sin usuario autenticado (ej. el webhook de Mercado Pago). NUNCA exponer al
 * cliente ni usar la service_role key en código que llegue al browser.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
