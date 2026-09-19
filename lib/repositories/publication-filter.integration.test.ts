import { afterAll,describe,expect,it } from "vitest";
import { prisma } from "@/lib/prisma";
import { knowledgeRepository } from "./knowledge-repository";
import { searchRepository } from "./search-repository";

const id="phase9-publication-filter";
describe("public publication boundary",()=>{
  afterAll(async()=>{await prisma.concept.deleteMany({where:{id}})});
  it("keeps Studio drafts out of public detail and search repositories",async()=>{
    await prisma.concept.upsert({where:{id},create:{id,name:"编辑台隔离测试",slug:"phase9-publication-filter",summary:"不应公开",publicationStatus:"DRAFT",dataCategory:"DEVELOPMENT_FIXTURE"},update:{publicationStatus:"DRAFT"}});
    await expect(knowledgeRepository.findConcept("phase9-publication-filter")).resolves.toBeNull();
    const result=await searchRepository("编辑台隔离测试");
    expect(result.concepts).toHaveLength(0);
  });
});
