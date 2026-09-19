import type { ClassicTextImportPayload } from "../../../lib/importers/classic-text/types";

// Small public-domain transcription excerpts only. They document later rule
// formulations; they are not presented as rules stated by the Zhouyi itself.
export const shilinGuangjiLiuyaoSample: ClassicTextImportPayload = {
  classicSlug: "shilin-guangji",
  witness: {
    id: "witness-shilin-guangji-xuji-11-wikisource",
    title: "《事林广记·续集卷十一》维基文库公共领域数字转录摘录",
    shortTitle: "《事林广记》数字转录摘录",
    sourceId: "source-shilin-guangji-xuji-11",
    editionType: "DIGITAL_TRANSCRIPTION",
    description: "仅录入与六爻基础排盘直接相关的极少量文字；已核对公开全文页面，尚待版本影像逐字校订，不代表完整校本。",
    isPrimary: true,
    editorialStatus: "BASIC",
  },
  sections: [{
    id: "section-shilin-guangji-bushi",
    slug: "xuji-11-bushi",
    title: "续集卷十一·卜史类",
    ordinal: 1,
    sectionType: "卷",
    passages: [
      {
        id: "passage-shilin-eight-palaces",
        ordinal: 1,
        text: "乾宮一世姤二世遯三世否四世觀五世剝遊魂晉歸魂大有坎宮一世節二世屯三世既濟四世革五世豐遊魂明夷歸魂師艮宮一世賁二世大畜三世損四世睽五世履遊魂中孚歸魂漸震宮一世豫二世解三世恆四世升五世井遊魂大過歸魂隨巽宮一世小畜二世家人三世益四世無妄五世噬嗑遊魂頤歸魂蠱離宮一世旅二世鼎三世未濟四世蒙五世渙遊魂訟歸魂同人坤宮一世復二世臨三世泰四世大壯五世夬遊魂需歸魂比兌宮一世困二世萃三世咸四世蹇五世謙遊魂小過歸魂歸妹",
        editorialStatus: "BASIC",
        links: [{ id: "link-shilin-palaces", entityType: "CONCEPT", entityId: "bagong", linkType: "DEFINES", evidenceStatus: "DOCUMENTED", note: "后世文献列出八宫各宫卦序；转录待影像校订。" }],
      },
      {
        id: "passage-shilin-shi-ying",
        ordinal: 2,
        text: "一世卦應在四二世卦應在五三世卦應在六四世卦應在初五世卦應在二遊魂卦世在四歸魂卦世在三八純卦世在六",
        editorialStatus: "BASIC",
        links: [{ id: "link-shilin-shi-ying", entityType: "CONCEPT", entityId: "shi-ying", linkType: "DEFINES", evidenceStatus: "DOCUMENTED", note: "支持八宫位置与世应爻位的后世定式。" }],
      },
      {
        id: "passage-shilin-six-relatives",
        ordinal: 3,
        text: "生我者為父母我生者為子孫剋我者為官鬼我剋者為妻財比和者為兄弟",
        editorialStatus: "BASIC",
        links: [{ id: "link-shilin-six-relatives", entityType: "CONCEPT", entityId: "liu-qin", linkType: "DEFINES", evidenceStatus: "DOCUMENTED", note: "支持五行关系映射为六亲术语。" }],
      },
      {
        id: "passage-shilin-six-spirits",
        ordinal: 4,
        text: "甲乙日一青龍二朱雀三勾陳四騰蛇五白虎六玄武丙丁日一朱雀二勾陳三騰蛇四白虎五玄武六青龍戊己日一勾陳二騰蛇三白虎四玄武五青龍六朱雀庚辛日一白虎二玄武三青龍四朱雀五勾陳六騰蛇壬癸日一玄武二青龍三朱雀四勾陳五騰蛇六白虎",
        editorialStatus: "BASIC",
        links: [{ id: "link-shilin-six-spirits", entityType: "CONCEPT", entityId: "liu-shen", linkType: "DEFINES", evidenceStatus: "DOCUMENTED", note: "支持十日干分组与六神自初爻向上排列。" }],
      },
    ],
  }],
};

