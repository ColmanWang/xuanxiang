import "dotenv/config";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { exportKnowledgeBase } from "@/lib/content/database";
import { createContentSnapshotManifest, serializeContentExport } from "@/lib/content/export";
import { prisma } from "@/lib/prisma";

async function main(){const outIndex = process.argv.indexOf("--out");
if (outIndex < 0 || !process.argv[outIndex + 1]) throw new Error("请使用 --out 指定导出文件");
const outputPath = resolve(process.argv[outIndex + 1]);
const content = await exportKnowledgeBase(prisma);
const manifest = createContentSnapshotManifest(content);
await writeFile(outputPath, serializeContentExport(content), "utf8");
await writeFile(`${outputPath}.manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`已导出：${outputPath}`);
console.log(`Entities ${manifest.counts.entities} · Relations ${manifest.counts.relations} · Citations ${manifest.counts.citations} · Passages ${manifest.counts.passages}`);
console.log(manifest.checksum);
await prisma.$disconnect();}
void main().catch(async(error)=>{console.error(error instanceof Error?error.message:error);await prisma.$disconnect();process.exitCode=1});
