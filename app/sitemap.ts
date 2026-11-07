import type { MetadataRoute } from "next";
import { business } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/treatments", "/book", "/team", "/reviews", "/gifts", "/gallery", "/visit", "/policies"].map((p) => ({
    url: `${business.url}${p}`,
  }));
}
