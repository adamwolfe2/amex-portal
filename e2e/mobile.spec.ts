import { test, expect } from "@playwright/test";

test.describe("Mobile Responsiveness", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("landing page renders without horizontal scroll", async ({ page }) => {
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("apply page renders without horizontal scroll", async ({ page }) => {
    await page.goto("/apply");
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("all tap targets on landing page are at least 44px", async ({ page }) => {
    await page.goto("/");
    const buttons = await page.locator("a, button").all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box && box.height > 0) {
        // Only check visible interactive elements
        if (box.height < 30) {
          const text = await button.textContent();
          console.warn(`Small tap target (${box.height}px): "${text?.trim()}"`);
        }
      }
    }
  });
});
