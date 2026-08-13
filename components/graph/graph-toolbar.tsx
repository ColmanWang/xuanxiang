import { List, Network } from "lucide-react";
import { GraphFilters } from "@/components/graph/graph-filters";
import { GraphSearch } from "@/components/graph/graph-search";
import { Button } from "@/components/ui/button";
import type { GraphFilterState, GraphNode, GraphViewMode } from "@/lib/graph/types";

interface GraphToolbarProps {
  filters: GraphFilterState;
  searchResults: GraphNode[];
  viewMode: GraphViewMode;
  onFiltersChange: (filters: GraphFilterState) => void;
  onSelectSearchResult: (nodeId: string) => void;
  onViewModeChange: (mode: GraphViewMode) => void;
}

export function GraphToolbar({ filters, searchResults, viewMode, onFiltersChange, onSelectSearchResult, onViewModeChange }: GraphToolbarProps) {
  return (
    <div className="border-y bg-card/55 p-4 sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <GraphSearch query={filters.query} results={searchResults} onQueryChange={(query) => onFiltersChange({ ...filters, query })} onSelect={onSelectSearchResult} />
        <div className="flex shrink-0 gap-1.5" role="group" aria-label="图谱视图">
          <Button type="button" size="sm" variant={viewMode === "graph" ? "default" : "outline"} onClick={() => onViewModeChange("graph")}><Network aria-hidden="true" />图谱</Button>
          <Button type="button" size="sm" variant={viewMode === "list" ? "default" : "outline"} onClick={() => onViewModeChange("list")}><List aria-hidden="true" />列表</Button>
        </div>
      </div>
      <div className="mt-5 border-t pt-4">
        <GraphFilters filters={filters} onChange={onFiltersChange} />
      </div>
    </div>
  );
}
