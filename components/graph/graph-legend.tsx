import { entityTypeLabels, entityTypes } from "@/components/graph/graph-config";

export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-x border-b bg-card/45 px-4 py-3 text-[10px] text-muted-foreground" aria-label="图谱图例">
      {entityTypes.map((type) => (
        <span key={type} className="inline-flex items-center gap-2"><i className={`graph-legend-mark graph-entity-${type}`} />{entityTypeLabels[type]}</span>
      ))}
      <span className="ml-auto hidden items-center gap-2 sm:inline-flex"><i className="w-7 border-t border-dashed" />虚线表示解释、来源或并行关系</span>
    </div>
  );
}
