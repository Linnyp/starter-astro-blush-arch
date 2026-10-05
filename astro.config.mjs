// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: set to the client's production domain (sitemap + canonical URLs depend on it)
  site: process.env.SITE_URL ?? 'https://example.com',
  output: 'static',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // Self-hosted at build time, latin subset only, metric-matched fallbacks generated
  // automatically. Three families, no more (style guide §4.1).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Raleway',
      cssVariable: '--font-raleway',
      weights: ['300 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Nixie One',
      cssVariable: '--font-nixie-one',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Qwitcher Grypen',
      cssVariable: '--font-qwitcher-grypen',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
    },
  ],
});
