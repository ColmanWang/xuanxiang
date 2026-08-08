# 玄象

玄象是一个面向中国传统思想、典籍与术数研究的知识平台 MVP，产品方向是“知识库 + 思想演化 + 数字典藏 + 确定性推演系统”。

## 技术栈

- Next.js 16 / React 19 / TypeScript / App Router
- Tailwind CSS 4 / shadcn/ui 源码模式
- PostgreSQL / Prisma ORM
- next-themes 深色模式

## 本地启动

```bash
pnpm install
cp .env.example .env
pnpm dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。术数推演的 canonical 路由是 `/systems/deduction`；旧 `/tools` 路由作为兼容入口保留。

当前知识内容来自 `data/` 下的静态 mock 数据，因此没有 PostgreSQL 也能浏览 MVP。八字页面展示的四柱结构同样是 mock，仅用于验证界面结构，不应视为真实计算结果。

## 常用命令

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm prisma:validate
```

## 重要架构原则

八字等术数计算必须由 `lib/bazi/` 下的确定性程序完成，AI 只可解释已有计算结果，禁止让 LLM 直接计算四柱。

**TODO：**实现并测试确定性历法与四柱计算引擎；接入前必须继续明确标注所有四柱结果为 mock。后续还需将 `data/` 中的静态知识数据迁移到 PostgreSQL / Prisma 数据层。
