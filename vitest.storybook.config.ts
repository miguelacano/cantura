import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import path from "path";

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(__dirname, ".storybook"),
      storybookScript: "pnpm storybook --no-open",
    }),
  ],
  test: {
    name: "storybook",
    globals: true,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: "chromium" }],
    },
    setupFiles: ["./.storybook/vitest.setup.ts"],
  },
});
