# 六爻八宫规则

Policy：`EIGHT_PALACES_V1`  
Evidence：`TRADITIONAL`

## 文献实际支持

《事林广记》续集卷十一的公开数字转录列出八宫各宫的一至五世、游魂和归魂卦序，支持后世八宫定式。

Rule chain：`EIGHT_PALACES_V1` → `citation-liuyao-palaces` → `passage-shilin-eight-palaces` → 《事林广记》续集卷十一 → [维基文库公共领域数字转录](https://zh.wikisource.org/zh/事林廣記/續集/卷11)。

## 玄象形式化

玄象以八纯卦为宫主，把本宫、一至五世、游魂、归魂编码为稳定的 `PalacePosition`，并用翻爻算法投影 64 卦。枚举、翻爻 mask、数组索引与宫位返回对象是工程形式化。

## 范围

八宫归属只用于排盘结构与六亲基准，不自动导出旺衰、用神或吉凶。
