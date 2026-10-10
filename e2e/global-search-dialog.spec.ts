import { expect, test } from "@playwright/test";

test("global search covers the viewport outside the blurred header", async ({ page }) => {
  await page.route("**/api/search?**", route => route.fulfill({ json: [{ id: "fixture", type: "concept", title: "五行", summary: "搜索回归 fixture", href: "/knowledge", match: "direct" }] }));
  await page.goto("/tools/liuyao");
  const trigger = page.getByRole("button", { name: "打开全局搜索" });
  await trigger.filter({ visible: true }).first().click();
  const dialog = page.getByRole("dialog", { name: "全局搜索" });
  await expect(dialog).toBeVisible();
  await expect.poll(async () => dialog.evaluate(el => el.parentElement === document.body)).toBe(true);
  const box = await dialog.boundingBox();
  expect(box?.x).toBe(0); expect(box?.y).toBe(0);
  expect(box?.width).toBe(page.viewportSize()?.width);
  expect(box?.height).toBe(page.viewportSize()?.height);
  await page.getByPlaceholder("搜索知识实体或原典文句").fill("五行");
  await expect(dialog.getByRole("link", { name: /五行/ })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 300));
  expect((await dialog.boundingBox())?.y).toBe(0);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await trigger.filter({ visible: true }).first().click();
  await page.getByRole("button", { name: "关闭搜索" }).click();
  await expect(dialog).toHaveCount(0);
  await trigger.filter({ visible: true }).first().click();
  await dialog.getByRole("link", { name: "打开完整搜索页" }).click();
  await expect(page).toHaveURL(/\/search\?q=/);
  await expect(dialog).toHaveCount(0);
});
