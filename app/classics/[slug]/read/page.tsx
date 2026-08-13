import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClassicReader } from "@/components/classics/classic-reader";
import { parseReaderParams } from "@/lib/classics/reader-params";
import { getReaderData } from "@/lib/services/classic-text-service";
type Props={params:Promise<{slug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const data=await getReaderData(slug,{});return data?{title:`${data.classic.title} · 原典阅读`,description:`阅读${data.classic.title}开发示例文本，并探索文句与玄象知识库的结构关系。`}:{title:"原典整理中"}}
export default async function Page({params,searchParams}:Props){const [{slug},query]=await Promise.all([params,searchParams]);const data=await getReaderData(slug,parseReaderParams(query));if(!data)notFound();return <ClassicReader data={data} initialView={query.view==="research"?"research":undefined}/>}
