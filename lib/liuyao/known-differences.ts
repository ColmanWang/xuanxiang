export type LiuyaoKnownDifferenceKind = "RULE_VARIANT" | "SOURCE_VARIANT" | "TERMINOLOGY_VARIANT" | "PROVIDER_DIFFERENCE";

export interface LiuyaoKnownDifference {
  readonly id: string;
  readonly kind: LiuyaoKnownDifferenceKind;
  readonly status: "CLASSIFIED" | "UNRESOLVED";
  readonly summary: string;
  readonly impact: string;
}

export const LIUYAO_KNOWN_DIFFERENCES: readonly LiuyaoKnownDifference[] = Object.freeze([
  Object.freeze({ id: "hidden-spirits-not-in-1x", kind: "RULE_VARIANT", status: "CLASSIFIED", summary: "伏神、飞神尚未进入 1.x 规则集。", impact: "不影响本卦、动变、八宫、世应、纳甲、六亲、六神、月建、日辰与旬空。" }),
  Object.freeze({ id: "soaring-serpent-glyph", kind: "TERMINOLOGY_VARIANT", status: "CLASSIFIED", summary: "螣蛇亦见腾蛇等写法。", impact: "算法枚举保持 SOARING_SERPENT，不改变六神顺序。" }),
  Object.freeze({ id: "six-spirit-wu-ji-start-variant", kind: "SOURCE_VARIANT", status: "CLASSIFIED", summary: "《事林广记》续集卷十一表述为戊己同起勾陈；《增删卜易》卷首起例为戊日起勾陈、己日起螣蛇。", impact: "STANDARD_WENWANG_GUA 1.0.0 采用后者；《事林广记》表不作为当前六神算法的直接 Citation。" }),
]);
