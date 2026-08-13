import type { Metadata } from "next";
import Link from "next/link";
import { knowledgeService } from "@/lib/services/knowledge-service";
export const metadata: Metadata = { title: "术数知识", description: "研究术数的历史源流、结构、典籍与概念关系。" };
export default async function Page() { const items = await knowledgeService.listTechniques(); return <div className="page-shell max-w-6xl"><header className="border-b pb-12"><h1 className="section-title">术数知识</h1><p className="mt-6 leading-8 text-muted-foreground">知识条目与计算推演分离；这里讨论历史、结构和典据。</p></header><div className="grid border-b md:grid-cols-2">{items.map((item)=><Link key={item.id} href={`/techniques/${item.slug}`} className="border-t p-7 md:odd:border-r"><h2 className="font-serif text-2xl">{item.name}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary}</p></Link>)}</div></div>; }
