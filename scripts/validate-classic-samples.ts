import { laoziSample, shangshuSample, zhouyiSample, zhuangziSample } from "../prisma/seed-data/classics";
import { sanmingTonghuiRuleSample } from "../prisma/seed-data/classics/sanming-tonghui";
import { validateClassicImport } from "../lib/importers/classic-text/validation";
for(const payload of [zhouyiSample,laoziSample,zhuangziSample,shangshuSample,sanmingTonghuiRuleSample]){const sections=validateClassicImport(payload);console.log(`${payload.classicSlug}: ${sections.length} sections, ${sections.reduce((sum,s)=>sum+(s.passages?.length??0),0)} passages`)}
