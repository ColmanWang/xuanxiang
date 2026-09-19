export interface EditorialSectionNode { id: string; title: string; ordinal: number; children: readonly EditorialSectionNode[] }

export function EditorialSectionTree({ nodes, selectedId }: { nodes: readonly EditorialSectionNode[]; selectedId?: string }) {
  return <ol aria-label="章节树" className="space-y-1">{nodes.map((node)=><li key={node.id}><div className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm ${node.id===selectedId?"bg-muted":""}`}><span className="w-7 text-right tabular-nums text-muted-foreground">{node.ordinal}</span><span>{node.title}</span></div>{node.children.length?<div className="ml-5 border-l pl-2"><EditorialSectionTree nodes={node.children} selectedId={selectedId}/></div>:null}</li>)}</ol>;
}
