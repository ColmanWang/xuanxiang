import type { EvidenceStatus, RelationType } from "@prisma/client";

const labels: Record<RelationType, string> = { RELATED_TO: "相关于", BELONGS_TO: "属于", DERIVED_FROM: "源自", INFLUENCED_BY: "受其影响", WRITTEN_BY: "撰写者", APPEARS_IN: "出现于", DEVELOPED_DURING: "发展于", USES: "使用", INTERPRETS: "解释" };
const evidence: Record<EvidenceStatus, string> = { DOCUMENTED: "有文献依据", TRADITIONAL: "传统归属", INFERRED: "关系推定", CONTESTED: "存在争议" };

export function RelationPreview({ sourceTitle, targetTitle, relationType, evidenceStatus, citationTitle }: { sourceTitle: string; targetTitle: string; relationType: RelationType; evidenceStatus: EvidenceStatus; citationTitle?: string }) {
  return <section aria-label="关系预览" className="rounded-sm border p-4 text-sm">
    <p className="flex flex-wrap items-center gap-2 text-base"><strong>{sourceTitle}</strong><span className="text-muted-foreground">{labels[relationType]}</span><strong>{targetTitle}</strong></p>
    <dl className="mt-3 grid grid-cols-[5rem_1fr] gap-y-1 text-muted-foreground"><dt>证据状态</dt><dd>{evidence[evidenceStatus]}</dd><dt>典据</dt><dd>{citationTitle ?? "尚未关联 Citation"}</dd></dl>
  </section>;
}
