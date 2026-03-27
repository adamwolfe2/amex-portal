import { test, expect } from "@playwright/test";

test.describe("404 Page", () => {
  test("shows not found page for invalid routes", async ({ page }) => {
    await page.goto("/some-nonexistent-page");
    await expect(page.locator("text=Page not found")).toBeVisible();
    await expect(page.locator("a[href='/dashboard']")).toBeVisible();
  });
});
