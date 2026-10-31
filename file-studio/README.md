# HealingMart File Studio — isolated preview (2026-11-01)

This preview is intentionally isolated from the production tools.healing-mart.com Blogger site.

## Source
- `index.html`: local-first image batch operations, rename, ZIP archive tools, Tools-HM-style shell.
- `sw.js`: minimal same-origin caching for app shell, provided only when deployed on HTTPS.
- `_headers` and `robots.txt`: noindex preview restrictions.

## Isolation
- GitHub branch: `file-studio-preview-20261101` (not main).
- Cloudflare Worker: `healingmart-file-studio-lab-20261101` (new unique test worker).
- No Blogger XML modifications, no production menu links, no custom routes/domains, no cron triggers.
- `tools.healing-mart.com`, `healingmart-webtools-cloudflare`, `healingmart-convert-platform-cloudflare` remain unchanged.

## Caveats
- The shell is a standalone emulation of the Tools-HM layout, not yet the site module connector.
- RAR/7z support and cross-app file handoff are future tasks.
- Use browser memory limits carefully for larger ZIP/files.
- Validate packaging & features before any production integration.
