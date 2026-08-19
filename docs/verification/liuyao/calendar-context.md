# 六爻历法上下文验证

验证对象：

- 起卦时间标准化。
- IANA 时区。
- 日辰。
- 月建。

当前方式：

- 复用 `lib/calendar` 的 Temporal/IANA 时区处理、Julian Day 日干支与节气数据。
- `LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1` 明确采用节气月建和当地民用午夜日界。
- 多时区测试覆盖 `Asia/Shanghai`、`UTC`、`America/New_York` 等。

限制：

- 月建口径属于玄象形式化规则选择，Phase 8.5 仍需补 Passage 级典据与规则 hardening。
