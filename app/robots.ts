import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Privadas / no indexables
      disallow: ["/admin", "/perfil", "/checkout", "/login", "/registro"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
