"use client";

import Link from "next/link";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SafeMarkdown } from "./safe-markdown";

export type AiMode = "KNOWLEDGE" | "CLASSIC" | "BAZI_EXPLANATION" | "LIUYAO_EXPLANATION";
type Citation = { id: string; title: string; kind: "PASSAGE" | "KNOWLEDGE" | "PERSON" | "RULE"; href: string; locator?: string };
type AiResponse = { answer: string; citations: Citation[]; limitations: string[]; readiness: string };
const safeLocalHref = (href: string) => href.startsWith("/") && !href.startsWith("//") ? href : null;

const quickQuestions: Record<AiMode, string[]> = {
  KNOWLEDGE: ["魏晋玄学中的“有”和“无”是什么？", "玄学与道家思想有什么关系？"],
  CLASSIC: ["这句话涉及哪些概念？", "这个概念在玄象知识库里如何解释？", "有哪些不同解释？"],
  BAZI_EXPLANATION: ["为什么是这个月柱？", "为什么大运这样顺排或逆排？"],
  LIUYAO_EXPLANATION: ["为什么是这个卦？", "为什么这些爻会变化？", "为什么世应在这里？", "什么是纳甲？"],
};

export function AiAssistant({ mode, context, compact = false }: { mode: AiMode; context?: unknown; compact?: boolean }) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function ask(question = message) {
    const value = question.trim();
    if (!value || pending) return;
    setMessage(value); setPending(true); setError(null);
    try {
      const response = await fetch("/api/ai/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode, message: value, ...(context ? { context } : {}) }) });
      const payload = await response.json() as AiResponse & { error?: { message?: string } };
      if (!response.ok) throw new Error(payload.error?.message ?? "AI 暂不可用。");
      setResult(payload);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "AI 暂不可用。"); }
    finally { setPending(false); }
  }

  return <section className={compact ? "space-y-5" : "border-t-2 border-primary bg-card p-6 sm:p-8"} aria-live="polite">
    <div className="flex flex-wrap gap-2">{quickQuestions[mode].map((question) => <button key={question} type="button" onClick={() => void ask(question)} className="border px-3 py-2 text-left text-xs leading-5 text-muted-foreground hover:border-primary hover:text-foreground">{question}</button>)}</div>
    <div className="flex gap-2"><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} rows={compact ? 3 : 4} placeholder="请输入你想了解的问题" className="min-w-0 flex-1 resize-y border bg-background p-3 text-sm outline-none focus:border-primary" /><Button type="button" onClick={() => void ask()} disabled={pending || !message.trim()} aria-label="提交问题">{pending ? <Loader2 className="animate-spin" /> : <Send />}</Button></div>
    {error ? <p role="alert" className="flex gap-2 border-l-2 border-destructive p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</p> : null}
    {result ? <div className="space-y-6 border-t pt-6"><div><p className="eyebrow mb-3">AI 整理</p><SafeMarkdown content={result.answer} /></div><div><h3 className="font-serif text-xl">依据</h3>{result.citations.length ? <ul className="mt-3 divide-y border-y">{result.citations.map((citation) => <li key={citation.id} className="py-3"><Link href={safeLocalHref(citation.href) ?? "/ask"} className="flex items-center justify-between gap-4 text-sm hover:text-primary"><span>{citation.title}{citation.locator ? ` · ${citation.locator}` : ""}</span><span className="text-xs text-muted-foreground">查看资料</span></Link></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">当前资料不足，请缩小问题范围。</p>}</div>{result.limitations.length ? <ul className="border-l-2 border-accent pl-4 text-xs leading-6 text-muted-foreground">{result.limitations.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div> : null}
    <div className="space-y-2 border-t pt-4 text-xs leading-6 text-muted-foreground"><p>AI 用于组织玄象资料与解释计算过程，可能存在表达错误；重要内容请以原典、Citation 和确定性计算结果为准。</p><p>提交的问题会发送给当前配置的第三方 AI Provider；请勿输入身份证号、联系方式等敏感信息。</p></div>
  </section>;
}
