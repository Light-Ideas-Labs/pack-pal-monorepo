import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://packpal.app";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/features`, lastModified: new Date() },
    { url: `${base}/pricing`, lastModified: new Date() },
    { url: `${base}/docs`, lastModified: new Date() }
  ];
}
