"use client";

import { useState } from "react";
import { acceptAiProposalAction, rejectAiProposalAction } from "@/app/studio/_actions/ai-proposal-actions";

export function AiProposalActions({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function run(action: (id: string) => Promise<{ ok: boolean; error?: { message: string } }>) {
    setPending(true); const result = await action(id); setPending(false);
    setMessage(result.ok ? "已完成。" : result.error?.message ?? "操作失败。");
  }
  return <div className="mt-4 flex flex-wrap items-center gap-2">
    <button disabled={pending} onClick={() => run(acceptAiProposalAction)} className="border border-foreground bg-foreground px-3 py-2 text-xs text-background disabled:opacity-50">接受并写入编辑流程</button>
    <button disabled={pending} onClick={() => run(rejectAiProposalAction)} className="border px-3 py-2 text-xs disabled:opacity-50">拒绝</button>
    {message ? <span className="text-xs text-muted-foreground">{message}</span> : null}
  </div>;
}
