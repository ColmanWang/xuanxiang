import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type GraphEntityType } from "@prisma/client";
import { graphEntityRecords } from "../data/graph/nodes";
import { graphEdges } from "../data/graph/edges";
import { validateRelations } from "../lib/services/relation-validation-service";
import { importClassicText } from "../lib/importers/classic-text/importer";
import { laoziSample, shangshuSample, zhouyiSample, zhuangziSample } from "./seed-data/classics";
import { sanmingTonghuiRuleSample } from "./seed-data/classics/sanming-tonghui";
import { shilinGuangjiLiuyaoSample, xiangshiJiashuoLiuyaoSample, zengshanBuyiLiuyaoSample } from "./seed-data/classics/liuyao-rules";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const upperType = (value: string) => value.toUpperCase() as GraphEntityType;
const reviewedAt = new Date("2026-08-09T00:00:00.000Z");

const definitionById: Record<string, string> = {
  yinyang: "描述相反相成、消长转化关系的基本思想范畴。",
  wuxing: "以木、火、土、金、水五类要素及其关系说明变化秩序的模型。",
  bagua: "由阴阳爻组合而成的八种基本卦象。",
  xiangshu: "以象、数及其结构关系解释变化的易学方法范畴。",
  yili: "侧重经典义旨、哲理与人伦秩序的解释路径。",
  tiangan: "甲至癸十种用于纪时、次序与分类的符号。",
  dizhi: "子至亥十二种用于纪时、方位与周期的符号。",
  hetu: "传统易学中表达数理秩序的图式。",
  luoshu: "以九宫数序表达方位与秩序的传统图式。",
  "wenwang-gua": "后世以六十四卦、动变、纳甲等规则组织的一类传统易占体系。",
  bagong: "将六十四卦分属八个卦宫，并标识本宫、一至五世、游魂与归魂位置的分类结构。",
  "shi-ying": "在八宫卦序中确定世爻与应爻位置的六爻排盘结构。",
  "liu-qin": "以卦宫五行与爻支五行的生克关系配置的传统六爻术语标签。",
  "liu-shen": "依据占卜日干确定起始项，并从初爻向上排列的六种传统标识。",
  "moving-line": "由老阴或老阳输入标记、在变卦生成时转换阴阳的爻位。",
  "changed-hexagram": "将本卦动爻逐一转换阴阳后得到的卦象。",
  "hidden-spirit": "六爻排盘中用于表达未在当前卦爻直接呈现之六亲的结构术语；具体规则尚待校核。",
  "month-command": "六爻排盘中依据节气月序确定的月支历法上下文。",
  "day-command": "六爻排盘中依据起卦当地日期干支确定的日序上下文。",
};

