"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function actualizarPerfil(input: {
  nombre: string;
  telefono: string;
}): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No hay sesión." };
  const { error } = await supabase
    .from("profiles")
    .update({
      nombre: input.nombre.trim() || null,
      telefono: input.telefono.trim() || null,
    })
    .eq("id", user.id);
  if (error) return { error: "No se pudieron guardar los cambios." };
  revalidatePath("/perfil");
  return { ok: true };
}
