# 六爻基础层冻结候选

基线：`LIUYAO_ENGINE_VERSION 1.0.0` / `STANDARD_WENWANG_GUA 1.0.0`

当前结论：`READY_WITH_LIMITATIONS`。核心结构可作为回归基线，但 RuleSet 暂不升级 `STABLE`。

## 冻结候选范围

- 六个爻值的输入语义与自初至上的爻序；
- 本卦、动爻、变卦；
- 六十四卦上下卦映射；
- 八宫、世应、纳甲、六亲、六神；
- 月建、日辰、旬空；
- Calculation Trace、Fingerprint 与 RuleSet 标识。

伏神 / 飞神不在冻结范围，当前明确为 `NOT_IMPLEMENTED`。

## 不冻结

用神、旺衰、月破、日冲综合关系、应期、断卦、吉凶与 AI 解释均不属于基础排盘层。

## 冻结纪律

任何会改变既有正式结果的修改，必须：

1. 提升 Liuyao Engine 或对应 RuleSet / Policy 版本；
2. 更新 `docs/engine/liuyao-changelog.md`；
3. 运行完整 64 卦、4096 动变、纳甲、八宫、世应、历法、完整盘回归；
4. 解释旧结果、原因、影响范围与新结果；
5. 更新验证文档、Regression Manifest 与 Known Differences；
6. 同时运行八字 Foundation Regression，防止 Calendar Core 回归。

只增加 Citation、文档或不改变算法的 fixtures，不人为提升引擎版本。

## 当前限制

- 月建已有地支配属短段 Citation，但十二节精确切换的完整 Passage Provenance 仍待影像校订；
- Tier A 完整盘为 0；
- 伏神缺独立 Golden 和 20 条可靠 fixtures；
- 纳甲、八宫、世应的公共数字转录仍待版本影像逐字校订。

这些限制不否定现有确定性回归，但阻止 RuleSet 宣称 `STABLE`。
