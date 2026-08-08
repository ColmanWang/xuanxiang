import type { Metadata } from "next";
import { KnowledgeGraphExplorer } from "@/components/graph/knowledge-graph-explorer";
import { graphEdges, graphNodes } from "@/data/graph";

export const metadata: Metadata = {
  title: "知识图谱",
  description:
    "沿着经典、概念、人物、学派与术数之间的关系，探索中国传统思想与术数知识网络。",
};

export default function GraphPage() {
  return (
    <div className="page-shell max-w-[90rem]">
      <header className="grid gap-8 border-b pb-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
        <div>
          <h1 className="section-title text-4xl sm:text-5xl">知识之间，关系成网</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            从经典、概念、人物、学派与术数五类实体出发，查看它们如何彼此阐释、汇合、影响与派生。
          </p>
        </div>
        <p className="max-w-sm border-t pt-5 text-sm leading-7 text-muted-foreground lg:justify-self-end">
          箭头从关系的发起实体指向接受实体。选择任一节点，可在右侧查看其定义与直接关系。
        </p>
      </header>

      <KnowledgeGraphExplorer nodes={graphNodes} edges={graphEdges} />
    </div>
  );
}
