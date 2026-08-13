import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type Edge, type EdgeProps } from "@xyflow/react";
import { relationDash } from "@/components/graph/graph-config";
import type { GraphEdge } from "@/lib/graph/types";

export type KnowledgeFlowEdge = Edge<
  { graphEdge: GraphEdge; highlighted: boolean; subdued: boolean },
  "knowledge"
>;

export function GraphRelationEdge(props: EdgeProps<KnowledgeFlowEdge>) {
  const [path, labelX, labelY] = getSmoothStepPath(props);
  const highlighted = props.data?.highlighted ?? false;
  const subdued = props.data?.subdued ?? false;
  const graphEdge = props.data?.graphEdge;

  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        markerEnd={props.markerEnd}
        style={{
          stroke: highlighted ? "var(--accent)" : "var(--muted-foreground)",
          strokeWidth: highlighted ? 2 : 1.2,
          strokeDasharray: graphEdge ? relationDash[graphEdge.type] : undefined,
          opacity: subdued ? 0.12 : highlighted ? 0.9 : 0.42,
          transition: "opacity 240ms ease, stroke 240ms ease",
        }}
      />
      {graphEdge && highlighted ? (
        <EdgeLabelRenderer>
          <span
            className="pointer-events-none absolute border bg-background/90 px-1.5 py-0.5 text-[9px] text-muted-foreground shadow-sm"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`, opacity: highlighted ? 1 : 0.72 }}
          >
            {graphEdge.label}
          </span>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
