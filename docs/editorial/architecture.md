# 编辑台架构

`/studio` 是玄象内部的结构化知识工作台，不是博客 CMS。页面仅负责表单和预览，Server Action 每次重新执行环境 Gate 和 Zod 校验，写入服务使用 Prisma transaction、完整性检查与审计日志。

算法 Policy 不从 Studio 修改。Studio 只管理条目、关系、典据、原典和规则典据的展示层。生产环境始终 404；开发环境仍需 `ENABLE_EDITORIAL_STUDIO=true`。
