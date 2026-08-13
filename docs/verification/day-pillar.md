# 日柱验证

生产实现按 proleptic Gregorian 本地民用日期相对 `2000-01-07 甲子` 累计。测试实现不共享该 epoch 或 helper，而采用 Y. T. Liu 公布的 `JD_noon` 干支公式。36 个固定日期覆盖 1901—2100。

当前等级为 `CROSS_CHECKED`：有独立公开算法和 adapter 交叉路径，但没有为全部 36 日逐条取得官方出版历书扫描件，因此不标记为 `AUTHORITATIVE_FIXTURE`。
