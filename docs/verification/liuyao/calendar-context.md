# 六爻历法上下文验证

六爻不调用 Bazi Engine；两者只共享 `lib/calendar` 的 Calendar Fact。

## 已验证

- IANA 时区与 DST 歧义处理沿用 Calendar Core。
- 日辰直接来自已冻结的 Gregorian/Julian Day 干支路径。
- 同一 Instant 在 `Asia/Shanghai`、`UTC`、`America/New_York`、`Europe/London`、`Australia/Sydney` 中，六爻与八字 Calendar 路径的日干支及当前节气记录一致。
- 月建十二个节界均覆盖 `T - 1 秒`、`T`、`T + 1 秒`。
- 同一节气 Instant 在上海、UTC、纽约三种显示时区中于同一时刻切换月建。

## 事实与规则分层

1. 节气发生 Instant 是天文 / 历法事实，由现有 Solar Term Provider 给出。
2. `LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1` 选择十二“节”作为寅至丑月建边界，是六爻规则形式化。
3. 日辰按起卦地 IANA 民用日期、午夜换日，是本 RuleSet 的选择，不自动继承八字 RuleSet。

## 限制

当前已有支持“十二月建地支配属”和“日辰作为历法上下文”的短段 Citation，但尚无通过版本影像校订、并完整表述“十二节逐一切换月建”的 Passage。月建 Policy 因而保持 `EvidenceStatus = INFERRED`，Rule Provenance 虽有 Passage 链路，仍标记为有限来源。这个缺口阻止 RuleSet 升为 `STABLE`，但不改变节界测试已经验证的实现行为。
