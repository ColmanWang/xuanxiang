import type { Metadata } from "next";
import { ClassicArchiveList } from "@/components/classics/classic-archive-list";
import { getClassicArchives } from "@/lib/services/classic-text-service";
export const metadata:Metadata={title:"典籍",description:"查阅典籍档案、文本版本、原典文句与知识关系。"};
export default async function Page(){const items=await getClassicArchives();return <div className="page-shell max-w-6xl"><header className="border-b pb-12"><h1 className="section-title">典籍档案</h1><p className="mt-6 max-w-3xl leading-8 text-muted-foreground">从版本、篇章与原典文句进入思想网络。当前文本均明确标注整理状态，不以开发样例替代权威底本。</p><p className="mt-5 text-sm text-muted-foreground">当前书目 {items.length} 种 · 可阅读 {items.filter(i=>i.passageCount>0).length} 种</p></header><ClassicArchiveList items={items}/></div>}
