import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/knowledge-service", () => ({
  knowledgeService: {
    listConcepts: vi.fn(),
    listClassics: vi.fn(),
    listPeople: vi.fn(),
    listSchools: vi.fn(),
    listTechniques: vi.fn(),
  },
}));

import { metadata } from "@/app/layout";
import robots from "@/app/robots";
import sitemap, { buildSitemap } from "@/app/sitemap";
import { knowledgeService } from "@/lib/services/knowledge-service";

describe("public site discovery", () => {
  it("publishes canonical and social metadata from APP_URL", () => {
    expect(metadata.metadataBase).toEqual(new URL(process.env.APP_URL ?? "http://localhost:3000"));
    expect(metadata.alternates).toEqual({ canonical: "/" });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: "/", siteName: "玄象" });
  });

  it("blocks private, development, API and AI question surfaces", () => {
    const result = robots();
    expect(result.rules).toMatchObject({
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/dev", "/api", "/ask"],
    });
    expect(result.sitemap).toBe(`${process.env.APP_URL ?? "http://localhost:3000"}/sitemap.xml`);
  });

  it("builds dynamic URLs exclusively from supplied published records", () => {
    const urls = buildSitemap("https://example.com", {
      concepts: [{ slug: "yinyang", updatedAt: new Date("2026-01-02") }],
      classics: [{ slug: "zhouyi", updatedAt: new Date("2026-01-03") }],
      people: [{ slug: "wang-bi", updatedAt: new Date("2026-01-04") }],
      schools: [{ slug: "xuanxue", updatedAt: new Date("2026-01-05") }],
      techniques: [{ slug: "bazi", updatedAt: new Date("2026-01-06") }],
    }).map((entry) => entry.url);

    expect(urls).toContain("https://example.com/knowledge/yinyang");
    expect(urls).toContain("https://example.com/classics/zhouyi/read");
    expect(urls).not.toContain("https://example.com/ask");
    expect(urls.some((url) => /studio|dev|api/.test(url))).toBe(false);
  });

  it("degrades to static public URLs when the database is unavailable", async () => {
    vi.mocked(knowledgeService.listConcepts).mockRejectedValueOnce(new Error("database unavailable"));
    vi.mocked(knowledgeService.listClassics).mockResolvedValueOnce([] as never);
    vi.mocked(knowledgeService.listPeople).mockResolvedValueOnce([] as never);
    vi.mocked(knowledgeService.listSchools).mockResolvedValueOnce([] as never);
    vi.mocked(knowledgeService.listTechniques).mockResolvedValueOnce([] as never);

    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain(`${process.env.APP_URL ?? "http://localhost:3000"}/privacy`);
    expect(urls).not.toContain(`${process.env.APP_URL ?? "http://localhost:3000"}/ask`);
  });
});
