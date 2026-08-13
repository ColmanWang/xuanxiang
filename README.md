# 玄象

玄象是一个探索中国传统思想体系的数字研究档案，通过“释义—源流—典据—关系—异说”连接经典、人物、概念、学派与术数。

## 技术栈

- Next.js 16 / React 19 / TypeScript / App Router
- Tailwind CSS 4 / shadcn/ui 源码模式
- PostgreSQL 16 / Prisma ORM 7
- React Flow / next-themes
- `lunar-typescript`（节气与农历历表适配）/ Temporal polyfill（IANA 时区与 DST）/ Zod（API 校验）

## 环境要求与启动

- Node.js 22+
- pnpm 11+
- Docker Desktop、OrbStack 或兼容的 Docker Compose 环境

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

PostgreSQL 映射到本机 `127.0.0.1:5433`，避免与常见的 5432 实例冲突。浏览器访问 [http://localhost:3000](http://localhost:3000)。推演保持 `/tools` URL，知识条目与计算界面分离。

## 数据架构

- `Concept`、`Classic`、`Person`、`School`、`Technique`、`Dynasty` 是领域数据主体。
- `KnowledgeEntry` 是 TypeScript 表现层，不建立重复数据总表。
- `Source` 与 `Citation` 保存资料及其支持的具体条目部分；`Interpretation` 支持并列异说。
- `TextWitness` 表示具体文本见证或数字转录，`TextSection` 保存章节树，`TextPassage` 是最小引用单位。
- `PassageEntityLink` 构成“象注”数字关联层；它与古籍原有注疏严格区分。
- `Relation` 保持多态关系，由 `validateRelations()` 在写入前校验两端实体。
- `/graph` 通过 Repository → Graph Service → Graph Adapter 从 PostgreSQL 投影。
- `data/graph` 与原有 `data/*.ts` 仅保留为测试、布局和开发 fixture；生产知识详情与完整图谱不再以其为内容源。

## 常用命令

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm prisma:validate
pnpm prisma:seed
pnpm classics:validate
pnpm calendar:terms 2026 Asia/Shanghai
pnpm bazi:calculate --date 1990-02-04 --time 11:32 --timezone Asia/Shanghai --trace
pnpm calendar:verify-terms
pnpm bazi:rules --provenance
pnpm bazi:verify-foundation
```

## 原典样例与导入

Phase 5 只录入少量公版古代短句作为开发样例。所有样例均标记为“开发示例文本，正式版本待校订”，不复制现代出版社点校本、译文或注释。

样例位于 `prisma/seed-data/classics/`。JSON 导入格式与 `ClassicTextImportPayload` 一致：

```json
{
  "classicSlug": "laozi",
  "witness": {
    "id": "witness-example",
    "title": "开发示例转录",
    "editionType": "DIGITAL_TRANSCRIPTION"
  },
  "sections": [
    {
      "id": "section-example",
      "slug": "chapter-1",
      "title": "第一章",
      "ordinal": 1,
      "sectionType": "章",
      "passages": [
        { "id": "passage-example", "ordinal": 1, "text": "待校订短句。" }
      ]
    }
  ]
}
```

验证内置样例：

```bash
pnpm classics:validate
```

导入经过人工检查的 JSON；导入使用数据库事务，任一关键验证失败会整体回滚：

```bash
pnpm classics:import ./path/to/payload.json
```

Reader 示例：

- `/classics/zhouyi/read`
- `/classics/zhouyi/read?section=xici-shang`
- `/classics/zhouyi/read?passage=passage-zhouyi-yinyang`
- `/classics/zhouyi/read?edition=witness-zhouyi-sample`

## 四柱推演内核

`lib/calendar/` 是可供后续术数复用的历法与时间基础设施；`lib/bazi/` 是不依赖 React、数据库或远程服务的确定性领域引擎。`STANDARD_ZIPING 1.1.0` 当前采用立春年界、十二节月界、本地民用时午夜日界和 IANA 标准时区，并输出有版本记录的大运时间结构。真太阳时只预留规则接口，未启用。

网页 POST `/api/tools/bazi/calculate` 即时返回结果，不写入出生信息。排盘页面为 `/tools/bazi`，四柱命理知识档案为 `/techniques/sizhu-mingli`。回归向量和核验边界记录见 `fixtures/bazi/` 与 `docs/verification/bazi-1.0.md`。

程序负责计算，AI 永远不负责计算；本版本没有 AI 解读、吉凶评分、补救建议或其他术数算法。
Phase 6.5 的历法验证资料位于 `docs/verification/`；开发环境可访问 `/dev/verification/bazi` 查看固定测试覆盖。生产环境该路由返回 404。
