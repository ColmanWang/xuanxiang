import type { ClassicTextImportPayload } from "../../../lib/importers/classic-text/types";

// A single public-domain ancient-text sample used to provide a precise Five Phases citation chain.
export const shangshuSample: ClassicTextImportPayload = {
  classicSlug:"shangshu",
  witness:{id:"witness-shangshu-sample",title:"《尚书》玄象开发示例转录",shortTitle:"玄象示例本",sourceId:"source-shangshu",editionType:"DIGITAL_TRANSCRIPTION",description:"仅收录一条开发样例；文本系统与今古文问题均待专题整理。",isPrimary:true,editorialStatus:"DRAFT"},
  sections:[{id:"section-shangshu-hongfan",slug:"hongfan",title:"洪范",ordinal:1,sectionType:"篇",passages:[
    {id:"passage-shangshu-wuxing",ordinal:1,text:"五行：一曰水，二曰火，三曰木，四曰金，五曰土。",editorialStatus:"DRAFT",links:[{id:"pel-ss-wuxing",entityType:"CONCEPT",entityId:"wuxing",linkType:"DEFINES",evidenceStatus:"DOCUMENTED"}]},
  ]}],
};