async function seedEntities() {
  for (const item of graphEntityRecords) {
    const common = { id: item.entityId, slug: item.slug, aliases: item.aliases ?? [], summary: item.summary ?? "条目正在整理。", categories: item.category ? [item.category] : [], editorialStatus: "BASIC" as const, lastReviewedAt: reviewedAt };
    if (item.entityType === "concept") await prisma.concept.upsert({ where: { id: item.entityId }, update: { ...common, name: item.title, definition: definitionById[item.entityId] }, create: { ...common, name: item.title, definition: definitionById[item.entityId], historicalContext: item.dynasty ? `主要历史语境：${item.dynasty}。` : undefined } });
    if (item.entityType === "classic") await prisma.classic.upsert({ where: { id: item.entityId }, update: { ...common, title: item.title, period: item.dynasty }, create: { ...common, title: item.title, period: item.dynasty, themes: item.category ? [item.category] : [], attributionStatus: "UNKNOWN" } });
    if (item.entityType === "person") await prisma.person.upsert({ where: { id: item.entityId }, update: { ...common, name: item.title, period: item.dynasty }, create: { ...common, name: item.title, period: item.dynasty, role: item.category } });
    if (item.entityType === "school") await prisma.school.upsert({ where: { id: item.entityId }, update: { ...common, name: item.title, period: item.dynasty }, create: { ...common, name: item.title, period: item.dynasty, classificationStatus: "INFERRED" } });
    if (item.entityType === "technique") {
      const toolPath = item.entityId === "sizhu-mingli" ? "/tools/bazi" : item.entityId === "liuyao" ? "/tools/liuyao" : undefined;
      await prisma.technique.upsert({ where: { id: item.entityId }, update: { ...common, name: item.title, period: item.dynasty, category: item.category ?? "术数", definition: item.summary, toolPath }, create: { ...common, name: item.title, period: item.dynasty, category: item.category ?? "术数", definition: item.summary, toolPath } });
    }
    if (item.entityType === "dynasty") await prisma.dynasty.upsert({ where: { id: item.entityId }, update: { name: item.title, slug: item.slug, summary: item.summary }, create: { id: item.entityId, name: item.title, slug: item.slug, summary: item.summary, editorialStatus: "BASIC" } });
  }
  await prisma.classic.upsert({ where: { id: "shangshu" }, update: { title:"尚书",slug:"shangshu",aliases:["书经"],summary:"汇集上古政治文献与历史叙事的重要经典，篇章形成与传承问题复杂。",categories:["经学"],period:"先秦至汉代传承",editorialStatus:"BASIC",lastReviewedAt:reviewedAt }, create: { id:"shangshu",title:"尚书",slug:"shangshu",aliases:["书经"],summary:"汇集上古政治文献与历史叙事的重要经典，篇章形成与传承问题复杂。",categories:["经学"],period:"先秦至汉代传承",attributionStatus:"COMPOSITE",editorialStatus:"BASIC",lastReviewedAt:reviewedAt } });
  await prisma.classic.upsert({ where: { id: "shilin-guangji" }, update: { title:"事林广记",slug:"shilin-guangji",aliases:["新编纂图增类群书类要事林广记"],summary:"宋元间形成并经后世刊刻流传的日用类书；当前仅收录续集卷十一中与卜筮规则有关的极少量数字转录。",categories:["类书","术数文献"],period:"宋元及后世刊本",editorialStatus:"BASIC",lastReviewedAt:reviewedAt }, create: { id:"shilin-guangji",title:"事林广记",slug:"shilin-guangji",aliases:["新编纂图增类群书类要事林广记"],summary:"宋元间形成并经后世刊刻流传的日用类书；当前仅收录续集卷十一中与卜筮规则有关的极少量数字转录。",categories:["类书","术数文献"],period:"宋元及后世刊本",authorDisplay:"陈元靓编纂",attributionStatus:"TRADITIONAL",editorialStatus:"BASIC",lastReviewedAt:reviewedAt } });
  await prisma.classic.upsert({ where: { id: "xiangshi-jiashuo" }, update: { title:"项氏家说",slug:"xiangshi-jiashuo",aliases:[],summary:"项安世论经著作；卷二保存对京氏易纳甲、世应及飞伏规则的后世说明。",categories:["经学","易学文献"],period:"南宋",editorialStatus:"BASIC",lastReviewedAt:reviewedAt }, create: { id:"xiangshi-jiashuo",title:"项氏家说",slug:"xiangshi-jiashuo",aliases:[],summary:"项安世论经著作；卷二保存对京氏易纳甲、世应及飞伏规则的后世说明。",categories:["经学","易学文献"],period:"南宋",authorDisplay:"项安世",attributionStatus:"CERTAIN",editorialStatus:"BASIC",lastReviewedAt:reviewedAt } });
  await prisma.classic.upsert({ where: { id: "zengshan-buyi" }, update: { title:"增删卜易",slug:"zengshan-buyi",aliases:[],summary:"清代六爻占法文献；当前仅收录与月建、日辰、六神规则语境有关的极少量数字转录。",categories:["术数文献"],period:"清",editorialStatus:"BASIC",lastReviewedAt:reviewedAt }, create: { id:"zengshan-buyi",title:"增删卜易",slug:"zengshan-buyi",aliases:[],summary:"清代六爻占法文献；当前仅收录与月建、日辰、六神规则语境有关的极少量数字转录。",categories:["术数文献"],period:"清",authorDisplay:"野鹤老人",attributionStatus:"TRADITIONAL",editorialStatus:"BASIC",lastReviewedAt:reviewedAt } });
}

