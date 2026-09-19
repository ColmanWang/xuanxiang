# 六爻月建规则

Policy：`LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1`  
Evidence：`INFERRED`

## 传统层与事实层

后世六爻排盘使用月建、日辰。节气的实际发生时刻是 Calendar Fact；以十二“节”作为寅至丑月建边界，是玄象当前 RuleSet 的传统规则形式化。

## 玄象形式化

- 复用 Calendar Core 的 Solar Term Instant，不建立第二个节气算法。
- 从立春至小寒依次切换寅至丑月。
- 边界在精确 Instant 发生；IANA 时区只转换本地显示。
- 日辰另按起卦地民用午夜日界计算。

## Provenance 缺口

当前已有《增删卜易》“正月寅……十二月丑”的短段 Citation，它支持月建与十二地支的配属。但该段没有完整定义现代软件中十二节的秒级切换边界，数字转录亦尚待版本影像校订。

因此 RuleReference 仍显示“典据整理中”，`EvidenceStatus = INFERRED`。不得将 Calendar Core 的边界测试通过写成历史证据充分。

## 已知口径

- 月建地支配属、节气发生时刻与术数中的切换约定是三个不同层次。
- 当前 RuleSet 只收录“十二节切换”一种形式化，不宣称所有传统文献或实践完全一致。
