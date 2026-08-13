import Link from "next/link";
import { evidenceStatusLabels, relationTypeLabels } from "@/lib/knowledge/labels";
import type { KnowledgeRelationView } from "@/lib/knowledge/types";

export function RelationCard({ relation, subject }: { relation: KnowledgeRelationView; subject: string }) {
  const phrase = relation.direction === "outgoing" ? `${subject} ${relationTypeLabels[relation.type]} ${relation.title}` : `${relation.title} ${relationTypeLabels[relation.type]} ${subject}`;
  return <article className="group border-b py-4 last:border-b-0">
    <div className="flex items-start justify-between gap-4"><p className="text-sm leading-6">{phrase}</p>{relation.href ? <Link href={relation.href} className="shrink-0 text-xs text-muted-foreground underline-offset-4 hover:underline">查看条目</Link> : <span className="text-xs text-muted-foreground">详情建设中</span>}</div>
    <div className="research-only mt-2 text-xs leading-5 text-muted-foreground">{relationTypeLabels[relation.type]} · {evidenceStatusLabels[relation.evidenceStatus]}{relation.sourceNote ? ` · ${relation.sourceNote}` : ""}{relation.note ? <p className="mt-1">{relation.note}</p> : null}</div>
  </article>;
}
