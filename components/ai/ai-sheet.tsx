"use client";

import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiAssistant, type AiMode } from "./ai-assistant";

export function AiSheet({ mode, context, label = "问玄象" }: { mode: AiMode; context: unknown; label?: string }) {
  const [open, setOpen] = useState(false);
  return <><Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}><Sparkles />{label}</Button>{open ? <div className="fixed inset-0 z-50"><button type="button" className="absolute inset-0 bg-foreground/25" onClick={() => setOpen(false)} aria-label="关闭问玄象" /><aside className="absolute inset-y-0 right-0 w-[min(94vw,30rem)] overflow-y-auto border-l bg-background p-6 shadow-xl"><div className="mb-6 flex items-start justify-between"><div><p className="eyebrow">AI EXPLANATION</p><h2 className="mt-2 font-serif text-2xl">{label}</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="关闭"><X /></button></div><AiAssistant mode={mode} context={context} compact /></aside></div> : null}</>;
}
