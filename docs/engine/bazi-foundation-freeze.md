# 八字基础计算层冻结说明

冻结基线：`BAZI_ENGINE_VERSION 1.2.0`，`STANDARD_ZIPING 1.1.0`。

冻结范围包括时间标准化、节气、干支、四柱、十神、藏干、纳音、十二长生、五行结构计数、流年干支、大运顺逆、起运折算、大运序列、RuleSet、Trace 与 Fingerprint。

不冻结真太阳时、旺衰、格局、用神、神煞扩展和命理解读。

“冻结”表示任何会改变既有计算结果的修改必须：更新 Engine 或 Policy 版本；更新 changelog；运行完整 calendar、four-pillar 与 luck regression；书面解释输出变化；同步 verification 文档。仅补充 Citation 或编辑说明不得人为提升算法版本。

当前 Readiness 为 `READY_WITH_LIMITATIONS`：规则 Passage 链已建立且已知一日差异完成分类，但大运 Tier A 独立盘例仍为 0，所用影像转录也尚待人工二次校勘。