const sources = [
  { id: "source-zhouyi", type: "PRIMARY_TEXT" as const, title: "《周易》", dynastyOrYear: "先秦至汉初传承形成", note: "用于易学相关条目的原典定位。" },
  { id: "source-laozi", type: "PRIMARY_TEXT" as const, title: "《老子》", dynastyOrYear: "先秦", note: "作者与文本形成问题按具体版本研究处理。" },
  { id: "source-zhuangzi", type: "PRIMARY_TEXT" as const, title: "《庄子》", dynastyOrYear: "战国至汉初" },
  { id: "source-hanshu", type: "PRIMARY_TEXT" as const, title: "《汉书》", author: "班固", dynastyOrYear: "东汉" },
  { id: "source-sanguozhi", type: "PRIMARY_TEXT" as const, title: "《三国志》", author: "陈寿", dynastyOrYear: "西晋" },
  { id: "source-jinshu", type: "PRIMARY_TEXT" as const, title: "《晋书》", author: "房玄龄等", dynastyOrYear: "唐" },
  { id: "source-baopuzi", type: "PRIMARY_TEXT" as const, title: "《抱朴子》", author: "葛洪", dynastyOrYear: "东晋" },
  { id: "source-huangji", type: "PRIMARY_TEXT" as const, title: "《皇极经世》", author: "邵雍", dynastyOrYear: "北宋" },
  { id: "source-yuanhai", type: "PRIMARY_TEXT" as const, title: "《渊海子平》", dynastyOrYear: "宋元文献系统" },
  { id: "source-sanming", type: "PRIMARY_TEXT" as const, title: "《三命通会》", author: "万民英", dynastyOrYear: "明" },
  { id: "source-sanming-gujin-472", type: "PRIMARY_TEXT" as const, title: "《古今图书集成·博物汇编·艺术典》卷六百二十四所收《三命通会·消息赋下》", author: "《三命通会》万民英撰；《古今图书集成》陈梦雷等编", dynastyOrYear: "清康熙间编纂本数字影像", edition: "Internet Archive 扫描件经 Wikimedia Commons / 维基文库承载，Volume 472，影像页 66、69", publisher: "维基文库数字承载", url: "https://zh.wikisource.org/wiki/Index:Gujin_Tushu_Jicheng,_Volume_472_(1700-1725).djvu", note: "影像已人工打开核对；维基文库转录页标为尚未校对，玄象仅录入与规则直接相关的短句。" },
  { id: "source-zangshu", type: "PRIMARY_TEXT" as const, title: "《葬书》", dynastyOrYear: "传统归属有待版本考辨" },
  { id: "source-shangshu", type: "PRIMARY_TEXT" as const, title: "《尚书》", dynastyOrYear: "先秦至汉代传承", note: "篇章与文本系统复杂；当前仅作开发样例来源。" },
  { id: "source-shilin-guangji-xuji-11", type: "PRIMARY_TEXT" as const, title: "《事林广记·续集卷十一·卜史类》", author: "陈元靓编纂", dynastyOrYear: "南宋成书传统；后世刊本流传", edition: "维基文库公共领域数字转录", publisher: "维基文库数字承载", url: "https://zh.wikisource.org/zh/事林廣記/續集/卷11", note: "已实际打开核对全文页面；仅作后世规则定式的可定位转录，尚待版本影像逐字校订。" },
  { id: "source-xiangshi-jiashuo-juan-2", type: "PRIMARY_TEXT" as const, title: "《项氏家说（四库全书本）·卷二·说经篇二》", author: "项安世", dynastyOrYear: "南宋", edition: "四库全书本维基文库公共领域数字转录", publisher: "维基文库数字承载", url: "https://zh.wikisource.org/wiki/項氏家説_(四庫全書本)/卷02", note: "已实际打开核对纳甲、世应与飞伏段落；数字转录仍待影像校订。" },
  { id: "source-zengshan-buyi-wikisource", type: "PRIMARY_TEXT" as const, title: "《增删卜易》维基文库公共领域数字转录", author: "野鹤老人", dynastyOrYear: "清", edition: "维基文库公共领域数字转录", publisher: "维基文库数字承载", url: "https://zh.wikisource.org/zh-hans/增删卜易", note: "已实际打开核对月建、日辰与六神相关章节；仅用于规则语境，不导入断卦内容。" },
] as const;

async function seedSources() {
  for (const source of sources) await prisma.source.upsert({ where: { id: source.id }, update: source, create: source });
  const citations = [
    { id: "citation-wuxing", sourceId: "source-zhouyi", subjectType: "CONCEPT" as const, subjectId: "wuxing", locator: "传文相关篇章", note: "支持五行进入易学解释传统的条目背景；具体语句待版本校订。", citationType: "HISTORICAL_CONTEXT" as const },
    { id: "citation-zhouyi", sourceId: "source-zhouyi", subjectType: "CLASSIC" as const, subjectId: "zhouyi", note: "条目所述文本结构以传世《周易》为对象。", citationType: "GENERAL" as const },
    { id: "citation-wangbi", sourceId: "source-sanguozhi", subjectType: "PERSON" as const, subjectId: "wangbi", locator: "魏书相关传记", note: "用于人物基本时代背景；精确版本页码待补。", citationType: "HISTORICAL_CONTEXT" as const },
    { id: "citation-jingfang", sourceId: "source-hanshu", subjectType: "PERSON" as const, subjectId: "jingfang", locator: "京房传", citationType: "HISTORICAL_CONTEXT" as const },
  ];
  for (const citation of citations) await prisma.citation.upsert({ where: { id: citation.id }, update: { ...citation, evidenceStatus: "DOCUMENTED" }, create: { ...citation, evidenceStatus: "DOCUMENTED" } });
}

