import type { ClassicTextImportPayload } from "../../../lib/importers/classic-text/types";

// Public-domain ancient text snippets for development only; punctuation and segmentation await human collation.
export const zhuangziSample: ClassicTextImportPayload = {
  classicSlug:"zhuangzi",
  witness:{id:"witness-zhuangzi-sample",title:"《庄子》玄象开发示例转录",shortTitle:"玄象示例本",sourceId:"source-zhuangzi",editionType:"DIGITAL_TRANSCRIPTION",description:"开发示例文本，仅验证数字关联层；底本、标点与分段待人工校订。",isPrimary:true,editorialStatus:"DRAFT"},
  sections:[
    {id:"section-zhuangzi-qiwulun",slug:"qiwulun",title:"齐物论",ordinal:1,sectionType:"篇",passages:[
      {id:"passage-zhuangzi-bingsheng",ordinal:1,text:"天地与我并生，而万物与我为一。",editorialStatus:"DRAFT",links:[{id:"pel-zz-daoism",entityType:"SCHOOL",entityId:"daoism-thought",linkType:"DISCUSSES",evidenceStatus:"DOCUMENTED"}]},
      {id:"passage-zhuangzi-shifei",ordinal:2,text:"彼亦一是非，此亦一是非。",editorialStatus:"DRAFT",links:[{id:"pel-zz-weijin",entityType:"SCHOOL",entityId:"weijin-xuanxue",linkType:"INTERPRETED_AS",evidenceStatus:"INFERRED"}]},
    ]},
    {id:"section-zhuangzi-xiaoyaoyou",slug:"xiaoyaoyou",title:"逍遥游",ordinal:2,sectionType:"篇",passages:[
      {id:"passage-zhuangzi-wuji",ordinal:1,text:"至人无己，神人无功，圣人无名。",editorialStatus:"DRAFT",links:[{id:"pel-zz-guoxiang",entityType:"PERSON",entityId:"guoxiang",linkType:"INTERPRETED_AS",note:"标记郭象注释传统，不表示原文提及郭象。",evidenceStatus:"DOCUMENTED"}]},
    ]},
  ],
};
