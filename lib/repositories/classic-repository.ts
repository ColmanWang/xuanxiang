import { prisma } from "@/lib/prisma";

const witnessSelect = { id:true,title:true,shortTitle:true,editionType:true,description:true,isPrimary:true,editorialStatus:true,source:{select:{title:true}} } as const;
const passageSelect = { id:true,ordinal:true,text:true,normalizedText:true,contentType:true,editorialStatus:true,_count:{select:{entityLinks:true}} } as const;

export const classicRepository = {
  getClassicBySlug:(slug:string)=>prisma.classic.findUnique({where:{slug}}),
  getClassicWitnesses:(classicId:string)=>prisma.textWitness.findMany({where:{classicId},select:witnessSelect,orderBy:[{isPrimary:"desc"},{createdAt:"asc"},{id:"asc"}]}),
  getClassicStructure:(witnessId:string)=>prisma.textSection.findMany({where:{witnessId},include:{_count:{select:{passages:true}}},orderBy:[{parentId:"asc"},{ordinal:"asc"},{id:"asc"}]}),
  getSectionPassages:(sectionId:string)=>prisma.textPassage.findMany({where:{sectionId},select:passageSelect,orderBy:[{ordinal:"asc"},{id:"asc"}]}),
  getPassage:(id:string)=>prisma.textPassage.findUnique({where:{id},include:{section:{include:{witness:{include:{classic:true,source:true}}}},entityLinks:true,citations:{include:{source:true}}}}),
  getWitnessPassageOrder:(witnessId:string)=>prisma.textPassage.findMany({where:{section:{witnessId}},select:{id:true,text:true,sectionId:true},orderBy:[{section:{ordinal:"asc"}},{ordinal:"asc"},{id:"asc"}]}),
  searchClassicText:(query:string,classicId?:string,witnessId?:string)=>prisma.textPassage.findMany({where:{text:{contains:query},section:{...(witnessId?{witnessId}:{}),witness:{...(classicId?{classicId}:{})}}},include:{section:{include:{witness:{include:{classic:true}}}}},orderBy:[{section:{ordinal:"asc"}},{ordinal:"asc"}],take:30}),
  getArchiveList:()=>prisma.classic.findMany({include:{witnesses:{include:{sections:{include:{_count:{select:{passages:true}}}}}}},orderBy:{title:"asc"}}),
  getClassicRelationCount:(classicIds:string[])=>prisma.relation.findMany({where:{OR:[{sourceType:"CLASSIC",sourceId:{in:classicIds}},{targetType:"CLASSIC",targetId:{in:classicIds}}]},select:{sourceType:true,sourceId:true,targetType:true,targetId:true}}),
};
