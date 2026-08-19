# 玄象 · 文王卦标准规则

状态：`EXPERIMENTAL`

版本：`STANDARD_WENWANG_GUA 1.0.0`

本规则集只定义“如何排出结构化六爻卦盘”，不定义断卦、用神、旺衰、应期或吉凶判断。

## 输入边界

- 六个爻值按初爻到上爻提交。
- `6 = 老阴`，`7 = 少阳`，`8 = 少阴`，`9 = 老阳`。
- 用户问题只作为页面备注，不进入计算，不参与 fingerprint。
- 三钱模拟只在 UI 生成爻值；引擎只接受标准化后的六个爻值。

## 当前 Policy

- `HEXAGRAM_BOTTOM_TO_TOP_V1`：自初至上构卦，6/9 为动爻。
- `EIGHT_PALACES_V1`：八宫序列包含本宫、一至五世、游魂、归魂。
- `SHI_YING_EIGHT_PALACES_V1`：按宫位确定世爻，应爻与世爻相隔三位。
- `NAJIA_JINGFANG_COMMON_V1`：按通行纳甲表为每爻配天干地支。
- `SIX_RELATIVES_PALACE_ELEMENT_V1`：以卦宫五行为“我”，与爻支五行比较得六亲。
- `SIX_SPIRITS_DAY_STEM_V1`：按日干起六神，自初爻向上顺排。
- `LIUYAO_JIE_MONTH_MIDNIGHT_DAY_V1`：复用 Calendar Core，以节气确定月建，以当地民用日期确定日辰。
- `HIDDEN_SPIRITS_NOT_IMPLEMENTED_V1`：伏神暂不计算。

## 典据状态

纳甲、八宫、世应、六亲、六神均有公开传统文本可继续核对，但 Phase 8 尚未建立 Passage 级 Citation。当前 RuleReference 只作为规则来源表现层和后续典据挂接点。

因此本规则集不标记为 `STABLE`。

## 历史层次说明

六十四卦的经典文本传统与后世纳甲六爻排盘规则不是同一层次。《周易》提供卦爻文本传统；纳甲、世应、六亲、六神等属于后世易占排盘体系。本阶段页面仅展示排盘结构。
