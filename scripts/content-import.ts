import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { applyKnowledgeBase, exportKnowledgeBase } from "@/lib/content/database";
import { planContentImport } from "@/lib/content/import";
import type { ContentExport } from "@/lib/content/types";
import { CONTENT_SCHEMA_VERSION } from "@/lib/content/types";
import { prisma } from "@/lib/prisma";

async function main(){const fileIndex = process.argv.indexOf("--file");
if (fileIndex < 0 || !process.argv[fileIndex + 1]) throw new Error("请使用 --file 指定内容快照");
const apply = process.argv.includes("--apply");
const input = JSON.parse(await readFile(resolve(process.argv[fileIndex + 1]), "utf8")) as ContentExport;
if (input.schemaVersion !== CONTENT_SCHEMA_VERSION) throw new Error(`不支持的内容 Schema：${input.schemaVersion}`);
const plan = planContentImport(await exportKnowledgeBase(prisma), input);
console.log(`Import Validation: ${plan.validation.status}`);
for (const [name, count] of Object.entries(plan.summary)) console.log(`${name}: create ${count.create} · update ${count.update} · unchanged ${count.unchanged}`);
for (const issue of plan.validation.issues) console.log(`${issue.severity} ${issue.code}: ${issue.message}`);
if (plan.validation.status === "FAIL") { await prisma.$disconnect(); process.exitCode = 1; }
else if (!apply) { console.log("DRY RUN：未写入数据库。使用 --apply 明确执行导入。"); await prisma.$disconnect(); }
else { await prisma.$transaction(async (tx) => applyKnowledgeBase(tx, input), { timeout: 120_000 }); console.log("内容导入事务已提交。"); await prisma.$disconnect(); }}
void main().catch(async(error)=>{console.error(error instanceof Error?error.message:error);await prisma.$disconnect();process.exitCode=1});
