import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { graphEdges, graphNodeMap, graphNodes } from "@/data/graph";
import { evidenceLabels, getOtherNodeId, getRelationsForNode, relationLabels } from "@/lib/graph/relations";

interface KnowledgeRelationsProps {
  slug: string;
  title: string;
  heading?: string;
}

export function KnowledgeRelations({ slug, title, heading = "知识关系" }: KnowledgeRelationsProps) {
  const node = graphNodes.find((item) => item.slug === slug || item.title === title);
  if (!node) return null;
  const relations = getRelationsForNode(node.id, graphEdges);
  const sections = [
    ["来源于", relations.filter((edge) => edge.source === node.id && ["DERIVED_FROM", "INFLUENCED_BY", "USES"].includes(edge.type))],
    ["属于", relations.filter((edge) => edge.source === node.id && edge.type === "BELONGS_TO")],
    ["相关经典", relations.filter((edge) => graphNodeMap.get(getOtherNodeId(edge, node.id))?.entityType === "classic")],
    ["相关人物", relations.filter((edge) => graphNodeMap.get(getOtherNodeId(edge, node.id))?.entityType === "person")],
    ["影响与解释", relations.filter((edge) => edge.target === node.id && edge.type !== "RELATED_TO")],
  ] as const;

  return (
    <section className="border-t py-10" aria-labelledby="knowledge-relations-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 id="knowledge-relations-title" className="font-serif text-2xl">{heading}</h2><p className="mt-2 text-sm text-muted-foreground">从当前条目继续追溯经典、人物与思想脉络。</p></div>
        <Link href={`/graph?node=${node.id}`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline hover:underline-offset-4">在玄象图谱中查看 <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
      <div className="mt-6 grid border-y sm:grid-cols-2 lg:grid-cols-5">
        {sections.map(([label, sectionRelations]) => (
          <div key={label} className="min-h-36 border-b p-4 last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0">
            <h3 className="text-xs tracking-[0.12em] text-muted-foreground">{label}</h3>
            {sectionRelations.length > 0 ? <ul className="mt-3 flex flex-col gap-2.5">{sectionRelations.slice(0, 4).map((relation) => {
              const related = graphNodeMap.get(getOtherNodeId(relation, node.id));
              if (!related) return null;
              return <li key={relation.id}><span className="flex items-center gap-1.5 text-sm">{related.href ? <Link href={related.href} className="hover:text-primary hover:underline">{related.title}</Link> : related.title}{related.href ? <ArrowUpRight className="size-3" aria-hidden="true" /> : null}</span><span className="research-only mt-1 text-[10px] leading-4 text-muted-foreground">{relationLabels[relation.type]} · {evidenceLabels[relation.evidenceStatus]}{relation.sourceNote ? ` · ${relation.sourceNote}` : ""}</span></li>;
            })}</ul> : <p className="mt-3 text-xs text-muted-foreground">待补充</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
