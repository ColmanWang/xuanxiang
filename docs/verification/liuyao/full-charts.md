# 六爻完整盘 fixtures

## 分级定义

- Tier A：可独立核验的传统或权威盘例，明确给出六爻输入与本卦、动爻、变卦、八宫、世应、纳甲等核心结果。
- Tier B：独立算法或静态表交叉检查。
- Tier C：玄象合成结构样例，仅用于 regression。

普通排盘网页、博客、论坛、无出处教程与 AI 生成案例不作为 Tier A。

## 当前数量

共 20 条：Tier A 0、Tier B 5、Tier C 15。覆盖无动爻、单动、多动、全动、不同六神日干、多时区、DST 选择与节界附近结构。每条均包含 `tier`、`source`、`locator`、`retrievedAt`、`ruleSet`、`verificationMethod`、`sourceType` 和说明。

Tier A 继续为 0，是因为当前公开材料没有同时满足“输入精度清楚、规则口径清楚、完整排盘结果可追溯”三项要求。没有把普通在线排盘结果降格包装为权威案例。

## 限制

Tier C 只证明确定性、不崩溃与回归稳定，不证明历史规则正确；Tier B 也不等同于原典直接规则依据。Rule Provenance 由 Citation / Passage 单独承担。

## Provenance 完整性

每条 fixture 必须声明来源类型。`SYNTHETIC` 表示人工设计的结构性输入，不得在文档或 UI 中被降格包装为外部盘例。修改 expected 前必须先核对算法、Golden 与来源说明，不得为使测试转绿直接改写。
