# 玄象 Phase 11.2 生产验收报告

验收日期：2026-10-12（Asia/Shanghai）  
应用版本：1.0.0  
验收代码：`e538964464b3c0e32f27d596d6909951e8964641`  
生产地址：https://xuanxiang-production.vercel.app/  
验收批准、日常运维及事故授权负责人：项目所有者王仁翔

## 一、最终结论与范围

**Phase 11.2 已按所有者批准的生产 Core 范围完成并签核，结论为有限制通过。**

| 汇总项 | 结果 |
| --- | --- |
| CoreReadiness | READY_WITH_LIMITATIONS；17 项中 12 PASS、5 WAIVED |
| LaunchReadiness | READY_WITH_LIMITATIONS，仅适用于本报告范围 |
| AiReadiness | BLOCKED；4 项未完成 |
| AI / Editorial Studio | 保持关闭 |

PASS 表示所述范围已有验证证据；WAIVED 表示带范围、期限或失效条件、补偿控制的批准限制，不等于功能全面通过；BLOCKED 表示未完成。

本次范围包括公开浏览、知识库、典籍、搜索、确定性八字/六爻排盘、生产基础设施、告警、备份及隔离恢复。**不包括启用 AI、启用生产 Studio、真实生产数据库恢复/切换及完整事故 RTO 已达标的声明。**后续义务不因阶段签核而取消。

## 二、证据来源及边界

- 生产 HTTP、页面元数据、限流及功能结果：用户在真实生产浏览器中执行脚本、提供截图/JSON并确认。
- 远程 CI：GitHub API 查询及用户截图，精确关联验收提交。
- 本地隔离验证：验收代码 e538964 重新生产构建、独立恢复库和独立 Redis、CLI smoke、安全单测及官方依赖审计；后续文档提交不改变该历史运行时基线。
- 生产环境变量范围、保留策略及告警邮件：所有者确认，不输出或保存秘密值到报告。
- 本机直接请求生产 URL 曾连接失败；**不将该次自动 smoke 记为通过，也不据此判定生产站点故障**。
- HTTP 200、数组响应或指纹测试不替代全站内容语义审核、所有页面渲染测试、全面渗透测试。

## 三、Core 17 项验收

| 门槛 | 状态 | 主要证据 / 限制 |
| --- | --- | --- |
| 数据库 | PASS | 独立生产 Neon；生产 health 为 HTTP 200、database=ok。 |
| 迁移 | PASS | 6 条迁移与清单校验一致；最新备份恢复后的迁移完成状态及 pgvector 0.8.6 验证通过。 |
| 备份 | WAIVED | #16 定时导出、加密、上传 HTTP 200、heartbeat、清理成功；检查点新鲜度在 48 小时内。30 天保留已配置，实际到期清理继续跟踪，不承诺未来持续 RPO。 |
| 恢复 | WAIVED | 最新 #16 新空库恢复、双 SHA-256、内容校验、生产模式 smoke 通过；49.497 秒只覆盖准备目标后的恢复链路，完整事故 RTO 延后。 |
| 认证 | WAIVED | Studio 关闭范围内延后；启用前重新验收生产 OAuth、会话与 CSRF，不以 404 代替认证通过。 |
| RBAC | WAIVED | Studio 启用前完成生产角色权限与审计验收；既有 staging 证据不升级为生产通过。 |
| Studio | PASS | /studio、/studio/login、/studio/entries 均 404，无重定向；仅关闭边界。 |
| 内容 | PASS | 已审阅内容快照导入；最新恢复库仍匹配冻结内容 checksum。 |
| 八字 | PASS | 基础验证保留已有局限；生产及恢复环境固定指纹、四柱匹配。 |
| 六爻 | PASS | 基础验证保留 EXPERIMENTAL 状态及已知局限；固定指纹、丰→随匹配。 |
| 限流 | PASS | 三接口触发/恢复验证；接受 SDK 加权滑动窗口语义。不可用 Redis 的 fail-closed 在本地生产模式隔离环境验证，不是生产故障注入。 |
| 安全 | WAIVED | 46 项安全相关测试、CI secret scan、采样响应头、内部接口 404、凭据范围确认；依赖门禁依赖两项既有工具链限时豁免，不声称零漏洞。 |
| 监控告警 | PASS | 浏览器测试异常及真实 database_failure 均进入生产 Sentry，对应邮件收到。 |
| SEO | PASS | robots、canonical、Ask noindex；90 条 sitemap XML 正常，无异域或四类私有路径。 |
| 隐私政策 | PASS | 沿用此前所有者批准的正文范围；生产 Privacy/Terms 可访问，canonical 正确。 |
| CI/CD | PASS | 验收代码 e538964 的 CI 成功、生产 Ready 已确认；隔离配置下该验收代码生产构建成功。 |
| Smoke | PASS | 生产浏览器 Core HTTP 7/7；最新备份恢复库当前构建 CLI 7/7。 |

