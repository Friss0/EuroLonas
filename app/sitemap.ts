import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { getAllProductos } from "@/lib/queries";
import { APLICACIONES } from "@/lib/aplicaciones";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const estaticas: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/productos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/telas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/insumos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const apps: MetadataRoute.Sitemap = APLICACIONES.map((a) => ({
    url: `${base}/aplicaciones/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let productos: MetadataRoute.Sitemap = [];
  try {
    const list = await getAllProductos();
    productos = list.map((p) => ({
      url: `${base}/producto/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    /* si la DB falla, devolvemos el sitemap sin productos */
  }

  return [...estaticas, ...apps, ...productos];
}
