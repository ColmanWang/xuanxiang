import type { Metadata } from "next";
import { AskWorkspace } from "@/components/ai/ask-workspace";

export const metadata: Metadata = { title: "问玄象" };
export default function AskPage() { return <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8 lg:py-20"><header className="mb-10"><p className="eyebrow">EVIDENCE-GROUNDED ASSISTANT</p><h1 className="mt-3 font-serif text-4xl">问玄象</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">基于玄象知识库、原典与推演依据回答问题。回答中的“依据”可回到原始资料核对。</p></header><AskWorkspace /></main>; }
