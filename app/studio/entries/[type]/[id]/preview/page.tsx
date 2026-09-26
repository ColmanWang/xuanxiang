import { requireStudioPageAccess } from "../../../../_lib/gate";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getStudioEntry } from "../../../../_lib/data";

export default async function StudioEntryPreviewPage({params}:{params:Promise<{type:string;id:string}>}){await requireStudioPageAccess();
  const {type,id}=await params;
  const entry=await getStudioEntry(type,id);
  if(!entry)notFound();
  return <article className="mx-auto max-w-4xl space-y-8">
    <header className="border-b pb-8">
      <div className="mb-5 flex flex-wrap items-center gap-2"><Badge>{entry.type}</Badge><Badge className="bg-muted text-foreground">{entry.editorialStatus}</Badge><Badge className="bg-muted text-foreground">{entry.publicationStatus}</Badge></div>
      <h1 className="font-serif text-4xl tracking-tight md:text-5xl">{entry.title}</h1>
      {entry.aliases.length?<p className="mt-3 text-sm text-muted-foreground">别名：{entry.aliases.join("、")}</p>:null}
      <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">{entry.summary||"条目正在整理"}</p>
    </header>
    <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem]"><div><h2 className="font-serif text-2xl">档案预览</h2><p className="mt-4 leading-8">此预览直接读取尚未发布的数据库记录，用于校订名称、摘要、别名与档案层级。公开数据链路不会返回草稿。</p></div><aside className="border p-5 text-sm"><p className="text-xs text-muted-foreground">Slug</p><p className="mt-1 break-all">{entry.slug}</p><p className="mt-4 text-xs text-muted-foreground">最后更新</p><p className="mt-1">{entry.updatedAt}</p></aside></section>
    <ButtonLink href={`/studio/entries/${entry.type}/${entry.id}`} variant="outline">返回编辑</ButtonLink>
  </article>
}
