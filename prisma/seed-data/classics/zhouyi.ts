import type { ClassicTextImportPayload } from "../../../lib/importers/classic-text/types";

// Public-domain ancient text snippets for development only; punctuation and segmentation await human collation.
export const zhouyiSample: ClassicTextImportPayload = {
  classicSlug: "zhouyi",
  witness: { id: "witness-zhouyi-sample", title: "《周易》玄象开发示例转录", shortTitle: "玄象示例本", sourceId: "source-zhouyi", editionType: "DIGITAL_TRANSCRIPTION", description: "开发示例文本，仅用于验证引用与阅读链路；标点、分段及版本归属均待人工校订。", isPrimary: true, editorialStatus: "DRAFT" },
  sections: [
    { id:"section-zhouyi-xici-shang",slug:"xici-shang",title:"系辞上传",ordinal:1,sectionType:"传",passages:[
      { id:"passage-zhouyi-yinyang",ordinal:1,text:"一阴一阳之谓道，继之者善也，成之者性也。",editorialStatus:"DRAFT",links:[{id:"pel-zy-yinyang",entityType:"CONCEPT",entityId:"yinyang",linkType:"MENTIONS",evidenceStatus:"DOCUMENTED"},{id:"pel-zy-yixue-1",entityType:"SCHOOL",entityId:"yixue",linkType:"DISCUSSES",evidenceStatus:"INFERRED"}] },
      { id:"passage-zhouyi-daoqi",ordinal:2,text:"形而上者谓之道，形而下者谓之器。",editorialStatus:"DRAFT",links:[{id:"pel-zy-yili-1",entityType:"CONCEPT",entityId:"yili",linkType:"INTERPRETED_AS",evidenceStatus:"INFERRED"}] },
      { id:"passage-zhouyi-shengsheng",ordinal:3,text:"生生之谓易。",editorialStatus:"DRAFT",links:[{id:"pel-zy-yixue-2",entityType:"SCHOOL",entityId:"yixue",linkType:"DEFINES",evidenceStatus:"DOCUMENTED"}] },
      { id:"passage-zhouyi-taiji",ordinal:4,text:"易有太极，是生两仪。两仪生四象，四象生八卦。",editorialStatus:"DRAFT",links:[{id:"pel-zy-bagua",entityType:"CONCEPT",entityId:"bagua",linkType:"MENTIONS",evidenceStatus:"DOCUMENTED"},{id:"pel-zy-xiangshu",entityType:"CONCEPT",entityId:"xiangshu",linkType:"DISCUSSES",evidenceStatus:"INFERRED"}] },
    ]},
    { id:"section-zhouyi-xici-xia",slug:"xici-xia",title:"系辞下传",ordinal:2,sectionType:"传",passages:[
      { id:"passage-zhouyi-lixiang",ordinal:1,text:"圣人立象以尽意，设卦以尽情伪，系辞焉以尽其言。",editorialStatus:"DRAFT",links:[{id:"pel-zy-xiangshu-2",entityType:"CONCEPT",entityId:"xiangshu",linkType:"MENTIONS",evidenceStatus:"DOCUMENTED"},{id:"pel-zy-yili-2",entityType:"CONCEPT",entityId:"yili",linkType:"INTERPRETED_AS",evidenceStatus:"INFERRED"}] },
      { id:"passage-zhouyi-yanyi",ordinal:2,text:"书不尽言，言不尽意。",editorialStatus:"DRAFT",links:[{id:"pel-zy-wangbi",entityType:"PERSON",entityId:"wangbi",linkType:"INTERPRETED_AS",note:"此处仅标记后世诠释关系，并非原文提及王弼。",evidenceStatus:"INFERRED"}] },
    ]},
    { id:"section-zhouyi-qian",slug:"qian",title:"乾",ordinal:3,sectionType:"卦",passages:[
      { id:"passage-zhouyi-tianxingjian",ordinal:1,text:"天行健，君子以自强不息。",editorialStatus:"DRAFT",links:[{id:"pel-zy-zhouyi",entityType:"CLASSIC",entityId:"zhouyi",linkType:"RELATED",evidenceStatus:"DOCUMENTED"}] },
      { id:"passage-zhouyi-qianlong",ordinal:2,text:"潜龙勿用。",editorialStatus:"DRAFT",links:[{id:"pel-zy-bagua-2",entityType:"CONCEPT",entityId:"bagua",linkType:"DISCUSSES",evidenceStatus:"DOCUMENTED"}] },
    ]},
  ],
};
