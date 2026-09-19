# 六神验证

验证对象：

- 青龙、朱雀、勾陈、螣蛇、白虎、玄武。
- 按日干确定初爻六神，自下而上顺排。

当前方式：

- 穷举十个日干。
- 日干来自 Calendar Core 的日干支，不依赖 Bazi Engine。
- `passage-zengshan-six-spirits-table` 保存《增删卜易》公开数字转录中的起六神诀，RuleReference 为 `TRADITIONAL`。
- `passage-shilin-six-spirits` 保存《事林广记》续集卷十一的另一张十干起六神表。该表在戊己起例上与当前规则采用的《增删卜易》起例不同，已登记为 `SOURCE_VARIANT`，不作为当前算法的直接 Citation。

限制：

- 六神仅展示结构，不解释吉凶。
- “螣蛇 / 腾蛇”、“玄武 / 元武”作为文字差异登记，算法枚举保持稳定；数字转录仍待影像逐字校订。
