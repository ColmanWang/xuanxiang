import {describe,expect,it} from "vitest";
import {getPassageContext,getReaderData,searchClassicPassages} from "@/lib/services/classic-text-service";
import {getKnowledgeEntry} from "@/lib/services/knowledge-service";
describe("classic evidence layer integration",()=>{
  it("loads Witness, section, ordered passages and adjacent context",async()=>{const reader=await getReaderData("zhouyi",{passage:"passage-zhouyi-yinyang"});expect(reader?.witness.id).toBe("witness-zhouyi-sample");expect(reader?.activeSection.slug).toBe("xici-shang");expect(reader?.passages[0].id).toBe("passage-zhouyi-yinyang");expect(reader?.selectedPassage?.next?.id).toBe("passage-zhouyi-daoqi")});
  it("maps Passage links back to knowledge entries",async()=>{const context=await getPassageContext("passage-zhouyi-yinyang");expect(context?.entityLinks.find(link=>link.entityId==="yinyang")?.href).toBe("/knowledge/yinyang")});
  it("searches original text",async()=>{const hits=await searchClassicPassages("一阴一阳");expect(hits[0]).toMatchObject({classicSlug:"zhouyi",sectionSlug:"xici-shang"})});
  it("connects 五行 Citation to Passage, Classic and Reader URL",async()=>{const entry=await getKnowledgeEntry("concept","wuxing");const citation=entry?.references.find(ref=>ref.passageId==="passage-shangshu-wuxing");expect(citation?.classicTitle).toBe("尚书");expect(citation?.readerHref).toBe("/classics/shangshu/read?passage=passage-shangshu-wuxing")});
});
