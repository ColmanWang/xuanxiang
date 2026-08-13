import { Fragment } from "react";

export function splitHighlightText(text: string, query: string): Array<{ text: string; highlighted: boolean }> {
  const needle = query.trim();
  if (!needle) return [{ text, highlighted: false }];
  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let start = 0;
  let index = text.indexOf(needle, start);
  while (index >= 0) {
    if (index > start) parts.push({ text: text.slice(start, index), highlighted: false });
    parts.push({ text: needle, highlighted: true });
    start = index + needle.length; index = text.indexOf(needle, start);
  }
  if (start < text.length) parts.push({ text: text.slice(start), highlighted: false });
  return parts.length ? parts : [{ text, highlighted: false }];
}

export function HighlightText({ text, query }: { text: string; query: string }) {
  return splitHighlightText(text, query).map((part, index) => <Fragment key={`${index}-${part.text}`}>{part.highlighted ? <mark className="bg-accent/25 text-foreground">{part.text}</mark> : part.text}</Fragment>);
}
