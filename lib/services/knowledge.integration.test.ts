import { describe, expect, it } from "vitest";
import { getKnowledgeEntry } from "@/lib/services/knowledge-service";
import { getGraph } from "@/lib/services/graph-service";
import { searchKnowledge } from "@/lib/services/search-service";

describe("knowledge database integration", () => {
  it("reads core entries and returns null for an unknown slug", async () => {
    const [wuxing, wangbi, zhouyi, missing] = await Promise.all([
      getKnowledgeEntry("concept", "wuxing"), getKnowledgeEntry("person", "wangbi"), getKnowledgeEntry("classic", "zhouyi"), getKnowledgeEntry("concept", "not-a-real-entry"),
    ]);
    expect(wuxing?.title).toBe("五行"); expect(wangbi?.title).toBe("王弼"); expect(zhouyi?.title).toBe("周易"); expect(missing).toBeNull();
    expect(wuxing?.references[0]?.sourceTitle).toBe("《尚书》");
  });
  it("projects domain records and relations into the graph", async () => {
    const graph = await getGraph();
    expect(graph.nodes.find((node) => node.id === "wuxing")?.href).toBe("/knowledge/wuxing");
    expect(graph.edges.some((edge) => edge.source === "wangbi" && edge.target === "weijin-xuanxue")).toBe(true);
  });
  it("searches titles and aliases", async () => {
    const [title, alias] = await Promise.all([searchKnowledge("周易"), searchKnowledge("易经")]);
    expect(title.some((item) => item.id === "zhouyi")).toBe(true); expect(alias.some((item) => item.id === "zhouyi")).toBe(true);
  });
});
