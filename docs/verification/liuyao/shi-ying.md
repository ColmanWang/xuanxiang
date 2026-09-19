# 世应验证

## 已验证范围

- 本宫、一至五世、游魂、归魂各位置的世爻。
- 每卦恰好一个世爻、一个应爻；应爻为世爻所对之爻。
- 64 卦逐项验证，不只检查“相隔三位”这一不变量。

`calculateShiYing()` 的生产映射与测试 Golden 分离。测试表不导入生产 `PALACE_POSITION_TO_SHI`；内部统一返回 0–5，页面才转换为初、二、三、四、五、上。

## 来源与证据边界

- 公开转录：[《项氏家说（四库全书本）》卷二](https://zh.wikisource.org/wiki/項氏家説_(四庫全書本)/卷02)。
- 数据库定位：`passage-xiangshi-shi-ying` / `citation-liuyao-shi-ying`。
- 文献说明本宫以上爻为世、归魂以三爻为世，其余以所变之爻为世、所对者为应。
- `EvidenceStatus = TRADITIONAL`：支持后世世应位置原则；玄象的数组索引与返回对象是工程形式化。

《事林广记》续集卷十一另有世应位置短表，可作后世定式的交叉背景；当前正式 RuleReference 指向《项氏家说》Passage。
