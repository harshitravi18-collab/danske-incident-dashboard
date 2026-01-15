import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "src/e2e",
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
