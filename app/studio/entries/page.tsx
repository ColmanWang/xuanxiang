import { ButtonLink } from "@/components/ui/button";
import { EntryTable, StudioPageHeader } from "@/components/studio/studio-ui";
import { getStudioEntries } from "../_lib/data";

export default async function StudioEntriesPage({searchParams}:{searchParams:Promise<{type?:string}>}){const{type}=await searchParams;const entries=await getStudioEntries(type);return <div className="space-y-7"><StudioPageHeader title="知识条目" description="统一查看 Concept、Person、School、Classic 与 Technique。数据主体仍保持各自领域模型。" action={<ButtonLink href="/studio/entries/new" size="sm">新建草稿</ButtonLink>}/><nav className="flex gap-2 overflow-x-auto text-sm">{[["","全部"],["concept","概念"],["person","人物"],["school","学派"],["classic","典籍"],["technique","术数"]].map(([key,label])=><ButtonLink key={key} href={key?`/studio/entries?type=${key}`:"/studio/entries"} size="sm" variant={type===key||(!type&&!key)?"default":"outline"}>{label}</ButtonLink>)}</nav><EntryTable entries={entries}/></div>}
