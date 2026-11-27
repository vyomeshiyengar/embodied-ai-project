import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4322',
    // Code models in the 3D twin, so CI's software renderer stays fast; tests/twin.spec.ts clears this
    // flag where it checks the realistic models.
    storageState: { cookies: [], origins: [{ origin: 'http://localhost:4322', localStorage: [{ name: 'eacp-codemodels', value: '1' }] }] },
    launchOptions: { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  webServer: { command: 'node scripts/serve.mjs 4322', port: 4322, reuseExistingServer: true, timeout: 30_000 },
});
