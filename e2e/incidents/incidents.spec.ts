import { test, expect } from "@playwright/test";

test.describe("Incidents", () => {
  test.describe("Viewing incidents", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/incidents");
      await expect(page.getByTestId("incident-table")).toBeVisible();
    });

    test("opens incident details drawer from the table", async ({ page }) => {
      // click first row
      await page.locator(".ant-table-tbody tr").first().click();

      // drawer opens
      await expect(page.getByTestId("incident-detail-drawer")).toBeVisible();
      await expect(page.getByText(/incident details/i)).toBeVisible();
    });
  });

  test.describe("Creating incidents", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/incidents");
      await expect(page.getByTestId("incident-table")).toBeVisible();
    });

    test("creates a new incident and shows its details", async ({ page }) => {
      await page.getByTestId("create-incident-button").click();
      await expect(page.getByRole("dialog")).toBeVisible();

      await page
        .getByTestId("create-incident-title")
        .fill("E2E created incident");

      await page
        .getByTestId("create-incident-description")
        .fill("This incident was created by an e2e test.");

      await page.getByTestId("create-incident-submit").click();

      const drawer = page.getByTestId("incident-detail-drawer");
      await expect(drawer).toBeVisible();
      await expect(drawer.getByText("E2E created incident")).toBeVisible();
    });
  });
});
