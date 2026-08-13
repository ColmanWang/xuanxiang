import type { ClassicTextImportPayload } from "../../../lib/importers/classic-text/types";

// Public-domain ancient text snippets for development only; punctuation and segmentation await human collation.
export const laoziSample: ClassicTextImportPayload = {
  classicSlug:"laozi",
  witness:{id:"witness-laozi-sample",title:"《老子》玄象开发示例转录",shortTitle:"玄象示例本",sourceId:"source-laozi",editionType:"DIGITAL_TRANSCRIPTION",description:"开发示例文本，不代表权威底本；章次、标点及异文待人工校订。",isPrimary:true,editorialStatus:"DRAFT"},
  sections:[
    {id:"section-laozi-1",slug:"chapter-1",title:"第一章",ordinal:1,sectionType:"章",passages:[
      {id:"passage-laozi-dao",ordinal:1,text:"道可道，非常道；名可名，非常名。",editorialStatus:"DRAFT",links:[{id:"pel-lz-daoism",entityType:"SCHOOL",entityId:"daoism-thought",linkType:"DISCUSSES",evidenceStatus:"DOCUMENTED"}]},
      {id:"passage-laozi-you-wu",ordinal:2,text:"无名天地之始；有名万物之母。",editorialStatus:"DRAFT",links:[{id:"pel-lz-youwu",entityType:"CONCEPT",entityId:"you-wu",linkType:"MENTIONS",evidenceStatus:"DOCUMENTED"}]},
      {id:"passage-laozi-xuan",ordinal:3,text:"玄之又玄，众妙之门。",editorialStatus:"DRAFT",links:[{id:"pel-lz-weijin",entityType:"SCHOOL",entityId:"weijin-xuanxue",linkType:"INTERPRETED_AS",note:"标记后世玄学诠释关系，不表示原文存在该学派名称。",evidenceStatus:"INFERRED"}]},
    ]},
    {id:"section-laozi-25",slug:"chapter-25",title:"第二十五章",ordinal:25,sectionType:"章",passages:[
      {id:"passage-laozi-huncheng",ordinal:1,text:"有物混成，先天地生。",editorialStatus:"DRAFT",links:[{id:"pel-lz-youwu-2",entityType:"CONCEPT",entityId:"you-wu",linkType:"DISCUSSES",evidenceStatus:"INFERRED"}]},
      {id:"passage-laozi-fadi",ordinal:2,text:"人法地，地法天，天法道，道法自然。",editorialStatus:"DRAFT",links:[{id:"pel-lz-mingjiao",entityType:"CONCEPT",entityId:"mingjiao-ziran",linkType:"INTERPRETED_AS",evidenceStatus:"INFERRED"}]},
    ]},
    {id:"section-laozi-42",slug:"chapter-42",title:"第四十二章",ordinal:42,sectionType:"章",passages:[
      {id:"passage-laozi-shengyi",ordinal:1,text:"道生一，一生二，二生三，三生万物。",editorialStatus:"DRAFT",links:[{id:"pel-lz-daoism-2",entityType:"SCHOOL",entityId:"daoism-thought",linkType:"DISCUSSES",evidenceStatus:"DOCUMENTED"}]},
      {id:"passage-laozi-fuyin",ordinal:2,text:"万物负阴而抱阳，冲气以为和。",editorialStatus:"DRAFT",links:[{id:"pel-lz-yinyang",entityType:"CONCEPT",entityId:"yinyang",linkType:"MENTIONS",evidenceStatus:"DOCUMENTED"}]},
    ]},
  ],
};
