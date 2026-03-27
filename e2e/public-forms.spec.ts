import { test, expect } from "@playwright/test";

test.describe("Public Forms", () => {
  test("ambassador application page loads", async ({ page }) => {
    await page.goto("/apply");
    await expect(page.locator("h1")).toContainText("Ambassador");
    // Check form fields exist
    await expect(page.locator("input[type='text']").first()).toBeVisible();
    await expect(page.locator("input[type='email']")).toBeVisible();
  });

  test("feedback page loads", async ({ page }) => {
    await page.goto("/feedback");
    await expect(page.locator("h1")).toContainText("Feedback");
    await expect(page.locator("input[type='email']")).toBeVisible();
  });
});
