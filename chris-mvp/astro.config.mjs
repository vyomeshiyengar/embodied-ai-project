// @ts-check
import { defineConfig } from 'astro/config';

// BASE_PATH lets the static build live under a sub-path (e.g. GitHub Pages /repo-name/).
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
