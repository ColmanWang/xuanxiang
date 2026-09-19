import { listAiEditorialProposals } from "@/lib/ai/proposals/service";
import { AiProposalActions } from "@/components/studio/ai-proposal-actions";

export default async function AiProposalsPage() {
  const proposals = await listAiEditorialProposals();
  return <main><h2 className="font-serif text-3xl">AI 候选提议</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">AI 只能提交带既有证据的候选摘要。接受后仍经过 Editorial Service 校验并写入审计记录；不会自动发布或标记为已校订。</p>
    <div className="mt-8 space-y-4">{proposals.length ? proposals.map((proposal) => {
      const payload = proposal.payload as { summary?: string };
      return <article key={proposal.id} className="border bg-background p-5"><div className="flex flex-wrap justify-between gap-3"><h3 className="font-medium">候选摘要 · {proposal.targetId}</h3><span className="text-xs text-muted-foreground">{proposal.status}</span></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7">{payload.summary ?? "无可显示摘要"}</p><p className="mt-3 text-xs text-muted-foreground">依据文档：{proposal.evidenceDocumentIds.join("、")} · {proposal.provider}/{proposal.model}</p>{proposal.status === "PENDING" ? <AiProposalActions id={proposal.id}/> : null}</article>;
    }) : <p className="border border-dashed p-6 text-sm text-muted-foreground">暂无候选提议。只有具备已索引证据的 AI 输出才能进入这里。</p>}</div></main>;
}
