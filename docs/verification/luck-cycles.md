# 大运验证状态

## 已验证

- 20 个固定 fixture：方向、起运年月日、前三步大运；全部为 Tier B。
- 10 个年干 × 男/女的顺逆穷举。
- 60 个合法月柱 × 顺逆 × 12 步序列穷举。
- 生产实现与独立测试路径 `lunar-typescript Yun sect 2` 交叉核对。
- Rule Diff：同规则、日界差异、顺逆差异、起运折算差异。
- API 拒绝缺少规则输入、未知规则、测试 Policy 和未知时刻下的显式大运请求。

## 尚未验证

- 当前没有 Tier A 人工权威大运盘例。
- 规则 Passage 级 Citation 已接入《古今图书集成》所收《三命通会》影像摘录；数字页仍标为未校对，需人工二次校勘。
- `luck-02`、`luck-05` 的一日差异已分类为余小时表示与 Provider 取整路径差异，不涉及顺逆、目标节或大运序列；玄象未在缺乏文献依据时新增 rounding policy。
- 不实现旺衰、格局、用神及任何吉凶解释。

全部 20 条 fixture 现包含 source、locator、retrievedAt、inputPrecision、ruleCompatibility 与 verificationNote。Tier A 仍为 0：尚未找到同时具备可追溯出生输入、明确规则口径、顺逆、起运年龄和前几步大运的独立公开盘例；不以普通排盘网站或历史名人推算降低标准。
