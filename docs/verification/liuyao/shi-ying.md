# 世应验证

验证对象：

- 每卦恰好一个世爻、一个应爻。
- 世应相隔三爻。
- 内部 line index 固定为 0–5，避免 UI 文字反向解析。

当前方式：

- `calculateShiYing()` 根据八宫宫位返回 `shiLine` 与 `yingLine`。
- Golden Dataset 覆盖本宫、一至五世、游魂、归魂。

限制：

- 文献 Passage 级典据待整理。
