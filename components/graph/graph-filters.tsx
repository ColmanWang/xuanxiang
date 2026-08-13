import { entityTypeLabels, entityTypes } from "@/components/graph/graph-config";
import { Button } from "@/components/ui/button";
import type { GraphFilterState, GraphEntityType } from "@/lib/graph/types";

export const graphDynasties = ["全部", "先秦", "秦汉", "魏晋南北朝", "隋唐", "宋元", "明清"];

interface GraphFiltersProps {
  filters: GraphFilterState;
  onChange: (filters: GraphFilterState) => void;
}

export function GraphFilters({ filters, onChange }: GraphFiltersProps) {
  function toggleType(type: GraphEntityType) {
    const active = filters.entityTypes.includes(type);
    onChange({
      ...filters,
      presetId: undefined,
      entityTypes: active
        ? filters.entityTypes.filter((item) => item !== type)
        : [...filters.entityTypes, type],
    });
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      <fieldset className="min-w-0 flex-1">
        <legend className="mb-2 text-xs tracking-[0.12em] text-muted-foreground">实体类型</legend>
        <div className="flex flex-wrap gap-1.5">
          <Button type="button" size="sm" variant={filters.entityTypes.length === 0 ? "default" : "outline"} onClick={() => onChange({ ...filters, entityTypes: [], presetId: undefined })}>全部</Button>
          {entityTypes.map((type) => (
            <Button key={type} type="button" size="sm" variant={filters.entityTypes.includes(type) ? "default" : "outline"} aria-pressed={filters.entityTypes.includes(type)} onClick={() => toggleType(type)}>
              {entityTypeLabels[type]}
            </Button>
          ))}
        </div>
      </fieldset>
      <label className="flex w-full flex-col gap-2 text-xs tracking-[0.12em] text-muted-foreground lg:w-44">
        时代
        <select className="h-9 border bg-background px-3 text-sm tracking-normal text-foreground focus:ring-2 focus:ring-ring" value={filters.dynasty} onChange={(event) => onChange({ ...filters, dynasty: event.target.value, presetId: undefined })}>
          {graphDynasties.map((dynasty) => <option key={dynasty}>{dynasty}</option>)}
        </select>
      </label>
    </div>
  );
}
