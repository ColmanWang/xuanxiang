# 六爻引擎变更记录

## 1.0.0 — 2026-08-19

- 新增独立 `lib/liuyao` 领域模块，不依赖八字引擎。
- 支持六个爻值自初至上输入，生成本卦、动爻、变卦、八宫、世应、纳甲、六亲、六神、日辰、月建、旬空与 Calculation Trace。
- 伏神 / 飞神暂不实现，仅保留结构状态 `NOT_IMPLEMENTED`。
- `STANDARD_WENWANG_GUA` 仍标记为 `EXPERIMENTAL`，因为六爻规则 Passage 级 Citation 尚未闭环。

任何会改变本卦、变卦、八宫、世应、纳甲、六亲、六神、月建或日辰输出的修改，都必须提升 Liuyao Engine 或对应 Policy 版本，并更新 fixtures 与验证说明。
