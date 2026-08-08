"use client";

import { BookOpenText, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResearchMode } from "./research-mode-provider";

export function ResearchModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useResearchMode();

  return (
    <div
      className="inline-grid grid-cols-2 rounded-sm border bg-background p-0.5"
      aria-label="阅读模式"
      role="group"
    >
      <button
        type="button"
        aria-pressed={mode === "browse"}
        onClick={() => setMode("browse")}
        className={cn(
          "inline-flex h-8 items-center justify-center gap-1.5 rounded-[1px] px-2.5 text-xs transition-colors",
          mode === "browse"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <BookOpenText aria-hidden="true" />
        {compact ? "浏览" : "普通浏览"}
      </button>
      <button
        type="button"
        aria-pressed={mode === "research"}
        onClick={() => setMode("research")}
        className={cn(
          "inline-flex h-8 items-center justify-center gap-1.5 rounded-[1px] px-2.5 text-xs transition-colors",
          mode === "research"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Microscope aria-hidden="true" />
        研究模式
      </button>
    </div>
  );
}
