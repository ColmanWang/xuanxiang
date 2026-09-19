import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ClassicStructureEditor } from "@/components/studio/classic-structure-editor";
import { SourceTextDiff } from "@/components/studio/text-diff";
import { StudioPageHeader } from "@/components/studio/studio-ui";
import { getSourceOptions,getStudioClassic } from "../../_lib/data";

export default async function StudioClassicPage({params}:{params:Promise<{id:string}>}){
  const{id}=await params;const[item,sources]=await Promise.all([getStudioClassic(id),getSourceOptions()]);if(!item)notFound();
  const sample=item.witnesses.flatMap(w=>w.sections.flatMap(s=>s.passages)).at(0);
  return <div className="space-y-8"><StudioPageHeader eyebrow={`CLASSIC / ${item.id}`} title={item.title} description="版本、章节树与原文证据层分别管理。移动章节时必须避免循环与跨 Witness 孤儿节点。" action={<ButtonLink href={`/classics/${item.slug}`} size="sm" variant="outline">前台档案</ButtonLink>}/><section className="space-y-5">{item.witnesses.map(witness=><article key={witness.id} className="border bg-card"><header className="flex flex-wrap items-start justify-between gap-3 border-b p-5"><div><p className="text-xs text-muted-foreground">{witness.editionType}{witness.isPrimary?" · PRIMARY":""}</p><h3 className="mt-2 font-serif text-xl">{witness.title}</h3><p className="mt-2 text-sm text-muted-foreground">{witness.source?.title||"来源待补"}</p></div><Badge>{witness.editorialStatus}</Badge></header><div className="divide-y">{witness.sections.map(section=><div key={section.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[4rem_1fr_8rem]"><span className="font-mono text-xs text-muted-foreground">{section.ordinal}</span><div><p className="font-medium">{"　".repeat(section.depth)}{section.title}</p><p className="text-xs text-muted-foreground">/{section.slug}</p></div><span className="text-xs text-muted-foreground">{section.passages.length} sampled</span></div>)}</div></article>)}</section><ClassicStructureEditor classicId={item.id} sources={sources} witnesses={item.witnesses.map(w=>({id:w.id,title:w.title,sections:w.sections.map(s=>({id:s.id,title:s.title}))}))}/>{sample?<section><h3 className="mb-4 font-serif text-2xl">原文修改预览</h3><SourceTextDiff original={sample.text}/></section>:null}</div>;
}
