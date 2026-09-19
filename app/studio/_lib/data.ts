import "server-only";
import type { EditorialStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exportKnowledgeBase } from "@/lib/content/database";
import { validateKnowledgeBase } from "@/lib/content/validation";
import type { StudioEntityType, StudioEntryDetail, StudioEntryRow, StudioGap, StudioStat, StudioValidationSummary } from "@/components/studio/types";

const baseSelect = { id:true,slug:true,aliases:true,summary:true,categories:true,editorialStatus:true,publicationStatus:true,updatedAt:true,lastReviewedAt:true } as const;

export async function getStudioStats():Promise<StudioStat[]> { const [concepts,people,schools,classics,techniques,relations,sources,citations,witnesses,passages]=await Promise.all([prisma.concept.count(),prisma.person.count(),prisma.school.count(),prisma.classic.count(),prisma.technique.count(),prisma.relation.count(),prisma.source.count(),prisma.citation.count(),prisma.textWitness.count(),prisma.textPassage.count()]); return [{label:"概念",value:concepts,href:"/studio/entries?type=concept"},{label:"人物",value:people,href:"/studio/entries?type=person"},{label:"学派",value:schools,href:"/studio/entries?type=school"},{label:"典籍",value:classics,href:"/studio/classics"},{label:"术数",value:techniques,href:"/studio/entries?type=technique"},{label:"关系",value:relations,href:"/studio/relations"},{label:"来源",value:sources,href:"/studio/sources"},{label:"典据",value:citations,href:"/studio/citations"},{label:"版本",value:witnesses,href:"/studio/classics"},{label:"文句",value:passages,href:"/studio/classics"}]; }

export async function getStatusDistribution(){const counts=await Promise.all([prisma.concept.groupBy({by:["editorialStatus"],_count:{_all:true}}),prisma.person.groupBy({by:["editorialStatus"],_count:{_all:true}}),prisma.school.groupBy({by:["editorialStatus"],_count:{_all:true}}),prisma.classic.groupBy({by:["editorialStatus"],_count:{_all:true}}),prisma.technique.groupBy({by:["editorialStatus"],_count:{_all:true}})]);const result:Record<EditorialStatus,number>={DRAFT:0,BASIC:0,SOURCED:0,REVIEWED:0};for(const group of counts.flat())result[group.editorialStatus]+=group._count._all;return result}

export async function getStudioEntries(type?:string):Promise<StudioEntryRow[]>{const requested=isEntityType(type)?[type]:(["concept","person","school","classic","technique"] as StudioEntityType[]);const groups=await Promise.all(requested.map(getEntriesByType));return groups.flat().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));}

async function getEntriesByType(type:StudioEntityType):Promise<StudioEntryRow[]>{if(type==="concept")return (await prisma.concept.findMany({select:{...baseSelect,name:true},orderBy:{updatedAt:"desc"}})).map(item=>mapEntry(type,item,item.name));if(type==="person")return (await prisma.person.findMany({select:{...baseSelect,name:true},orderBy:{updatedAt:"desc"}})).map(item=>mapEntry(type,item,item.name));if(type==="school")return (await prisma.school.findMany({select:{...baseSelect,name:true},orderBy:{updatedAt:"desc"}})).map(item=>mapEntry(type,item,item.name));if(type==="classic")return (await prisma.classic.findMany({select:{...baseSelect,title:true},orderBy:{updatedAt:"desc"}})).map(item=>mapEntry(type,item,item.title));return (await prisma.technique.findMany({select:{...baseSelect,name:true},orderBy:{updatedAt:"desc"}})).map(item=>mapEntry(type,item,item.name));}

type BaseRow={id:string;slug:string;summary:string;aliases:string[];categories:string[];editorialStatus:EditorialStatus;publicationStatus:"DRAFT"|"PUBLISHED"|"ARCHIVED";updatedAt:Date;lastReviewedAt:Date|null};
function mapEntry(type:StudioEntityType,item:BaseRow,title:string):StudioEntryRow{return{id:item.id,type,title,slug:item.slug,summary:item.summary,editorialStatus:item.editorialStatus,publicationStatus:item.publicationStatus,updatedAt:item.updatedAt.toISOString()}}

