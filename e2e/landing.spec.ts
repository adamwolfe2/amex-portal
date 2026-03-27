import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("renders hero section with correct content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Stop leaving money on the table");
    await expect(page.locator("text=Get Started")).toBeVisible();
    await expect(page.locator("text=Sign in")).toBeVisible();
  });

  test("pricing section shows correct prices", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=$10")).toBeVisible();
    await expect(page.locator("text=$50")).toBeVisible();
    await expect(page.locator("text=$150")).toBeVisible();
  });

  test("FAQ section toggles correctly", async ({ page }) => {
    await page.goto("/");
    const faq = page.locator("text=What is CreditOS?");
    await faq.click();
    // Check that the answer is visible after clicking
    await expect(page.locator("text=helps you track")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    // Get Started should link to sign-up
    const getStarted = page.locator("a", { hasText: "Get Started" }).first();
    await expect(getStarted).toHaveAttribute("href", "/sign-up");
  });

  test("footer links exist", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("a[href='/terms']")).toBeVisible();
    await expect(page.locator("a[href='/privacy']")).toBeVisible();
    await expect(page.locator("a[href='/refunds']")).toBeVisible();
  });

  test("no horizontal scroll on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const body = page.locator("body");
    const scrollWidth = await body.evaluate((el) => el.scrollWidth);
    const clientWidth = await body.evaluate((el) => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
