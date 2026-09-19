"use client";

import { useState } from "react";
import { AiAssistant, type AiMode } from "./ai-assistant";

export function AskWorkspace() {
  const [mode, setMode] = useState<Extract<AiMode, "KNOWLEDGE" | "CLASSIC">>("KNOWLEDGE");
  return <div><div className="mb-4 flex border-b" role="tablist" aria-label="问答类型">{([["KNOWLEDGE", "知识"], ["CLASSIC", "典籍"]] as const).map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => setMode(value)} className={`border-b-2 px-6 py-3 text-sm ${mode === value ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>{label}</button>)}</div><AiAssistant key={mode} mode={mode} /></div>;
}
