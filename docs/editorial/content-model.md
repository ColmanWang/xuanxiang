# 内容模型

Studio 通过 `EditorialEntity` 表现层统一 Concept、Classic、Person、School 和 Technique，但不新建重复主表。

`DataCategory` 区分正式内容、开发/回归/布局 fixture 和样例内容。Classic、Witness、Section 与 Passage 分层管理。`SOURCE_TEXT` 是证据层，修改需 Diff 和显式确认；`EDITORIAL_NOTE` 不伪装成原文。
