/**
 * URL pública del sitio (sin barra final).
 * - En Vercel se resuelve sola desde VERCEL_PROJECT_PRODUCTION_URL.
 * - Si tenés dominio propio, seteá NEXT_PUBLIC_SITE_URL en Vercel.
 * - En local cae a http://localhost:3000.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
