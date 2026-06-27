import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/** Usuario autenticado actual (o null). */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export type ProfileConEmail = Profile & { email: string | null };

/** Perfil del usuario actual (con su email), o null si no hay sesión. */
export async function getProfile(): Promise<ProfileConEmail | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (!data) return null;
  return { ...(data as Profile), email: user.email ?? null };
}
