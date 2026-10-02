const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3999',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx serve . -l 3999 --no-clipboard',
    port: 3999,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
