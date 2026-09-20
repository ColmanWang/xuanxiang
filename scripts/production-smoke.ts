type CheckResult = { name: string; ok: boolean; detail: string };

const BAZI_FIXTURE = { calendarType: "GREGORIAN", date: { year: 2024, month: 2, day: 10 }, time: { hour: 8, minute: 30 }, timezone: "Asia/Shanghai", timePrecision: "MINUTE", ruleSetId: "STANDARD_ZIPING" };
const LIUYAO_FIXTURE = { method: "MANUAL_LINE_VALUES", lineOrder: "BOTTOM_TO_TOP", lines: [7, 8, 9, 7, 6, 8], divinationTime: { localDateTime: "2026-08-19T14:30", timezone: "Asia/Shanghai" }, question: "固定只读 smoke fixture" };

function targetUrl() {
  const index = process.argv.indexOf("--url");
  const value = index >= 0 ? process.argv[index + 1] : process.env.SMOKE_BASE_URL;
  if (!value) throw new Error("Provide --url <staging-or-production-url>.");
  const url = new URL(value);
  if (!/^https?:$/.test(url.protocol)) throw new Error("Smoke URL must use HTTP or HTTPS.");
  return url;
}

async function request(base: URL, pathname: string, init?: RequestInit) {
  return fetch(new URL(pathname, base), { ...init, redirect: "error", signal: AbortSignal.timeout(15_000) });
}

async function run(name: string, action: () => Promise<string>): Promise<CheckResult> {
  try { return { name, ok: true, detail: await action() }; }
  catch (error) { return { name, ok: false, detail: error instanceof Error ? error.message : "unknown error" }; }
}

async function expectOk(response: Response) {
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return `HTTP ${response.status}`;
}

export async function productionSmoke(base: URL, includeAi = false) {
  const results = await Promise.all([
    ...["/", "/knowledge", "/classics", "/api/health"].map((pathname) => run(`GET ${pathname}`, async () => expectOk(await request(base, pathname)))),
    run("GET /api/search", async () => {
      const response = await request(base, "/api/search?q=%E7%8E%84");
      await expectOk(response);
      if (!Array.isArray(await response.json())) throw new Error("Expected a JSON array.");
      return "read-only search returned JSON";
    }),
    run("POST deterministic Bazi fixture", async () => {
      const response = await request(base, "/api/tools/bazi/calculate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(BAZI_FIXTURE) });
      await expectOk(response);
      const body = await response.json() as { chart?: { calculationFingerprint?: string } };
      if (!body.chart?.calculationFingerprint?.startsWith("xx-bazi-")) throw new Error("Missing deterministic Bazi fingerprint.");
      return body.chart.calculationFingerprint;
    }),
    run("POST deterministic Liuyao fixture", async () => {
      const response = await request(base, "/api/tools/liuyao/calculate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(LIUYAO_FIXTURE) });
      await expectOk(response);
      const body = await response.json() as { chart?: { fingerprint?: string; primaryHexagram?: { name?: string }; changedHexagram?: { name?: string } } };
      if (!body.chart?.fingerprint?.startsWith("xx-liuyao-") || body.chart.primaryHexagram?.name !== "丰" || body.chart.changedHexagram?.name !== "随") throw new Error("Liuyao fixture result changed.");
      return body.chart.fingerprint;
    }),
    ...(includeAi ? [run("POST grounded Ask fixture", async () => {
      const response = await request(base, "/api/ai/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "KNOWLEDGE", message: "请依据知识库简述玄这一概念，并给出引文。" }) });
      await expectOk(response);
      const body = await response.json() as { citations?: unknown[] };
      if (!body.citations?.length) throw new Error("AI is enabled but returned no grounded citation.");
      return `${body.citations.length} citation(s)`;
    })] : []),
  ]);
  return results;
}

async function main() {
  const base = targetUrl();
  const results = await productionSmoke(base, process.argv.includes("--include-ai"));
  for (const result of results) console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}: ${result.detail}`);
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("production-smoke.ts")) void main().catch((error) => { console.error(`Production smoke: BLOCKED (${error instanceof Error ? error.message : "unknown error"})`); process.exitCode = 1; });
