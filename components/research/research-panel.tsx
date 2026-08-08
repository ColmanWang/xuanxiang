import type { ReactNode } from "react";

export function ResearchPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="research-only border-t border-dashed py-7" data-research-content>
      <p className="research-label">研究层 · {title}</p>
      <div className="mt-4">{children}</div>
    </aside>
  );
}
