import { entityTypeLabels, entityTypes } from "./graph-config";

export function GraphLegend() {
  return (
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
      {entityTypes.map((type) => (
        <span key={type} className="inline-flex items-center gap-2">
          <span className="size-3 border border-foreground/60" style={{ background: type === "PERSON" ? "var(--card)" : `var(--graph-${type.toLowerCase()})`, borderRadius: type === "CONCEPT" ? "999px" : "0", transform: type === "PERSON" ? "rotate(45deg)" : undefined }} aria-hidden="true" />
          {entityTypeLabels[type]}
        </span>
      ))}
      <span className="inline-flex items-center gap-2">
        <span className="relative block h-px w-7 bg-muted-foreground after:absolute after:-right-px after:-top-[3px] after:size-0 after:border-y-4 after:border-l-[6px] after:border-y-transparent after:border-l-muted-foreground" />
        关系方向
      </span>
    </div>
  );
}
