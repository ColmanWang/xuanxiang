export { graphEdges } from "@/data/graph/edges";
export { graphEntityRecords } from "@/data/graph/nodes";
export { graphPresets } from "@/data/graph/presets";

import { graphEntityRecords } from "@/data/graph/nodes";
import { adaptGraphEntities } from "@/lib/graph/adapter";

export const graphNodes = adaptGraphEntities(graphEntityRecords);
export const graphNodeMap = new Map(graphNodes.map((node) => [node.id, node]));
