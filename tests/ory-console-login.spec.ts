import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL!;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD!;

test.describe("Ory Console Login", () => {
  test("should log in with real user credentials and display Identities page", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    await page.fill('input[name="identifier"]', TEST_USER_EMAIL);
    await page.click('button[type="submit"]');
    await page.waitForLoadState("networkidle");

    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForLoadState("networkidle");

    const identitiesHeading = page.locator('h1:has-text("Identities")');
    await expect(identitiesHeading).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/.*localhost:3000.*/);
    await expect(page.getByRole("link", { name: /log out/i })).toBeVisible();
  });

  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    const url = page.url();
    const isLoginPage = url.includes("login") || url.includes("auth");

    if (!isLoginPage) {
      await expect(page.locator('input[name="identifier"]')).toBeVisible();
    }
  });
});

test.describe("Ory Console - Authenticated State", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    const isLoggedIn = await page
      .locator('h1:has-text("Identities")')
      .isVisible()
      .catch(() => false);

    if (!isLoggedIn) {
      await page.fill('input[name="identifier"]', TEST_USER_EMAIL);
      await page.click('button[type="submit"]');
      await page.waitForLoadState("networkidle");
      await page.fill('input[name="password"]', TEST_USER_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForLoadState("networkidle");

      await expect(page.locator('h1:has-text("Identities")')).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test("should display Identities page with correct heading", async ({
    page,
  }) => {
    const heading = page.locator('h1:has-text("Identities")');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("Identities");
  });

  test("should display Identity Data section", async ({ page }) => {
    await expect(page.getByText("Identity Data")).toBeVisible();
  });
});
