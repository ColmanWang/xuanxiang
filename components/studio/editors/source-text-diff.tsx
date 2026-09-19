import { diffEditorialText } from "@/lib/editorial/actions/diff";

export function SourceTextDiff({ before, after }: { before: string; after: string }) {
  const parts = diffEditorialText(before, after);
  return <section aria-label="原文修改对照" className="rounded-sm border bg-background p-4">
    <div className="mb-3 flex items-center justify-between gap-4"><h3 className="font-medium">原文修改确认</h3><span className="text-xs text-muted-foreground">证据层文本 · 不自动保存</span></div>
    <pre className="whitespace-pre-wrap break-words font-serif text-sm leading-7">{parts.map((part, index) => <span key={`${part.kind}-${index}`} className={part.kind === "added" ? "bg-emerald-100 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100" : part.kind === "removed" ? "bg-red-100 text-red-950 line-through dark:bg-red-950/50 dark:text-red-100" : undefined}>{part.text}{index < parts.length - 1 ? "\n" : ""}</span>)}</pre>
  </section>;
}
