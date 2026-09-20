import { expect, test } from "@playwright/test";

test.describe("public read-only launch paths", () => {
  for (const [path, heading] of [["/", "玄象"], ["/knowledge", "知识"], ["/classics", "典籍"], ["/tools/bazi", "四柱"], ["/tools/liuyao", "六爻"]] as const) {
    test(`${path} is available`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole("heading", { name: new RegExp(heading) }).first()).toBeVisible();
    });
  }

  test("search does not require a write", async ({ page }) => {
    await page.goto("/search?q=%E7%8E%84");
    await expect(page.locator("main")).toBeVisible();
  });
});
