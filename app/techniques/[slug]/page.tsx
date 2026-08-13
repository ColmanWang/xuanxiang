import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KnowledgeEntryView } from "@/components/knowledge/knowledge-entry-view";
import { knowledgeService } from "@/lib/services/knowledge-service";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const entry = await knowledgeService.getEntry("technique", slug); return entry ? { title: entry.title, description: entry.summary } : { title: "术数条目未找到" }; }
export default async function Page({ params }: Props) { const { slug } = await params; const entry = await knowledgeService.getEntry("technique", slug); if (!entry) notFound(); return <KnowledgeEntryView entry={entry} />; }
