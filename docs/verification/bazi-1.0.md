# 四柱推演 1.0 核验记录

核验日期：2026-08-10。适用规则：`STANDARD_ZIPING 1.0.0`。

本版本以立春为年界、十二“节”为月界、本地民用时午夜为日界、23:00–00:59 为子时。测试不把农历正月初一当作年柱边界。

核验采用三层证据：香港天文台 1901–2100 年公历与农历对照表用于确认公农历日期与节气落日；玄象以 `2000-01-07` 甲子日为日循环回归基准并验证 60 周期不变量；`lunar-typescript 1.8.6` 通过与玄象公式不同的内部路径，在运行时交叉检查四柱。精确节气时刻目前仍来自同一适配器，因此“分钟级节气边界”不宣称已被第二套天文历表独立证明。

参考：

- 香港天文台，公历与农历对照表：https://www.hko.gov.hk/sc/gts/time/conversion.htm
- 香港天文台，2024 年对照表：https://www.hko.gov.hk/tc/gts/time/calendar/pdf/files/2024.pdf
- `lunar-typescript` 源码与 API：https://github.com/6tail/lunar-typescript
- Y. T. Liu，二十四节气计算说明：https://ytliu0.github.io/ChineseCalendar/docs/sunMoon.pdf

回归 fixture 位于 `fixtures/bazi/regression.ts`。任何预期值变化必须先说明规则或依赖变化，不得为通过测试直接重写 expected。
