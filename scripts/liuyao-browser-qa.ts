import { chromium } from "@playwright/test";

interface QaResult {
  name: string;
  url: string;
  ok: boolean;
  details: Record<string, boolean | string | string[]>;
}

const baseUrl = process.env.QA_BASE_URL ?? "http://localhost:3000";
const forbiddenCopy = ["一卦知吉凶", "在线算卦", "问事预测", "大师"];

function hasForbiddenCopy(text: string) {
  return forbiddenCopy.some((item) => text.includes(item));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results: QaResult[] = [];

  async function checkPage(name: string, path: string, viewport: { width: number; height: number }) {
    const page = await browser.newPage({ viewport });
    const consoleIssues: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") consoleIssues.push(`${message.type()}: ${message.text()}`);
    });
    page.on("pageerror", (error) => consoleIssues.push(`pageerror: ${error.message}`));

    const url = `${baseUrl}${path}`;
    await page.goto(url, { waitUntil: "networkidle" });
    const bodyText = await page.locator("body").innerText();
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    const ok = bodyText.includes("六爻") && !hasForbiddenCopy(bodyText) && consoleIssues.length === 0 && !horizontalOverflow;
    results.push({
      name,
      url,
      ok,
      details: {
        hasLiuyao: bodyText.includes("六爻"),
        hasForbiddenCopy: hasForbiddenCopy(bodyText),
        horizontalOverflow,
        consoleIssues,
      },
    });
    await page.close();
  }

  await checkPage("desktop tools", "/tools", { width: 1440, height: 1000 });
  await checkPage("desktop liuyao", "/tools/liuyao", { width: 1440, height: 1000 });
  await checkPage("desktop technique liuyao", "/techniques/liuyao", { width: 1440, height: 1000 });
  await checkPage("desktop verification liuyao", "/dev/verification/liuyao", { width: 1440, height: 1000 });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobileIssues: string[] = [];
  mobile.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") mobileIssues.push(`${message.type()}: ${message.text()}`);
  });
  mobile.on("pageerror", (error) => mobileIssues.push(`pageerror: ${error.message}`));
  await mobile.goto(`${baseUrl}/tools/liuyao`, { waitUntil: "networkidle" });
  await mobile.getByRole("button", { name: /开始推演/ }).click();
  await mobile.waitForTimeout(1000);
  const mobileText = await mobile.locator("body").innerText();
  const mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  results.push({
    name: "mobile liuyao submit",
    url: `${baseUrl}/tools/liuyao`,
    ok: mobileText.includes("六爻卦盘") && mobileText.includes("本卦") && mobileText.includes("变卦") && mobileIssues.length === 0 && !mobileOverflow,
    details: {
      hasChart: mobileText.includes("六爻卦盘"),
      hasPrimary: mobileText.includes("本卦"),
      hasChanged: mobileText.includes("变卦"),
      horizontalOverflow: mobileOverflow,
      consoleIssues: mobileIssues,
    },
  });
  await mobile.close();

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

void main();
