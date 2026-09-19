# 月建验证

Policy：`LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1`

## 玄象当前形式化

立春起寅、惊蛰起卯、清明起辰、立夏起巳、芒种起午、小暑起未、立秋起申、白露起酉、寒露起戌、立冬起亥、大雪起子、小寒起丑。边界比较使用节气 UTC Instant，时区只影响本地显示。

## 验证方式

- 对一个完整年内十二节逐项验证 `T - 1 秒 / T / T + 1 秒`。
- 同一立秋 Instant 在 `Asia/Shanghai`、`UTC`、`America/New_York` 中同步切换。
- Trace 必须分开记录节气时刻与六爻月建选择，不把天文事实写成传统规则。

## 典据状态

`passage-zengshan-month-jian-branches` 与 `citation-liuyao-month-jian-zengshan` 保存了《增删卜易》公共领域数字转录中“正月寅……十二月丑”的月建地支配属。这是可定位的后世规则语境，但不足以单独支持“十二节的精确 Instant 逐一作为软件切换边界”。

因此生产 Policy 仍保持 `EvidenceStatus = INFERRED`，且不把该 Citation 当作完整直接规则。完整节界 Passage 尚待可靠版本影像校订；玄象不以搜索摘要、博客或普通排盘网站补足这一缺口。

因此：实现回归通过，历史 Provenance 仍有限；RuleSet 保持 `EXPERIMENTAL`。
