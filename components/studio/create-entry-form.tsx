"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveClassicAction,saveConceptAction,savePersonAction,saveSchoolAction,saveTechniqueAction } from "@/app/studio/_actions/editorial-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StudioEntityType } from "./types";

export function CreateEntryForm(){
  const router=useRouter();
  const[type,setType]=useState<StudioEntityType>("concept");const[title,setTitle]=useState("");const[slug,setSlug]=useState("");const[summary,setSummary]=useState("");const[message,setMessage]=useState("");const[saving,setSaving]=useState(false);
  async function submit(){setSaving(true);setMessage("");const base={slug,summary,aliases:[],categories:[],editorialStatus:"DRAFT" as const};const result=type==="concept"?await saveConceptAction({...base,name:title}):type==="person"?await savePersonAction({...base,name:title}):type==="school"?await saveSchoolAction({...base,name:title,coreQuestions:[],classificationStatus:"INFERRED"}):type==="classic"?await saveClassicAction({...base,title,themes:[],attributionStatus:"UNKNOWN"}):await saveTechniqueAction({...base,name:title,category:"术数"});setSaving(false);if(!result.ok){setMessage(`${result.error.code}：${result.error.message}`);return}router.push(`/studio/entries/${type}/${result.data.id}`);router.refresh()}
  return <form className="grid max-w-3xl gap-5 border bg-card p-6" onSubmit={event=>{event.preventDefault();void submit()}}><Field label="类型"><select value={type} onChange={event=>setType(event.target.value as StudioEntityType)} className="h-11 w-full border bg-background px-3"><option value="concept">概念</option><option value="person">人物</option><option value="school">学派</option><option value="classic">典籍</option><option value="technique">术数</option></select></Field><Field label="名称"><Input required value={title} onChange={event=>setTitle(event.target.value)}/></Field><Field label="Slug"><Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={event=>setSlug(event.target.value)}/></Field><Field label="摘要"><textarea required value={summary} onChange={event=>setSummary(event.target.value)} rows={6} className="w-full border bg-background p-3 text-sm"/></Field>{message?<p className="text-sm text-destructive" role="alert">{message}</p>:null}<Button disabled={saving} type="submit">{saving?"创建中…":"创建草稿"}</Button></form>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label><span className="mb-2 block text-xs text-muted-foreground">{label}</span>{children}</label>}
