import type { MetadataRoute } from "next";
import { knowledgeService } from "@/lib/services/knowledge-service";

type PublicRecord = { slug: string; updatedAt: Date };
type PublicRecords = {
  concepts: readonly PublicRecord[];
  classics: readonly PublicRecord[];
  people: readonly PublicRecord[];
  schools: readonly PublicRecord[];
  techniques: readonly PublicRecord[];
};

const staticPaths = [
  "", "/knowledge", "/classics", "/people", "/schools", "/techniques",
  "/timeline", "/systems", "/systems/deduction", "/graph", "/tools",
  "/tools/bazi", "/tools/bazi/rules", "/tools/liuyao", "/tools/liuyao/rules",
  "/search", "/privacy", "/terms",
] as const;

const siteUrl = () => (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function buildSitemap(baseUrl: string, records?: PublicRecords): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = staticPaths.map((path, index) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.7,
  }));
  if (!records) return entries;

  const add = (prefix: string, items: readonly PublicRecord[], suffix = "") => {
    entries.push(...items.map((item) => ({
      url: `${baseUrl}/${prefix}/${encodeURIComponent(item.slug)}${suffix}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })));
  };
  add("knowledge", records.concepts);
  add("classics", records.classics);
  add("classics", records.classics, "/read");
  add("people", records.people);
  add("schools", records.schools);
  add("techniques", records.techniques);
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [concepts, classics, people, schools, techniques] = await Promise.all([
      knowledgeService.listConcepts(), knowledgeService.listClassics(), knowledgeService.listPeople(),
      knowledgeService.listSchools(), knowledgeService.listTechniques(),
    ]);
    return buildSitemap(siteUrl(), { concepts, classics, people, schools, techniques });
  } catch {
    return buildSitemap(siteUrl());
  }
}
