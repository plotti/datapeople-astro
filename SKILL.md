---
name: datapeople-astro
description: "Use when working with the datapeople-astro Astro blog project."
version: 1.0.0
author: Datapeople
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [astro, blog, deployment, web]
---

# Datapeople Astro Blog

Use when working with the datapeople-astro Astro blog project.

## Project Overview

- **Framework:** Astro 6.x with React
- **Deployment:** Cloudflare Pages, automatisch bei Push auf `main`
- **Production URL:** https://www.datapeople.ch
- **Node version:** >=22.12.0
- **Blog location:** `src/content/blog/`
- **Assets:** `src/assets/blog/`

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Publish (automatic deploy on push — nothing else needed)
git push origin main

# Verify deployment (production domain, NOT pages.dev)
curl -s -o /dev/null -w "%{http_code}" https://www.datapeople.ch/blog/<post-slug>/
```

## Blog Post Structure

Frontmatter required:
```yaml
---
title: "Post Title"
description: "Post description/summary"
pubDate: YYYY-MM-DD
readTime: N
category: "Category"
tags: ["tag1", "tag2", "tag3"]
cover: "../../assets/blog/image.png"
---
```

Content format for syndicated posts:
```markdown
**Stand:** Month Year · **Autor:** Author Name · **Lesedauer:** ca. N Minuten

[Post content...]

*Originally published at [original-title](https://example.com/slug)*
```

## Deployment Workflow

- **Trigger:** Push to `main` branch — Cloudflare baut und deployt automatisch. Kein manueller Schritt nötig.
- **Production:** https://www.datapeople.ch
- **Deploy-Status prüfen:** Post-URL auf der Produktionsdomain aufrufen (erwarteter Titel/Inhalt), z. B.:
```bash
curl -s https://www.datapeople.ch/blog/<post-slug>/ | grep "<title>"
```

Wichtig:
- **Nicht** `datapeople-astro.pages.dev` zur Verifikation nutzen — diese Domain ist veraltet und spiegelt nicht den Produktionsstand.
- `.github/workflows/deploy.yml` (GitHub Actions + wrangler) ist der alte Weg und aktuell deaktiviert. Deploys laufen über die Cloudflare-eigene Git-Integration, nicht über GitHub Actions. `gh run list` sagt also nichts über den Deploy-Status.

## Common Issues

### Node version mismatch
If you see "Node.js v18.17.1 is not supported", upgrade Node:
```bash
nvm install 22
nvm use 22
```

### Build fails
Check frontmatter syntax and required fields. All markdown files in `src/content/blog/` must have valid frontmatter.

## Syndicating New Posts

Use the `blog-syndication` skill for full workflow. Quick reference:

1. Extract source pages:
```bash
web_extract(["https://bridgebinary.ch/blog/"])
web_extract(["https://thomassie.me/"])
```

2. Compare with existing:
```bash
search_files("*.md", target="files", path="./src/content/blog")
```

3. Create new file with proper format
4. Commit and push:
```bash
git add src/content/blog/
git commit -m "feat: syndicate new blog posts"
git push origin main
```

## Related Skills

- `blog-syndication`: For monitoring and syndicating posts from external sources