async function seedClassicTexts() {
  for (const payload of [zhouyiSample, laoziSample, zhuangziSample, shangshuSample, sanmingTonghuiRuleSample, shilinGuangjiLiuyaoSample, xiangshiJiashuoLiuyaoSample, zengshanBuyiLiuyaoSample]) await importClassicText({ ...payload, dataCategory: "SAMPLE_CONTENT" }, prisma);
  const passageCitations = [
    { id:"citation-wuxing", passageId:"passage-shangshu-wuxing", locator:"洪范", sourceId:"source-shangshu", subjectType:"CONCEPT" as const, subjectId:"wuxing", citationType:"DEFINITION" as const, evidenceStatus:"DOCUMENTED" as const, note:"支持五行名称及基本次序；示例分段与标点待人工校订。" },
    { id:"citation-yinyang-passage",passageId:"passage-zhouyi-yinyang",locator:"系辞上传",sourceId:"source-zhouyi",subjectType:"CONCEPT" as const,subjectId:"yinyang",citationType:"DEFINITION" as const,evidenceStatus:"DOCUMENTED" as const,note:"用于阴阳概念的原典定位；示例文本待版本校订。" },
    { id:"citation-bagua-passage",passageId:"passage-zhouyi-taiji",locator:"系辞上传",sourceId:"source-zhouyi",subjectType:"CONCEPT" as const,subjectId:"bagua",citationType:"HISTORICAL_CONTEXT" as const,evidenceStatus:"DOCUMENTED" as const,note:"用于八卦相关条目的原典定位。" },
    { id:"citation-rule-luck-direction",passageId:"passage-sanming-direction-2",locator:"《古今图书集成》艺术典卷六百二十四，星命部汇考六十，《三命通会》三十二〈消息赋下〉，影像页69，“男迎女送”释文",sourceId:"source-sanming-gujin-472",subjectType:"TECHNIQUE" as const,subjectId:"sizhu-mingli",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"支持阳男阴女顺行的后世表述；结合相邻文句说明阴阳男女依逆顺行运。不能据此宣称为该规则最早来源。" },
    { id:"citation-rule-luck-start",passageId:"passage-sanming-luck-start",locator:"《古今图书集成》艺术典卷六百二十四，星命部汇考六十，《三命通会》三十二〈消息赋下〉，影像页69，“依逆顺行运折除”释文",sourceId:"source-sanming-gujin-472",subjectType:"TECHNIQUE" as const,subjectId:"sizhu-mingli",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"支持按节气日数定岁数及折年关系；不支持玄象对余小时、余分钟与截断顺序的全部工程细节。" },
    { id:"citation-liuyao-palaces",passageId:"passage-shilin-eight-palaces",locator:"续集卷十一·卜史类，推八卦所生数游魂归魂诀",sourceId:"source-shilin-guangji-xuji-11",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"文献明确列出八宫各宫一至五世、游魂、归魂卦序；支持后世定式，不等于《周易》经文直接规定。" },
    { id:"citation-liuyao-shi-ying",passageId:"passage-xiangshi-shi-ying",locator:"卷二·说经篇二，世应例",sourceId:"source-xiangshi-jiashuo-juan-2",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"文献明确说明本宫、归魂及其余宫位的世爻与应爻原则；玄象另行形式化为0-based爻位。" },
    { id:"citation-liuyao-najia",passageId:"passage-xiangshi-najia",locator:"卷二·说经篇二，纳甲法",sourceId:"source-xiangshi-jiashuo-juan-2",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"文献逐爻列出八纯卦纳干支；支持后世纳甲定式，不证明该规则由《周易》经文直接提出。" },
    { id:"citation-liuyao-six-relatives",passageId:"passage-shilin-six-relatives",locator:"续集卷十一·卜史类，配卦内六亲法",sourceId:"source-shilin-guangji-xuji-11",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"支持五行生克与六亲术语映射；现实人物关系与吉凶判断不在本阶段。" },
    { id:"citation-liuyao-six-spirits",passageId:"passage-zengshan-six-spirits-table",locator:"卷首·起六神诀",sourceId:"source-zengshan-buyi-wikisource",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"支持当前规则采用的甲乙、丙丁、戊、己、庚辛、壬癸起六神次序；不支持任何吉凶解释。" },
    { id:"citation-liuyao-six-spirits-shilin-variant",passageId:"passage-shilin-six-spirits",locator:"续集卷十一·卜史类，定十干日六神入卦法",sourceId:"source-shilin-guangji-xuji-11",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"CONTESTED" as const,note:"《事林广记》续集卷十一所见戊己起例与当前规则采用的《增删卜易》起例不同；作为来源差异保留，不作为当前算法直接依据。" },
    { id:"citation-liuyao-hidden-context",passageId:"passage-xiangshi-flying-hidden",locator:"卷二·说经篇二，飞伏例",sourceId:"source-xiangshi-jiashuo-juan-2",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"HISTORICAL_CONTEXT" as const,evidenceStatus:"TRADITIONAL" as const,note:"提供飞伏规则历史线索；因适用范围和独立fixtures不足，玄象仍不实现伏神。" },
    { id:"citation-liuyao-month-jian-zengshan",passageId:"passage-zengshan-month-jian-branches",locator:"四时旺相章，十二月建地支配属",sourceId:"source-zengshan-buyi-wikisource",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"支持月建与十二地支配属；玄象以十二节气瞬间作为切换边界属于工程形式化，非该短段逐秒说明。" },
    { id:"citation-liuyao-day-context-zengshan",passageId:"passage-zengshan-day-context",locator:"日辰章",sourceId:"source-zengshan-buyi-wikisource",subjectType:"TECHNIQUE" as const,subjectId:"liuyao",citationType:"RELATION_EVIDENCE" as const,evidenceStatus:"TRADITIONAL" as const,note:"支持日辰作为六爻历法上下文的重要角色；具体日干支由玄象 Calendar Core 确定。" },
  ];
  for (const citation of passageCitations) await prisma.citation.upsert({ where:{id:citation.id},update:citation,create:citation });
}

