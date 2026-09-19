export const PALACE_GOLDEN={
  乾:["乾","姤","遁","否","观","剥","晋","大有"],兑:["兑","困","萃","咸","蹇","谦","小过","归妹"],离:["离","旅","鼎","未济","蒙","涣","讼","同人"],震:["震","豫","解","恒","升","井","大过","随"],巽:["巽","小畜","家人","益","无妄","噬嗑","颐","蛊"],坎:["坎","节","屯","既济","革","丰","明夷","师"],艮:["艮","贲","大畜","损","睽","履","中孚","渐"],坤:["坤","复","临","泰","大壮","夬","需","比"],
} as const;
export const PALACE_POSITION_GOLDEN=["PURE","FIRST","SECOND","THIRD","FOURTH","FIFTH","WANDERING_SOUL","RETURNING_SOUL"] as const;
export const SHI_GOLDEN=[5,0,1,2,3,4,3,2] as const;

export const PALACE_DATASET_PROVENANCE = Object.freeze({
  source: "《事林广记·续集卷十一·卜史类》公共领域数字转录",
  locator: "推八卦所生数游魂归魂诀；推卦内世应所在之法",
  retrievedAt: "2026-08-29",
  evidenceLevel: "CROSS_CHECKED" as const,
  verificationNote: "测试静态表按实际打开的公开全文逐宫核对，不导入生产 masks、宫序或世应 helper；数字转录仍待影像校订。",
});

export const SOUL_POSITION_GOLDEN = Object.freeze({
  WANDERING_SOUL: ["晋", "小过", "讼", "大过", "颐", "明夷", "中孚", "需"],
  RETURNING_SOUL: ["大有", "归妹", "同人", "随", "蛊", "师", "渐", "比"],
} as const);
