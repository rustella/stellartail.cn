import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const localChrome = existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  webServer: {
    command: 'npm run dev -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: localChrome ? { executablePath: localChrome } : undefined
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } } }
  ]
});
