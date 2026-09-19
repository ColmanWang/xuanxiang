# 六爻纳甲规则

Policy：`NAJIA_JINGFANG_COMMON_V1`  
版本：`1.0.0`  
Evidence：`TRADITIONAL`  
Verification：`CROSS_CHECKED`

## 文献实际支持

《项氏家说》卷二的公开数字转录逐爻列出八纯卦所纳天干地支。这支持南宋文献中的后世纳甲定式，但不证明《周易》经文直接规定纳甲，也不证明该表的全部内容可直接归于京房本人。

Rule chain：`NAJIA_JINGFANG_COMMON_V1` → `citation-liuyao-najia` → `passage-xiangshi-najia` → 《项氏家说》卷二 → [维基文库公共领域数字转录](https://zh.wikisource.org/wiki/項氏家説_(四庫全書本)/卷02)。

## 玄象形式化

- 六爻数组自初爻到上爻。
- 下三爻取下卦内卦表，上三爻取上卦外卦表。
- 每爻返回结构化 `HeavenlyStem` 与 `EarthlyBranch`，不以拼接字符串作为内部真值。

数组方向、索引和 TypeScript 类型属于工程定义，不属于 Citation 原文。

## 未解决

纳甲形成史、京房易文献层累与版本异表仍需专题整理；当前不宣称“最早出处”。
