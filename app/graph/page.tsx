import type { Metadata } from "next";
import { KnowledgeGraphExplorer } from "@/components/graph/knowledge-graph-explorer";
import { graphPresets } from "@/data/graph";
import { getGraph } from "@/lib/services/graph-service";

export const metadata: Metadata = {
  title: "玄象图谱",
  description: "在经典、人物、思想、术数与时代之间，寻找中国传统思想的关联与流变。",
};

type GraphPageProps = {
  searchParams: Promise<{ node?: string | string[]; nodes?: string | string[] }>;
};

export default async function GraphPage({ searchParams }: GraphPageProps) {
  const { node, nodes: nodesQuery } = await searchParams;
  const initialNodeId = typeof node === "string" ? node : undefined;
  const initialNodeIds = typeof nodesQuery === "string" ? nodesQuery.split(",").map((item) => item.trim()).filter(Boolean) : [];
  const { nodes, edges } = await getGraph();
  const passagePreset = initialNodeIds.length ? { id:"passage-context",title:"原典文句关联",description:"从当前原典文句进入相关知识实体。",nodeIds:initialNodeIds,focusNodeId:initialNodeIds[0] } : undefined;
  const presets = passagePreset ? [passagePreset, ...graphPresets] : graphPresets;

  return (
    <div className="page-shell max-w-[94rem]">
      <header className="grid gap-8 border-b pb-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end">
        <div>
          <h1 className="section-title text-4xl sm:text-5xl">玄象图谱</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            在经典、人物、思想、术数与时代之间，寻找中国传统思想的关联与流变。
          </p>
        </div>
        <p className="max-w-sm border-t pt-5 text-sm leading-7 text-muted-foreground lg:justify-self-end">
          这里呈现的不是随机网络，而是可追溯的关系与脉络。选择节点后，可继续查看溯源、并行与流变。
        </p>
      </header>
      <KnowledgeGraphExplorer nodes={nodes} edges={edges} presets={presets} initialNodeId={initialNodeId ?? initialNodeIds[0]} initialPresetId={passagePreset?.id} />
    </div>
  );
}
