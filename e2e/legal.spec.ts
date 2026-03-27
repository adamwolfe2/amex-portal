import { test, expect } from "@playwright/test";

test.describe("Legal Pages", () => {
  test("terms of service page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("h1")).toContainText("Terms of Service");
  });

  test("privacy policy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toContainText("Privacy Policy");
  });

  test("refund policy page loads", async ({ page }) => {
    await page.goto("/refunds");
    await expect(page.locator("h1")).toContainText("Refund Policy");
  });
});
