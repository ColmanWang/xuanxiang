import { describe, expect, it } from "vitest";
import { graphEdges, graphEntityRecords, graphNodes, graphPresets } from "@/data/graph";
import { adaptGraphEntities, projectGraph } from "@/lib/graph/adapter";
import { filterGraph } from "@/lib/graph/filters";
import { findPath } from "@/lib/graph/path";
import {
  getDownstreamRelations,
  getParallelRelations,
  getUpstreamRelations,
} from "@/lib/graph/relations";

describe("graph adapter", () => {
  it("projects domain records into typed graph nodes", () => {
    const nodes = adaptGraphEntities(graphEntityRecords);
    expect(nodes.find((node) => node.id === "zhouyi")).toMatchObject({
      title: "周易",
      entityType: "classic",
      href: "/classics/zhouyi",
    });
  });

  it("limits edges to the requested projection", () => {
    const projection = projectGraph(graphEntityRecords, graphEdges, ["zhouyi", "yixue"]);
    expect(projection.nodes).toHaveLength(2);
    expect(projection.edges.some((edge) => edge.source === "zhouyi" && edge.target === "yixue")).toBe(true);
  });
});

describe("relation lineage", () => {
  it("finds the required representative relations", () => {
    expect(getUpstreamRelations("zhouyi", graphEdges).some((edge) => edge.target === "yixue")).toBe(true);
    expect(getParallelRelations("yinyang", graphEdges).some((edge) => edge.target === "wuxing")).toBe(true);
    expect(getUpstreamRelations("wangbi", graphEdges).some((edge) => edge.target === "weijin-xuanxue")).toBe(true);
  });

  it("separates upstream, parallel and downstream", () => {
    expect(getUpstreamRelations("sizhu-mingli", graphEdges).some((edge) => edge.target === "tiangan")).toBe(true);
    expect(getParallelRelations("qimen-dunjia", graphEdges).some((edge) => edge.target === "daliuren")).toBe(true);
    expect(getDownstreamRelations("wuxing", graphEdges).some((edge) => edge.source === "sizhu-mingli")).toBe(true);
  });
});

describe("path exploration", () => {
  it("finds a path from Zhouyi to Qimen", () => {
    const path = findPath("zhouyi", "qimen-dunjia", graphNodes, graphEdges);
    expect(path).not.toBeNull();
    expect(path?.nodes.at(0)?.id).toBe("zhouyi");
    expect(path?.nodes.at(-1)?.id).toBe("qimen-dunjia");
    expect(path?.edges.length).toBe((path?.nodes.length ?? 1) - 1);
  });

  it("returns null for an unknown endpoint", () => {
    expect(findPath("zhouyi", "not-found", graphNodes, graphEdges)).toBeNull();
  });
});

describe("graph filters", () => {
  it("searches Chinese titles and aliases", () => {
    const result = filterGraph(graphNodes, graphEdges, { query: "八字", entityTypes: [], dynasty: "全部" });
    expect(result.nodes.map((node) => node.id)).toContain("sizhu-mingli");
  });

  it("filters by entity type, era and curated preset", () => {
    const typeResult = filterGraph(graphNodes, graphEdges, { query: "", entityTypes: ["person"], dynasty: "魏晋南北朝" });
    expect(typeResult.nodes.map((node) => node.id)).toEqual(expect.arrayContaining(["wangbi", "heyan", "guoxiang"]));

    const presetResult = filterGraph(graphNodes, graphEdges, { query: "", entityTypes: [], dynasty: "全部", presetId: "two-roads-of-yi" }, graphPresets);
    expect(presetResult.nodes.every((node) => graphPresets[0].nodeIds.includes(node.id))).toBe(true);
  });
});
