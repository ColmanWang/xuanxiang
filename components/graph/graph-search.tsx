import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { GraphNode } from "@/lib/graph/types";

interface GraphSearchProps {
  query: string;
  results: GraphNode[];
  onQueryChange: (query: string) => void;
  onSelect: (nodeId: string) => void;
}

export function GraphSearch({ query, results, onQueryChange, onSelect }: GraphSearchProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor="graph-search" className="sr-only">搜索知识节点</label>
      <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" aria-hidden="true" />
      <Input
        id="graph-search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className="pl-10 pr-10"
        placeholder="搜索名称或别名，如“五行”"
        autoComplete="off"
      />
      {query ? (
        <button type="button" className="absolute right-2 top-2 grid size-7 place-items-center text-muted-foreground hover:text-foreground" onClick={() => onQueryChange("")} aria-label="清除搜索">
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
      {query ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-20 max-h-64 overflow-y-auto border bg-background shadow-xl">
          {results.length > 0 ? results.slice(0, 8).map((node) => (
            <button key={node.id} type="button" className="flex w-full items-center justify-between gap-4 border-b px-4 py-3 text-left text-sm last:border-b-0 hover:bg-muted" onClick={() => onSelect(node.id)}>
              <span className="font-serif text-base">{node.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{node.dynasty}</span>
            </button>
          )) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">未找到“{query}”</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
