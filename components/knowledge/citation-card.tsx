import { evidenceStatusLabels, sourceTypeLabels } from "@/lib/knowledge/labels";
import type { ReferenceView } from "@/lib/knowledge/types";
import Link from "next/link";

export function CitationCard({ reference }: { reference: ReferenceView }) {
  return <article className="border-l-2 border-accent/60 bg-muted/35 px-4 py-4">
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>{sourceTypeLabels[reference.sourceType as keyof typeof sourceTypeLabels] ?? "资料"}</span><span>·</span><span>{evidenceStatusLabels[reference.evidenceStatus]}</span></div>
    <h3 className="mt-2 font-serif text-lg">{reference.sourceTitle}{reference.locator ? ` · ${reference.locator}` : ""}</h3>
    {(reference.author || reference.period) ? <p className="mt-1 text-sm text-muted-foreground">{[reference.author, reference.period].filter(Boolean).join(" · ")}</p> : null}
    {reference.note ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{reference.note}</p> : null}
    {reference.readerHref ? <Link href={reference.readerHref} className="mt-4 inline-flex text-sm text-primary underline-offset-4 hover:underline">查看原典{reference.sectionTitle ? ` · ${reference.sectionTitle}` : ""}</Link> : null}
  </article>;
}
