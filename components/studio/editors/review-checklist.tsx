export interface ReviewCheck { id: string; label: string; passed: boolean; blocking?: boolean }

export function ReviewChecklist({ checks }: { checks: readonly ReviewCheck[] }) {
  return <section aria-label="校订检查清单" className="rounded-sm border p-4"><h3 className="font-medium">校订检查</h3><ul className="mt-3 space-y-2 text-sm">{checks.map((check)=><li key={check.id} className="flex items-center justify-between gap-4"><span>{check.label}</span><span className={check.passed ? "text-emerald-700 dark:text-emerald-300" : check.blocking ? "text-destructive" : "text-amber-700 dark:text-amber-300"}>{check.passed ? "通过" : check.blocking ? "需处理" : "待确认"}</span></li>)}</ul><p className="mt-3 text-xs text-muted-foreground">“已校订”始终需要人工确认，不由系统自动授予。</p></section>;
}