## 四、关键测试结果

### 4.1 生产健康与固定排盘

health：`status=ok`、`database=ok`、`version=1.0.0`；引擎八字 1.2.0、六爻 1.0.0。

| 固定用例 | HTTP / 结果 |
| --- | --- |
| 八字：2024-02-10 08:30，Asia/Shanghai | 200；xx-bazi-edb3eb8a；甲辰 / 丙寅 / 甲辰 / 戊辰 |
| 六爻：[7,8,9,7,6,8]，2026-08-19 14:30，Asia/Shanghai | 200；xx-liuyao-7cb97a9c；丰→随 |

Core HTTP smoke 的七项为：首页、Knowledge、Classics、health、Search、固定八字、固定六爻。排盘结果是结构计算验收，不包含吉凶预测有效性声明。

### 4.2 限流

| 接口 | 批量结果 | Retry-After | 等待后恢复 |
| --- | --- | --- | --- |
| 搜索 | 19.23 秒，120×200 + 5×429 | 38 秒 | 200 |
| 八字空输入 | 10.382 秒，63×400 + 2×429 | 56 秒 | 400 输入校验响应 |
| 六爻空输入 | 10.877 秒，60×422 + 5×429 | 52 秒 | 422 / INVALID_INPUT |

429 错误码均为 RATE_LIMITED。八字 63 次校验响应不能证明严格 60 次阈值；所有者接受实际使用的加权滑动窗口，不承诺任意连续 60 秒严格最多 60 次。跨时间桶只是合理解释，未被本次时间戳证据确定为根因。

隔离 Redis 不可用时，搜索/八字/六爻均返回 429 / RATE_LIMIT_UNAVAILABLE，未放行；AI 返回 503 / AI_DISABLED。测试未关闭生产 Redis。

### 4.3 安全与关闭边界

- 首页及搜索 API 采样具有 nonce CSP、strict-dynamic，无 unsafe-inline；connect-src 只额外放行指定 Sentry ingestion origin。
- 返回 nosniff、DENY、strict-origin-when-cross-origin、受限 Permissions-Policy，以及 HSTS max-age=31536000/includeSubDomains。
- 4 条 /dev 调试路由与 3 条 Studio 入口均 404；未授权 /api/internal/readiness 为 404。
- /api/ai/chat 为 503 / AI_DISABLED，不是模型调用成功。
- 所有者确认生产凭据仅配置于 Production，direct 迁移凭据不在 Vercel 应用环境；无公开前缀私密凭据。公开 NEXT_PUBLIC_SENTRY_DSN 是已审阅例外。
- 本轮 6 个安全相关测试文件共 46 项通过。官方依赖审计门禁通过，但仍有批准豁免。

### 4.4 CI 与监控

