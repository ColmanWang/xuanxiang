# 四柱引擎变更记录

## 1.2.0 — 2026-08-13

- 增加 Policy Registry、可版本化策略解析、大运顺逆、起运折算与十步大运序列。
- `BaziChart` 新增聚合的 `luck` 结果，流年可标识所属大运；四柱既有算法与 fixture 预期未改变。
- fingerprint 现在覆盖全部 Policy ID、版本和 override 解析结果。
- 增加规则差分与显式下游传播说明。测试规则仍为 `TEST_ONLY`，生产 API 拒绝使用。
- 起运时间标记为 `TRADITIONAL_APPROXIMATION`，不伪装成天文精确时刻。

## 1.1.0 — 2026-08-10

- 将 DST 不存在与重复时刻拆为稳定错误码，并要求重复时刻显式选择 earlier/later。
- 限制运行时 provider 柱值比对只用于同口径 `Asia/Shanghai`，避免把第三方“中国本地时间”入口错误用于其他 IANA 时区。
- 增加 Trace 分类、边界距离、provider metadata 与稳定 calculation fingerprint。
- 默认 `STANDARD_ZIPING` 的年、月、日、时规则未变；已知时刻的既有十条回归四柱未变化。

Fixture 预期值只有在核对来源与算法后才可修改；不得为消除失败直接改 expected。

## 1.0.0 — 2026-08-09

- 首次确定性四柱引擎。