export async function getStudioEntry(type:string,id:string):Promise<StudioEntryDetail|null>{if(!isEntityType(type))return null;const list=await getEntriesByType(type);const base=list.find(item=>item.id===id);if(!base)return null;if(type==="school"){const item=await prisma.school.findUnique({where:{id},select:{...baseSelect,period:true,coreQuestions:true,classificationStatus:true}});return item?{...base,aliases:item.aliases,categories:item.categories,lastReviewedAt:item.lastReviewedAt?.toISOString(),period:item.period??undefined,coreQuestions:item.coreQuestions,classificationStatus:item.classificationStatus}:null}if(type==="classic"){const item=await prisma.classic.findUnique({where:{id},select:{...baseSelect,period:true,themes:true,attributionStatus:true}});return item?{...base,aliases:item.aliases,categories:item.categories,lastReviewedAt:item.lastReviewedAt?.toISOString(),period:item.period??undefined,themes:item.themes,attributionStatus:item.attributionStatus}:null}if(type==="technique"){const item=await prisma.technique.findUnique({where:{id},select:{...baseSelect,period:true,category:true}});return item?{...base,aliases:item.aliases,categories:item.categories,lastReviewedAt:item.lastReviewedAt?.toISOString(),period:item.period??undefined,category:item.category}:null}if(type==="person"){const item=await prisma.person.findUnique({where:{id},select:{...baseSelect,period:true}});return item?{...base,aliases:item.aliases,categories:item.categories,lastReviewedAt:item.lastReviewedAt?.toISOString(),period:item.period??undefined}:null}const item=await prisma.concept.findUnique({where:{id},select:baseSelect});return item?{...base,aliases:item.aliases,categories:item.categories,lastReviewedAt:item.lastReviewedAt?.toISOString()}:null}

export async function getStudioGaps():Promise<StudioGap[]>{const [sourced,citationsBySubject,relationsWithoutCitations,passageDrafts,witnesses]=await Promise.all([getStudioEntries(),prisma.citation.groupBy({by:["subjectType","subjectId"],_count:{_all:true}}),prisma.relation.findMany({where:{citations:{none:{}}},select:{id:true,sourceType:true,sourceId:true,targetType:true,targetId:true}}),prisma.textPassage.count({where:{editorialStatus:{in:["DRAFT","BASIC"]}}}),prisma.textWitness.findMany({select:{id:true,classicId:true,isPrimary:true}})]);const citationKeys=new Set(citationsBySubject.map(item=>`${item.subjectType}:${item.subjectId}`));const gaps:StudioGap[]=sourced.filter(item=>item.editorialStatus==="SOURCED"&&!citationKeys.has(`${item.type.toUpperCase()}:${item.id}`)).map(item=>({id:`citation:${item.type}:${item.id}`,level:"WARNING",label:"已有典据但无 Citation",detail:item.title,href:`/studio/entries/${item.type}/${item.id}`}));if(relationsWithoutCitations.length)gaps.push({id:"relations-without-citation",level:"WARNING",label:"关系缺少 Citation",detail:`${relationsWithoutCitations.length} 条关系仍只有结构关系或编辑说明。`,href:"/studio/relations"});if(passageDrafts)gaps.push({id:"passage-drafts",level:"WARNING",label:"原文待校订",detail:`${passageDrafts} 条 Passage 仍处于草稿或基础状态。`,href:"/studio/classics"});const primaryCounts=new Map<string,number>();for(const witness of witnesses)if(witness.isPrimary)primaryCounts.set(witness.classicId,(primaryCounts.get(witness.classicId)??0)+1);for(const [classicId,count] of primaryCounts)if(count>1)gaps.push({id:`primary:${classicId}`,level:"ERROR",label:"多个主版本",detail:`Classic ${classicId} 有 ${count} 个 primary Witness。`,href:`/studio/classics/${classicId}`});return gaps;}

export async function getValidationSummary():Promise<StudioValidationSummary>{
  const report=validateKnowledgeBase(await exportKnowledgeBase(prisma));
  const groups=[
    {id:"entity-slugs",label:"条目与 Slug",codes:["DUPLICATE_SLUG"]},
    {id:"relation-integrity",label:"Relation endpoints",codes:["DANGLING_RELATION"]},
    {id:"citation-integrity",label:"Citation references",codes:["DANGLING_CITATION_SOURCE","DANGLING_CITATION_SUBJECT","DANGLING_CITATION_PASSAGE"]},
    {id:"classic-structure",label:"典籍章节结构",codes:["WITNESS_WITHOUT_CLASSIC","WITNESS_WITHOUT_SOURCE","MULTIPLE_PRIMARY_WITNESSES","ORPHAN_SECTION","INVALID_SECTION_PARENT","CYCLIC_SECTION_TREE","ORPHAN_PASSAGE","INVALID_PASSAGE_ENTITY_LINK"]},
    {id:"rule-provenance",label:"Rule Provenance",codes:["DANGLING_RULE_PROVENANCE","STABLE_POLICY_WITHOUT_PROVENANCE"]},
  ];
  const checks=groups.map(group=>{const issues=report.issues.filter(issue=>group.codes.includes(issue.code));const status=issues.some(issue=>issue.severity==="ERROR")?"ERROR" as const:issues.length?"WARNING" as const:"PASS" as const;return{id:group.id,label:group.label,status,detail:issues.length?issues.map(issue=>issue.message).join("；"):"通过完整数据快照校验。"}});
  const otherWarnings=report.issues.filter(issue=>!groups.some(group=>group.codes.includes(issue.code)));
  checks.push({id:"content-gaps",label:"内容缺口",status:otherWarnings.some(issue=>issue.severity==="ERROR")?"ERROR":otherWarnings.length?"WARNING":"PASS",detail:otherWarnings.length?`${otherWarnings.length} 项需要编辑跟进。`:"当前没有额外警告。"});
  return{status:report.status,checks};
}