[CI run 38149272635](https://github.com/ColmanWang/xuanxiang/actions/runs/38149272635) 对验收提交成功；quality、secret-scan 通过。

生产 Sentry 浏览器异常与真实服务端 database_failure 事件均收到对应邮件。曾有一次 health 503，随后恢复为 200/database ok；**短暂数据库失败根因尚未确定**。SSL 模式警告未被证明为故障根因。

## 五、最新备份恢复与 RPO/RTO

备份来源：[Production encrypted backup #16](https://github.com/ColmanWang/xuanxiang-backup-ops/actions/runs/38178903299)，定时触发，上传成功。北京时间 2026-10-12 06:04:25–06:04:49；加密文件 96,895 字节。

- 加密文件 SHA-256：48d55fb5ccbfed4db6bcdbcf43e4e06c9c1dff8633756468506804ec6446a7eb。
- 原始归档 SHA-256：01d31c634f04c987f8087abf220d59304472023afbdf96e64fc60dc24a71ff92。
- 冻结内容 checksum：sha256:af49f59fdda249ea6c5de9df863e5f5749dbcc70fc4b602251177e62db7d003b。

恢复目标 rto_restore_20261012 在导入前确认与生产、staging、旧恢复库不同，用户对象为 0。使用 PostgreSQL 18、单事务、遇错退出、no-owner/no-acl、TLS verify-full；无 reset/clean。恢复后 6 条迁移、pgvector、内容校验及当前构建 Core smoke 7/7 通过。

计时为北京时间 **2026-10-12 17:42:58–17:43:47，49.497 秒**，包含下载、哈希、解密、导入、数据库/内容验证与本地生产模式 smoke。目标库和构建在计时前准备好。它**不包含事故发现、人员协调、资源创建、构建、公开部署/生产连接切换和流量恢复**，不是完整事故 RTO。

所有者批准 RPO 48 小时、RTO 4 小时；演练开始时备份约 11 小时 39 分钟，满足该检查点的新鲜度目标。未知的备份后实际数据损失量未测定，不以文件年龄替代数据损失量证明。

## 六、批准限制与后续义务

| 事项 | 责任 / 截止或失效条件 | 补偿控制 |
| --- | --- | --- |
| 完整事故 RTO 演练 | 所有者；2026-11-11 | 已完成最新备份隔离恢复；保留回退方案，真正切换需另行批准。 |
| 30 天保留实际到期清理 | 所有者；首批对象到期时核验，策略变化前复核 | 已配置生命周期；持续观察备份与 heartbeat。 |
| 备份新鲜度 | 所有者；持续运维 | 日常检查成功备份年龄、失败/漏跑告警；高风险迁移前立即备份。 |
| 生产认证 / RBAC | Studio 或认证能力扩展前 | Studio 关闭；保留 staging 验收与服务端边界测试。 |
| 单人恢复审核例外 | 所有者；每次恢复前重新审核 | 不算独立双人审核；隔离验证、保留备份/回退、另行明确执行授权。 |
| braces 工具链豁免 | 2026-10-24（含当日） | 精确依赖路径/版本限制；审计到期及漂移 fail-closed。 |
| deepmerge-ts 工具链豁免 | 2026-10-31（含当日） | 同上，不扩展为运行时漏洞豁免。 |
| AI 4 项 | 启用 AI 前 | AI 保持关闭；供应商、生产索引、回归和 grounded smoke 均待完成。 |

“通过”不表示持续可用性保证、全面安全审计或无漏洞。测试 Redis、新恢复库与受限临时恢复文件保留，未删除。临时目录不是耐久备份或永久证据仓库；核心脱敏结论已写入项目文档。

## 七、签核与交付状态

2026-10-12，所有者明确接受上述限制，并最终签核 **Phase 11.2 在 AI/Studio 关闭的 Core 范围内完成**。此签核不授权启用功能、生产切换、删除资源或 Git 发布。

本报告记录 2026-10-12 的运行时验收与签核，不将后续文档提交的 SHA 当作重新验证的运行时版本。2026-10-13 Release Documentation Closure 仅核对/修正文档、运行 readiness、提交到 main 并确认精确提交的 CI；不变更运行逻辑或启用功能。该收尾提交的 SHA、远端 main SHA 和 CI run ID 在任务交付中记录，避免在自身提交中嵌入尚不存在的提交 SHA。

test-results/ 不纳入本次文档提交。收尾检查时目录存在，test-results/.last-run.json 已在既有提交中被跟踪，并非未跟踪产物；本次不更改其内容或追踪状态。云端资源、恢复配置和凭据不纳入提交，也不删除。

## 八、依据文件

- [机器可读证据](phase11.2-evidence.json)
- [上线清单与最终签核](launch-checklist.md)
- [备份与恢复证据](backup-restore.md)
- [恢复目标与执行边界](disaster-recovery.md)
- [安全审查](security-review.md)
- [依赖豁免记录](dependency-waivers.json)

复核命令：

```bash
pnpm launch:readiness --evidence docs/production/phase11.2-evidence.json
```

该命令只汇总证据状态，不重新访问生产环境，不自动验证豁免有效性或补做缺失测试。
