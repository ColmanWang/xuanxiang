# 编辑工作流

`DRAFT → BASIC → SOURCED → REVIEWED` 是编辑完整度；`DRAFT / PUBLISHED / ARCHIVED` 是公开可见性，两者不混用。

1. 新条目默认未发布。
2. 完善结构化字段后建立 Source、Citation 和 Relation。
3. `REVIEWED` 需人工点击，且服务端确认存在 Citation。
4. 发布后才进入公开搜索、图谱和详情数据链路。
5. `updatedAt` 是 revision token，冲突时拒绝静默覆盖。
