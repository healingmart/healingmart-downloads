# Commercialization, redistribution and provenance policy

This policy is intentionally stricter than simply finding source code on GitHub.

## Engine gate
- Eligible to evaluate: MIT, ISC, BSD-2/3, Apache-2.0. Keep exact upstream release and source license text; preserve attribution/NOTICE and modifications.
- Conditional: MPL-2.0, LGPL and similar. Commercial use may be allowed, but distribution/source availability and replaceability obligations must be proven and reviewed first. A commercial SaaS launch is a separate review decision from sharing JS/WASM with browser clients.
- Hold/exclude: unknown/no license, non-commercial-only, proprietary SDK requiring paid contract, trial-only, incompatible copyleft (e.g. GPL/AGPL without an explicit compliant distribution plan).
- FFmpeg.wasm wrapper can be MIT while core/codec licensing differs; review the **exact shipped WASM binary**, its flags and dependency/source chain, not the wrapper's license alone.
- OCCT/occt-import-js licensing has LGPL-2.1 and OCCT exception requirements; include end-user notices/source offer as applicable. KEEP IN CONDITIONAL STATUS until legal/technical obligations verified.
- IFC web-ifc MPL-2.0 is **file-level copyleft**, not the same as MIT; ship notice and covered-source access if obligations apply. KEEP IN CONDITIONAL STATUS.
- If license changes after update, freeze version and re-review. Never dynamically load `latest` release from CDN in production.

## Data and asset gate
**Separate the rights for 1) decoder, 2) test content, 3) font/texture/shader, 4) output/thumbnail.**
- Original generated fixtures: safe to redistribute after checking no copyrighted source incorporated.
- Third-party assets: require explicit right to redistribute (e.g. CC0, permissive with conditions, license grant). CC BY requires author/source attribution. CC BY-NC excludes commercial uses. CC BY-ND may prohibit modified/derived publishing. Do not mirror ambiguous samples.
- A site being public does not grant redistribution or bulk scraping rights.
- For user-uploaded files: process locally where possible; never retain, upload or log contents without explicit user consent. No automatic public thumbnails or dataset reuse.
- No trademark use beyond accurate nominative descriptions.

## Product security before release
- Detect actual magic/container structure; do not trust extension or MIME alone.
- Sandboxed/isolated parsers; never execute scripts from SVG, HTML, PDF attachments, Office macros, model scripts or archive paths.
- Reject ZIP Slip, decompression bomb, nested recursion, sparse files, path collisions and external URL/file references where unsafe.
- Bound maximum input bytes, total decompressed bytes, files count, dimensions, polygons, texture memory, decode/render timeout and worker memory.
- Sanitized text/HTML; no `innerHTML` with untrusted file content, markdown requires sanitizer.
- Deterministic version pin + dependency SBOM + vulnerability checks (OpenSSF/OSV etc). Failing vulnerability checks block release.
- Browsers use WebGL/WebGPU at user's own risk; don't upload files as fallback.

## Required evidence for every shipped loader
Upstream URL and LICENSE at pinned version, package/hash, SBOM, third-party notices, source availability where required, at least 3 legal positive and 2 negative samples with SHA-256, reference rendering comparisons, screenshots, runtime/timeout/memory/bug logs, reproducible tests and signed-off owner approval.

## References
- MIT Three.js: https://github.com/mrdoob/three.js
- Apache-2.0 PDF.js: https://github.com/mozilla/pdf.js/blob/master/LICENSE
- BSD libarchive mixed source notices: https://raw.githubusercontent.com/libarchive/libarchive/master/COPYING
- Apache-2.0 SheetJS CE: https://docs.sheetjs.com/docs/miscellany/license/
- MPL 2.0 web-ifc: https://github.com/ThatOpen/engine_web-ifc/blob/main/LICENSE.md
- LGPL OCCT with exception: https://occt3d.com/dev/doc/overview/html/index.html
- MIT wrapper vs FFmpeg core: https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/website/docs/faq.md
- Paid ODA exclusion: https://www.opendesign.com/pricing
- Handsontable commercial terms: https://github.com/handsontable/handsontable
- Dependency license detection: https://google.github.io/osv-scanner/usage/license-scanning/

This is an operational screening policy, not a legal opinion or claim that all dependencies are already cleared.
