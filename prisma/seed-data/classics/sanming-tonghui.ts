import type { ClassicTextImportPayload } from "../../../lib/importers/classic-text/types";

// Small, scan-checked excerpts only. The witness is explicitly not a complete or fully proofread edition.
export const sanmingTonghuiRuleSample: ClassicTextImportPayload = {
  classicSlug: "sanming-tonghui",
  witness: {
    id: "witness-sanming-gujin-472",
    title: "《古今图书集成·艺术典》卷六百二十四所收《三命通会》数字影像摘录",
    shortTitle: "《古今图书集成》影像摘录",
    sourceId: "source-sanming-gujin-472",
    editionType: "DIGITAL_TRANSCRIPTION",
    description: "据公开数字影像逐页核对的极小范围转录；原页面标记“尚未校对”，仅用于规则典据定位，不代表《三命通会》完整校本。",
    isPrimary: true,
    editorialStatus: "SOURCED",
  },
  sections: [{
    id: "section-sanming-xiaoxifu-xia",
    slug: "xiaoxifu-xia",
    title: "消息赋下",
    ordinal: 1,
    sectionType: "篇",
    passages: [
      { id: "passage-sanming-direction-1", ordinal: 1, text: "陰男陽女時觀出入之年陰女陽男更看元辰之歲", editorialStatus: "SOURCED" },
      { id: "passage-sanming-direction-2", ordinal: 2, text: "男迎女送陽男陰女運順行也", editorialStatus: "SOURCED" },
      { id: "passage-sanming-luck-start", ordinal: 3, text: "陰男陽女陽男陰女依逆順行運折除即前折除三歲為年也", editorialStatus: "SOURCED" },
    ],
  }],
};
