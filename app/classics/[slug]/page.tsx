import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KnowledgeEntryView } from "@/components/knowledge/knowledge-entry-view";
import { knowledgeService } from "@/lib/services/knowledge-service";
import { getClassicTextMeta } from "@/lib/services/classic-text-service";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const entry = await knowledgeService.getEntry("classic", slug); return entry ? { title: entry.title, description: entry.summary } : { title: "书目未找到" }; }
export default async function Page({ params }: Props) { const { slug } = await params; const [entry,classicText] = await Promise.all([knowledgeService.getEntry("classic", slug),getClassicTextMeta(slug)]); if (!entry) notFound(); return <KnowledgeEntryView entry={entry} classicText={classicText??undefined} />; }