export async function getRelations(){return prisma.relation.findMany({orderBy:{updatedAt:"desc"},take:200,include:{citations:{select:{id:true}}}})}
export async function getSources(){return prisma.source.findMany({orderBy:{updatedAt:"desc"},take:200,include:{_count:{select:{citations:true,witnesses:true}}}})}
export async function getCitations(){return prisma.citation.findMany({orderBy:{createdAt:"desc"},take:200,include:{source:{select:{title:true}},passage:{select:{id:true,text:true,section:{select:{title:true,witness:{select:{classic:{select:{title:true,slug:true}}}}}}}}}})}
export async function getStudioClassics(){return prisma.classic.findMany({orderBy:{updatedAt:"desc"},include:{witnesses:{orderBy:{createdAt:"asc"},include:{source:{select:{title:true}},sections:{orderBy:{ordinal:"asc"},include:{_count:{select:{passages:true}}}}}}}})}
export async function getStudioClassic(id:string){return prisma.classic.findUnique({where:{id},include:{witnesses:{orderBy:{createdAt:"asc"},include:{source:true,sections:{orderBy:[{depth:"asc"},{ordinal:"asc"}],include:{passages:{orderBy:{ordinal:"asc"},take:3}}}}}}})}
export async function getSourceOptions(){return prisma.source.findMany({select:{id:true,title:true},orderBy:{title:"asc"},take:200})}
export async function getStudioSource(id:string){const item=await prisma.source.findUnique({where:{id}});return item?{...item,updatedAt:item.updatedAt.toISOString()}:null}
export async function getStudioRelation(id:string){const item=await prisma.relation.findUnique({where:{id}});return item?{...item,updatedAt:item.updatedAt.toISOString()}:null}
export async function getStudioCitation(id:string){const item=await prisma.citation.findUnique({where:{id}});return item?{...item,updatedAt:item.updatedAt.toISOString()}:null}
export async function getStudioInterpretation(id:string){const item=await prisma.interpretation.findUnique({where:{id}});return item?{...item,updatedAt:item.updatedAt.toISOString()}:null}
export async function getInterpretations(){return prisma.interpretation.findMany({orderBy:{updatedAt:"desc"},take:100,include:{attributedToPerson:{select:{name:true}},attributedToSchool:{select:{name:true}},_count:{select:{citations:true}}}})}
export async function getAuditLog(){return prisma.editorialAuditLog.findMany({orderBy:{createdAt:"desc"},take:50})}

export async function getEntityOptions(){
  const [concepts,classics,people,schools,techniques,dynasties]=await Promise.all([
    prisma.concept.findMany({select:{id:true,name:true},orderBy:{name:"asc"},take:100}),
    prisma.classic.findMany({select:{id:true,title:true},orderBy:{title:"asc"},take:100}),
    prisma.person.findMany({select:{id:true,name:true},orderBy:{name:"asc"},take:100}),
    prisma.school.findMany({select:{id:true,name:true},orderBy:{name:"asc"},take:100}),
    prisma.technique.findMany({select:{id:true,name:true},orderBy:{name:"asc"},take:100}),
    prisma.dynasty.findMany({select:{id:true,name:true},orderBy:{startYear:"asc"},take:100}),
  ]);
  return [
    ...concepts.map(item=>({id:item.id,type:"CONCEPT" as const,label:item.name})),
    ...classics.map(item=>({id:item.id,type:"CLASSIC" as const,label:item.title})),
    ...people.map(item=>({id:item.id,type:"PERSON" as const,label:item.name})),
    ...schools.map(item=>({id:item.id,type:"SCHOOL" as const,label:item.name})),
    ...techniques.map(item=>({id:item.id,type:"TECHNIQUE" as const,label:item.name})),
    ...dynasties.map(item=>({id:item.id,type:"DYNASTY" as const,label:item.name})),
  ];
}

export async function getCitationEditorOptions(){
  const [sources,passages,entities]=await Promise.all([
    prisma.source.findMany({select:{id:true,title:true},orderBy:{title:"asc"},take:200}),
    prisma.textPassage.findMany({select:{id:true,text:true,section:{select:{title:true,witness:{select:{classic:{select:{title:true}}}}}}},orderBy:{createdAt:"desc"},take:200}),
    getEntityOptions(),
  ]);
  return {sources,passages:passages.map(item=>({id:item.id,label:`${item.section.witness.classic.title}·${item.section.title} — ${item.text.slice(0,48)}`})),entities};
}

function isEntityType(value:unknown):value is StudioEntityType{return value==="concept"||value==="person"||value==="school"||value==="classic"||value==="technique"}
