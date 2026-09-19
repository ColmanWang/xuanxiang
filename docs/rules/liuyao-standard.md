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

Phase 8.5 已建立以下 Passage 级链路：

- 纳甲：`《项氏家说》卷二`，`TRADITIONAL`。
- 八宫：`《事林广记》续集卷十一`，`TRADITIONAL`。
- 世应：`《项氏家说》卷二`，`TRADITIONAL`。
- 六亲：`《事林广记》续集卷十一`，`TRADITIONAL`。
- 六神：`《增删卜易》卷首起六神诀`，`TRADITIONAL`；《事林广记》续集卷十一保留为已分类来源差异，不作为当前六神算法直接 Citation。

这些 Citation 支持的是后世规则记载，不等于《周易》经文直接规定，也不等于最早来源已经确定。月建十二节边界仍缺完整、经影像校订的 Passage，伏神仍为 `NOT_IMPLEMENTED`。

因此本规则集继续标记为 `EXPERIMENTAL`，VerificationLevel 保持 `CROSS_CHECKED`。

## 历史层次说明

六十四卦的经典文本传统与后世纳甲六爻排盘规则不是同一层次。《周易》提供卦爻文本传统；纳甲、世应、六亲、六神等属于后世易占排盘体系。本阶段页面仅展示排盘结构。

## 形式化边界

原典 / 后世文献文字、传统理解、玄象形式化和程序执行为四个不同层级。爻数组方向、0-based index、枚举、Fingerprint 和 Trace 都是玄象为确定性计算建立的工程表达，不伪装为古籍原文。

详细说明见：`liuyao-najia.md`、`liuyao-palaces.md`、`liuyao-shi-ying.md`、`liuyao-month-jian.md` 与 `liuyao-hidden-spirits.md`。
