import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="bg-muted px-1 py-0.5 text-[.9em]">{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

/** Deliberately small Markdown subset. HTML is always rendered as inert text. */
export function SafeMarkdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);
  return <div className="space-y-4 text-sm leading-7">{blocks.map((block, index) => {
    const lines = block.split("\n");
    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      return <ul key={index} className="list-disc space-y-1 pl-5">{lines.map((line, item) => <li key={item}>{inline(line.replace(/^[-*]\s+/, ""))}</li>)}</ul>;
    }
    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      return <ol key={index} className="list-decimal space-y-1 pl-5">{lines.map((line, item) => <li key={item}>{inline(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol>;
    }
    return <p key={index}>{lines.map((line, lineIndex) => <span key={lineIndex}>{inline(line)}{lineIndex < lines.length - 1 ? <br /> : null}</span>)}</p>;
  })}</div>;
}