export const xiangshiJiashuoLiuyaoSample: ClassicTextImportPayload = {
  classicSlug: "xiangshi-jiashuo",
  witness: {
    id: "witness-xiangshi-jiashuo-juan-2-wikisource",
    title: "《项氏家说（四库全书本）·卷二》维基文库公共领域数字转录摘录",
    shortTitle: "《项氏家说》卷二数字转录",
    sourceId: "source-xiangshi-jiashuo-juan-2",
    editionType: "DIGITAL_TRANSCRIPTION",
    description: "仅录入纳甲、世应与飞伏规则短段；公开数字转录已核对，仍待影像与版本校订。",
    isPrimary: true,
    editorialStatus: "BASIC",
  },
  sections: [{
    id: "section-xiangshi-shuojing-2",
    slug: "juan-2-shuojing-2",
    title: "卷二·说经篇二",
    ordinal: 1,
    sectionType: "卷",
    passages: [
      {
        id: "passage-xiangshi-najia",
        ordinal: 1,
        text: "乾納甲壬坤納乙癸艮納丙兌納丁坎納戊離納己震納庚巽納辛以爻推之乾初起甲子二甲寅三甲辰四壬午五壬申上壬戌坤初起乙未二乙巳三乙卯四癸丑五癸亥上癸酉震初起庚子二庚寅三庚辰四庚午五庚申上庚戌巽初起辛丑二辛亥三辛酉四辛未五辛巳上辛卯坎初起戊寅二戊辰三戊午四戊申五戊戌上戊子離初起己卯二己丑三己亥四己酉五己未上己巳艮初起丙辰二丙午三丙申四丙戌五丙子上丙寅兌初起丁巳二丁卯三丁丑四丁亥五丁酉上丁未",
        editorialStatus: "BASIC",
        links: [{ id: "link-xiangshi-najia", entityType: "TECHNIQUE", entityId: "najia", linkType: "DEFINES", evidenceStatus: "DOCUMENTED", note: "明确列出八纯卦逐爻所纳天干地支；属于后世文献记载。" }],
      },
      {
        id: "passage-xiangshi-shi-ying",
        ordinal: 2,
        text: "京氏易法止用八卦為本得本卦者皆以上為世爻得歸魂卦者皆以三為世爻其餘六卦皆以所變之爻為世世之所對者為應",
        editorialStatus: "BASIC",
        links: [{ id: "link-xiangshi-shi-ying", entityType: "CONCEPT", entityId: "shi-ying", linkType: "DEFINES", evidenceStatus: "DOCUMENTED", note: "明确说明本宫、归魂及其余宫位的世爻与应爻原则。" }],
      },
      {
        id: "passage-xiangshi-flying-hidden",
        ordinal: 3,
        text: "京氏易于世爻用飛伏法凡卦見者為飛不見者為伏其在八卦止以相反者為伏乾見則坤伏震見則巽伏坎見則離伏艮見則兌伏",
        editorialStatus: "BASIC",
        links: [{ id: "link-xiangshi-hidden", entityType: "CONCEPT", entityId: "hidden-spirit", linkType: "DISCUSSES", evidenceStatus: "DOCUMENTED", note: "提供飞伏历史规则线索；不足以完成玄象伏神算法与20条独立 fixtures。" }],
      },
    ],
  }],
};

export const zengshanBuyiLiuyaoSample: ClassicTextImportPayload = {
  classicSlug: "zengshan-buyi",
  witness: {
    id: "witness-zengshan-buyi-wikisource",
    title: "《增删卜易》维基文库公共领域数字转录摘录",
    shortTitle: "《增删卜易》数字转录摘录",
    sourceId: "source-zengshan-buyi-wikisource",
    editionType: "DIGITAL_TRANSCRIPTION",
    description: "仅录入月建、日辰与六神规则相关短段；用于规则来源闭环，不导入断卦判断内容。",
    isPrimary: true,
    editorialStatus: "BASIC",
  },
  sections: [
    {
      id: "section-zengshan-sishi-wangxiang",
      slug: "sishi-wangxiang",
      title: "四时旺相章",
      ordinal: 1,
      sectionType: "章",
      passages: [
        {
          id: "passage-zengshan-month-jian-branches",
          ordinal: 1,
          text: "正月寅为月建二月卯当月建三月辰为月建四月巳为月建五月午为月建六月未为月建七月申为月建八月酉为月建九月戌为月建十月亥为月建十一月子为月建十二月丑为月建",
          editorialStatus: "BASIC",
          links: [
            {
              id: "link-zengshan-month-jian",
              entityType: "CONCEPT",
              entityId: "month-command",
              linkType: "DEFINES",
              evidenceStatus: "DOCUMENTED",
              note: "支持十二月建与地支配属；具体以节界切换属于玄象规则形式化。",
            },
          ],
        },
      ],
    },
    {
      id: "section-zengshan-richen",
      slug: "richen",
      title: "日辰章",
      ordinal: 2,
      sectionType: "章",
      passages: [
        {
          id: "passage-zengshan-day-context",
          ordinal: 1,
          text: "日辰为六爻之主宰司四时之旺相",
          editorialStatus: "BASIC",
          links: [
            {
              id: "link-zengshan-day-context",
              entityType: "CONCEPT",
              entityId: "day-command",
              linkType: "DISCUSSES",
              evidenceStatus: "DOCUMENTED",
              note: "支持日辰作为六爻历法上下文的重要结构；不导入后续吉凶断语。",
            },
          ],
        },
      ],
    },
    {
      id: "section-zengshan-liushen",
      slug: "liushen",
      title: "六神章",
      ordinal: 3,
      sectionType: "章",
      passages: [
        {
          id: "passage-zengshan-six-spirits-table",
          ordinal: 1,
          text: "甲乙日初爻青龙二爻朱雀三爻勾陈四爻滕蛇五爻白虎上爻元武丙丁日初爻朱雀戊日初爻勾陈己日初爻滕蛇庚辛日初爻白虎壬癸日初爻元武",
          editorialStatus: "BASIC",
          links: [
            {
              id: "link-zengshan-six-spirits",
              entityType: "CONCEPT",
              entityId: "liu-shen",
              linkType: "DEFINES",
              evidenceStatus: "DOCUMENTED",
              note: "提供六神起例的另一后世文献语境；玄象算法仍不据此生成吉凶判断。",
            },
          ],
        },
      ],
    },
  ],
};
