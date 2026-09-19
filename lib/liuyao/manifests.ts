import { LIUYAO_FULL_CHART_FIXTURES } from "@/fixtures/liuyao/full-charts";
import { HEXAGRAMS } from "./hexagrams";
import { palaceFor } from "./palaces";
import { calculateShiYing } from "./shi-ying";
import { LIUYAO_ENGINE_VERSION } from "./engine";
import { STANDARD_WENWANG_GUA } from "./rules";

export const LIUYAO_HEXAGRAM_MANIFEST = Object.freeze(HEXAGRAMS.map((hexagram) => {
  const palace = palaceFor(hexagram);
  const shiYing = calculateShiYing(palace.position);
  return Object.freeze({
    number: hexagram.number,
    name: hexagram.name,
    lowerTrigram: hexagram.lowerTrigram.id,
    upperTrigram: hexagram.upperTrigram.id,
    palace: palace.trigram.id,
    palacePosition: palace.position,
    shiLine: shiYing.shiLine,
    yingLine: shiYing.yingLine,
  });
}).sort((left, right) => left.number - right.number));

export const LIUYAO_REGRESSION_MANIFEST = Object.freeze({
  engineVersion: LIUYAO_ENGINE_VERSION,
  ruleSetId: STANDARD_WENWANG_GUA.id,
  ruleSetVersion: STANDARD_WENWANG_GUA.version,
  calendarProviderVersions: Object.freeze({ solarTerms: "lunar-typescript@1.8.6", timezone: "Temporal/IANA" }),
  hexagramCount: LIUYAO_HEXAGRAM_MANIFEST.length,
  palaceFixtureCount: 64,
  najiaFixtureCount: 48,
  shiYingFixtureCount: 64,
  fullChartFixtureCount: LIUYAO_FULL_CHART_FIXTURES.length,
  lastVerifiedAt: "2026-08-30",
});
