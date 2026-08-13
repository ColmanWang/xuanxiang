import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DeterministicBaziEngine } from "@/lib/bazi/engine";
import { birthInputSchema } from "@/lib/bazi/schema";
import { CalculationError } from "@/lib/calendar/errors";

export async function POST(request: Request) {
  try {
    const input = birthInputSchema.parse(await request.json());

    if (input.includeLuckCycles === true && input.sex !== "MALE" && input.sex !== "FEMALE") {
      throw new CalculationError("MISSING_RULE_INPUT", "计算大运需要选择男或女；该字段仅用于所选传统顺逆规则。", "sex");
    }
    if (input.includeLuckCycles === true && input.timePrecision === "UNKNOWN") {
      throw new CalculationError("MISSING_RULE_INPUT", "当前起运规则需要明确的出生时间；未知时辰仍可计算前三柱。", "time");
    }

    return NextResponse.json({ chart: new DeterministicBaziEngine().calculate(input) });
  } catch (error) {
    if (error instanceof ZodError) {
      const isRuleIssue = error.issues.some(
        (issue) => issue.path[0] === "ruleSetId" || issue.path[0] === "ruleOverrides",
      );
      return NextResponse.json(
        {
          error: {
            code: isRuleIssue ? "INVALID_RULE_OVERRIDE" : "INVALID_DATE",
            message: "输入信息不完整或格式不正确。",
            issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
          },
        },
        { status: 400 },
      );
    }
    if (error instanceof CalculationError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message, field: error.field, details: error.details } },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { error: { code: "PROVIDER_MISMATCH", message: "排盘计算未能完成，请稍后重试。" } },
      { status: 422 },
    );
  }
}
