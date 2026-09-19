import "dotenv/config";
import { exportKnowledgeBase } from "@/lib/content/database";
import { validateKnowledgeBase } from "@/lib/content/validation";
import { prisma } from "@/lib/prisma";

async function main(){const report = validateKnowledgeBase(await exportKnowledgeBase(prisma));
const errors = report.issues.filter((issue) => issue.severity === "ERROR");
const warnings = report.issues.filter((issue) => issue.severity === "WARNING");
console.log(`Content Validation: ${report.status}`);
console.log(`Errors: ${errors.length} · Warnings: ${warnings.length}`);
for (const issue of report.issues) console.log(`${issue.severity} ${issue.code}${issue.entityId ? ` [${issue.entityId}]` : ""}: ${issue.message}`);
await prisma.$disconnect();
if (report.status === "FAIL") process.exitCode = 1;}
void main().catch(async(error)=>{console.error(error instanceof Error?error.message:error);await prisma.$disconnect();process.exitCode=1});
