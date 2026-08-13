import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { entityTypeLabels, entityTypeMarks } from "@/components/graph/graph-config";
import type { GraphNode } from "@/lib/graph/types";
import { cn } from "@/lib/utils";

export type KnowledgeFlowNode = Node<
  {
    graphNode: GraphNode;
    selected: boolean;
    related: boolean;
    subdued: boolean;
  },
  "knowledge"
>;

export function GraphNodeCard({ data }: NodeProps<KnowledgeFlowNode>) {
  const { graphNode, selected, related, subdued } = data;
  return (
    <div
      className={cn(
        "graph-entity-node min-w-36 border bg-card px-3 py-2.5 shadow-sm transition-[opacity,border-color,box-shadow,transform] duration-300",
        `graph-entity-${graphNode.entityType}`,
        selected && "is-selected",
        related && "is-related",
        subdued && "opacity-25",
      )}
      aria-label={`${graphNode.title}，${entityTypeLabels[graphNode.entityType]}`}
    >
      <Handle type="target" position={Position.Left} className="graph-handle" />
      <div className="flex items-start gap-2.5">
        <span className="graph-entity-mark" aria-hidden="true">
          <span>{entityTypeMarks[graphNode.entityType]}</span>
        </span>
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-semibold leading-5">{graphNode.title}</p>
          <p className="mt-1 text-[10px] tracking-[0.12em] text-muted-foreground">
            {entityTypeLabels[graphNode.entityType]}{graphNode.dynasty ? ` · ${graphNode.dynasty}` : ""}
          </p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="graph-handle" />
    </div>
  );
}
