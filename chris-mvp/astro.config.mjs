// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// BASE_PATH lets the static build live under a sub-path (e.g. GitHub Pages /repo-name/).
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  // React only for the 3D world on the Overview (src/world/, ported from Vyomesh Iyengar's MVP).
  integrations: [react()],
});
