import type { EditorialStatus, EditionType, EvidenceStatus, KnowledgeEntityType, PassageContentType, PassageLinkType } from "@prisma/client";

export interface WitnessView { id:string; title:string; shortTitle?:string; editionType:EditionType; description?:string; isPrimary:boolean; editorialStatus:EditorialStatus; sourceTitle?:string }
export interface SectionTreeNode { id:string; slug:string; title:string; ordinal:number; sectionType:string; depth:number; parentId?:string; children:SectionTreeNode[]; passageCount:number }
export interface PassageView { id:string; ordinal:number; text:string; normalizedText?:string; contentType:PassageContentType; editorialStatus:EditorialStatus; linkCount:number }
export interface PassageEntityView { id:string; entityType:KnowledgeEntityType; entityId:string; title:string; href:string; linkType:PassageLinkType; note?:string; evidenceStatus:EvidenceStatus }
export interface PassageCitationView { id:string; sourceTitle:string; locator?:string; note?:string; evidenceStatus:EvidenceStatus; subjectType:string; subjectId:string }
export interface PassageRuleView { policyId:string;title:string;href:string;evidenceStatus:EvidenceStatus }
export interface PassageContext { passage:PassageView; previous?:{id:string;text:string}; next?:{id:string;text:string}; section:{id:string;slug:string;title:string}; witness:WitnessView; classic:{id:string;slug:string;title:string}; entityLinks:PassageEntityView[]; citations:PassageCitationView[];rules:PassageRuleView[] }
export interface ReaderData { classic:{id:string;slug:string;title:string}; witnesses:WitnessView[]; witness:WitnessView; sections:SectionTreeNode[]; activeSection:{id:string;slug:string;title:string}; passages:PassageView[]; selectedPassage?:PassageContext }
export interface ClassicArchiveItem { id:string;slug:string;title:string;period?:string;category:string;summary:string;editorialStatus:EditorialStatus;witnessCount:number;sectionCount:number;passageCount:number;relationCount:number }
