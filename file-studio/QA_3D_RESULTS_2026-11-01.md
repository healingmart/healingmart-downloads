# HealingMart File Studio 3D QA — 2026-11-01

## Scope
Isolated Cloudflare Worker `healingmart-file-studio-lab-20261101`.
This branch is separate from main. No tools.healing-mart.com menu, Blogger XML, custom domain, or production converter was changed.

## Live preview
- App: https://healingmart-file-studio-lab-20261101.eternityland34.workers.dev/
- Per-format samples: https://healingmart-file-studio-lab-20261101.eternityland34.workers.dev/qa/
- ZIP samples: https://healingmart-file-studio-lab-20261101.eternityland34.workers.dev/qa/HealingMart_3D_Test_Files.zip

## Real browser integration test results
Windows Chrome, Windows Edge (headless) on authorized Windows desktop.
- GLB sample geometry: PASS
- GLTF with embedded buffer: PASS
- GLTF with external .bin: PASS
- OBJ with MTL and PNG texture: PASS
- STL ASCII: PASS
- PLY ASCII: PASS
- FBX ASCII v7.4 mesh: PASS (first invalid fixture failed; a correctly indented original FBX fixture was rebuilt and passed)
- 3MF zipped model: PASS
- DAE Collada 1.4: PASS
- Total: 9 / 9 scenarios in each of two browsers (Chrome and Edge; both use the Chromium engine).
Assertions: WebGL canvas exists, toolbar exists, rendered PNG contains model pixels not just solid background, mouse drag and zoom events, grid toggle, camera fit, and PNG capture downloads.
- Emulated 390px mobile viewport: 3D model visible; no horizontal page overflow.

## Live URL and regression checks
- 14 sample assets / index files: HTTP 200; SHA-256 hashes match uploaded originals.
- Existing image operations: rotate -> convert PNG to WebP -> batch rename -> ZIP -> decoded ZIP contains valid RIFF/WEBP file.
- Main preview, samples and standalone ZIP publicly served on Cloudflare workers.dev with noindex policy.

## Limitations
- This is representative fixture coverage, not validation of every FBX/DAE/3MF vendor variant or every GLTF extension.
- Draco / meshopt / KTX2, encrypted or damaged archives, CAD formats (STEP/IGES), BLEND, USDZ and point cloud formats other than PLY are not supported or not in test scope.
- 3D renderer uses lazy-loaded Three.js 0.180.0 browser modules via jsDelivr; network access is required on first 3D load. Does not bundle a heavy AI model.
- Physical iOS/Android devices and large (>250 MB) 3D datasets have not been tested. Avoid claiming guaranteed mobile support or full file compatibility.
