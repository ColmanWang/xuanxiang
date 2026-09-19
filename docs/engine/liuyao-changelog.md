# 六爻引擎变更记录

## 1.0.0 — 2026-08-19

- 新增独立 `lib/liuyao` 领域模块，不依赖八字引擎。
- 支持六个爻值自初至上输入，生成本卦、动爻、变卦、八宫、世应、纳甲、六亲、六神、日辰、月建、旬空与 Calculation Trace。
- 伏神 / 飞神暂不实现，仅保留结构状态 `NOT_IMPLEMENTED`。
- `STANDARD_WENWANG_GUA` 仍标记为 `EXPERIMENTAL`，因为六爻规则 Passage 级 Citation 尚未闭环。

### Phase 8.5 hardening — 2026-08-30

- 未改变正式排盘算法，Engine 与 RuleSet 版本保持不变。
- 增加 20 个非对称卦方向回归、游魂 / 归魂 16 项专项、60 甲子旬空穷举、十二月建边界秒级测试及跨术数 Calendar Contract。
- 完整盘 fixtures 扩为 20 条，并增加来源等级和 provenance metadata；Tier A 仍为 0。
- 建立 64 卦 Manifest、Regression Manifest、Known Differences、Readiness 2.0 与 Foundation Freeze 纪律。
- 为纳甲、八宫、世应、六亲、六神建立 Passage 级来源链。月建仍待完整影像级典据，伏神保持 `NOT_IMPLEMENTED`。

任何会改变本卦、变卦、八宫、世应、纳甲、六亲、六神、月建或日辰输出的修改，都必须提升 Liuyao Engine 或对应 Policy 版本，并更新 fixtures 与验证说明。
