import { ArrowRight } from "lucide-react";
import type { GraphPreset } from "@/lib/graph/types";

interface GraphPresetListProps {
  presets: GraphPreset[];
  activePresetId?: string;
  onSelect: (preset: GraphPreset) => void;
}

export function GraphPresetList({ presets, activePresetId, onSelect }: GraphPresetListProps) {
  return (
    <section aria-labelledby="graph-presets-title" className="border-b py-7">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="graph-presets-title" className="font-serif text-2xl">从一条脉络开始</h2>
        <p className="hidden text-xs text-muted-foreground sm:block">Curated graph views</p>
      </div>
      <div className="mt-5 grid border-y md:grid-cols-5">
        {presets.map((preset) => (
          <button key={preset.id} type="button" className={`group flex min-h-36 flex-col border-b p-4 text-left transition-colors last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${activePresetId === preset.id ? "bg-secondary" : "hover:bg-card"}`} onClick={() => onSelect(preset)}>
            <span className="font-serif text-lg leading-6">{preset.title}</span>
            <span className="mt-3 text-xs leading-5 text-muted-foreground">{preset.description}</span>
            <ArrowRight className="mt-auto size-4 self-end text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
