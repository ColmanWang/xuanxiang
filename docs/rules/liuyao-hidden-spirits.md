# 伏神 / 飞神规则研究状态

状态：`NOT_IMPLEMENTED`

## 已确认的历史线索

《项氏家说》卷二的公开数字转录讨论飞伏，并提供部分相对规则。数据库保存为 `passage-xiangshi-flying-hidden`。该 Citation 可作为传统文献记载；但从这段文字推到现代六爻软件的完整伏神装配算法仍存在未解口径，因此 Policy 层 `EvidenceStatus = CONTESTED`。这两个层次不得混同。

## 为什么未实现

现有材料还不足以同时回答：何时必须取伏神、缺失六亲如何回溯本宫卦、伏于哪一爻、飞神如何结构化，以及不同后世口径如何区分。当前也没有独立 Golden Dataset 和至少 20 条可靠 fixtures。

因此玄象只保留 `hiddenSpirit: null` 与 `hiddenSpiritsStatus: NOT_IMPLEMENTED`。已找到一段历史文字，不等于算法已经可验证。

## 进入实现的门槛

1. 明确、可定位且经过校订的规则来源；
2. 结构化算法和适用范围；
3. 与生产代码独立的 Golden；
4. 至少 20 条可追溯 fixtures；
5. 无未分类的核心口径差异。
