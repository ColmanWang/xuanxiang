import { notFound } from "next/navigation";
import { EntryEditor } from "@/components/studio/entry-editor";
import { StudioPageHeader } from "@/components/studio/studio-ui";
import { getStudioEntry } from "../../../_lib/data";

export default async function StudioEntryPage({params}:{params:Promise<{type:string;id:string}>}){const{type,id}=await params;const entry=await getStudioEntry(type,id);if(!entry)notFound();return <div className="space-y-7"><StudioPageHeader eyebrow={`${entry.type.toUpperCase()} / ${entry.id}`} title={entry.title} description="结构化条目编辑。关系、典据与异说在各自档案区维护，保存时统一经过服务端校验。"/><EntryEditor entry={entry}/><section className="grid gap-4 lg:grid-cols-3">{["关系","Citation","Interpretation"].map(item=><article key={item} className="border bg-card p-5"><h3 className="font-serif text-lg">{item}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">通过对应工作区添加和核对；不会把结构关系写进正文。</p></article>)}</section></div>}
