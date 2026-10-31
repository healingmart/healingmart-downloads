# HealingMart Viewer Proof Lab — 2026-11-01

**Independent verification bench; NOT production integration.**

## Live proof
https://healingmart-viewer-proof-lab-20261101.eternityland34.workers.dev/

The viewer reads STEP/STP/IGES/IGS with **occt-import-js 0.0.23 (LGPL-2.1)**, triangulates the imported CAD B-Rep, and renders an actual three.js/WebGL 3D scene.

### Current proof
- Six real CAD fixtures: 5 STEP + 1 IGES.
- Standalone Node geometric parsing: **6/6 pass**.
- Local Chrome WebGL rendering: **6/6 pass**.
- Deployed Cloudflare test page Chrome: **6/6 pass**.
- Deployed Cloudflare test page Edge: **6/6 pass**.
- Known dimensional checks: block 40×30×20 mm; cylinder diameter 20mm and height 30mm; inch block 25.4×50.8×76.2mm; open surface 20×30×0mm. Dimensions within 0.25mm of expected values.
- Render smoke tests: canvas shows actual non-background model pixels and recovered mesh count.
- Assembly: 2 meshes; IGES: 1 mesh, 12 triangles.
- Test browser exceptions: none.
- **This establishes specific representative CAD fixtures, not universal STEP/IGES vendor compatibility.**
- **The main File Studio test Worker and tools.healing-mart.com are unchanged.**

### Reproduce
1. `npm install occt-import-js@0.0.23` for Node import test.
2. Download source CC0 STEP fixtures from https://www.cadprops.com/examples/ (name them as listed in `sample-manifest.json`). IGES sample can be downloaded from the same page but is not redistributed by this repository.
3. Run `node prove_cad.cjs`, from the directory holding the files; compare `qa-cad-results.json`. 
4. For browser test use Chrome/Edge + Playwright. Serve the `index.html`, five STEP files, and upstream `occt-import-js.js/.wasm` at the specified `node_modules/occt-import-js/dist` URL. A web server is necessary; do not use file:// directly.
5. The live proof page already includes CC0 sample buttons. To test IGES, download the source file separately and upload into the page.
6. Verify OpenCascade and occt-import-js license notices before redistributing the WASM.

### Source and rights
- STEP sample provenance and their CC0 grant: https://www.cadprops.com/examples/
- IGES sample original: https://www.cadprops.com/samples/box.iges (external link only; licensing must be reviewed before redistribution).
- occt-import-js source: https://github.com/kovacsv/occt-import-js, LGPL-2.1
- three.js source: https://github.com/mrdoob/three.js, MIT
- Deployment includes library license texts.

### Future acceptance bar
One fixture only => proof-of-concept, NOT 'full support'. For each format use at least 3 correct variants, 2 invalid/edge cases, reference renderer comparison, browser matrix and memory/performance checks, with SHA-256 and original evidence. Then upgrade the public support label.