async function seedRelations() {
  const entityTypeById = new Map(graphEntityRecords.map((item) => [item.entityId, upperType(item.entityType)]));
  const relations = graphEdges.map((item) => ({ ...item, sourceType: entityTypeById.get(item.source)!, sourceId: item.source, targetType: entityTypeById.get(item.target)!, targetId: item.target }));
  await validateRelations(prisma, relations);
  for (const relation of relations) await prisma.relation.upsert({ where: { id: relation.id }, update: { sourceType: relation.sourceType, sourceId: relation.source, targetType: relation.targetType, targetId: relation.target, relationType: relation.type, evidenceStatus: relation.evidenceStatus, note: relation.note, sourceNote: relation.sourceNote }, create: { id: relation.id, sourceType: relation.sourceType, sourceId: relation.source, targetType: relation.targetType, targetId: relation.target, relationType: relation.type, evidenceStatus: relation.evidenceStatus, note: relation.note, sourceNote: relation.sourceNote } });
}

async function seedInterpretations() {
  await prisma.interpretation.upsert({ where: { id: "interpretation-wangbi-yili" }, update: {}, create: { id: "interpretation-wangbi-yili", subjectType: "CONCEPT", subjectId: "yili", title: "王弼的义理解释路径", summary: "以王弼注本为中心观察其对《周易》义旨与言象关系的解释。", attributedToPersonId: "wangbi", period: "魏晋", evidenceStatus: "DOCUMENTED", editorialStatus: "BASIC" } });
  await prisma.interpretation.upsert({ where: { id: "interpretation-najia-jingfang" }, update: {}, create: { id: "interpretation-najia-jingfang", subjectType: "TECHNIQUE", subjectId: "najia", title: "纳甲与京房的传统归属", summary: "后世传统常将纳甲方法与京房联系；具体形成过程仍需依文献层次考察。", attributedToPersonId: "jingfang", period: "汉代传统及后世传承", evidenceStatus: "TRADITIONAL", editorialStatus: "BASIC" } });
}

async function main() {
  await seedEntities();
  await seedSources();
  await seedClassicTexts();
  await seedRelations();
  await seedInterpretations();
  console.log(`Seeded ${graphEntityRecords.length + 1} entities, ${graphEdges.length} relations, ${sources.length} sources and classic text samples.`);
}

main().finally(() => prisma.$disconnect());
