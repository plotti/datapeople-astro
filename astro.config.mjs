// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Serie „Agenten 2026“ auf einen Monat verteilt: alte Adressen der schon veröffentlichten Posts
  redirects: {
    '/blog/2026-10-25-bewerbungs-agent-n8n': '/blog/2026-09-29-bewerbungs-agent-n8n/',
    '/blog/2026-10-27-n8n-vs-activepieces': '/blog/2026-10-06-n8n-vs-activepieces/',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  markdown: {
    gfm: true,
  },
});