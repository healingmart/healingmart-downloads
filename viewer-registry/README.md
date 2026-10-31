# HealingMart Universal Viewer — Commercial-Ready Candidate Registry

**2026-11-01 / independent research and QA environment only.**

## Current facts — never conflate these counters

| Measure | Count | Meaning |
|---|---:|---|
| Reviewed upstream engine candidates | 23 | 18 permissive, 3 conditional, 2 excluded. SPDX and sources need per-version dependency review before any shipment |
| File-extension candidates | 405 | Research targets only; multiple spellings can be a single real format |
| Existing isolated File Studio representative 3D extension passes | 8 | GLB, GLTF, OBJ, STL, FBX, PLY, 3MF, DAE; one/few sample variants each |
| Separate CAD proof-lab names | 4 | STEP/STP and IGES/IGS; 6 total sample fixtures across two underlying format families. Not yet integrated |
| Production-approved extensions | **0** | No one is allowed to interpret candidates or prototypes as production support |
| Generated original QA fixtures | 16 | 11 valid / 5 invalid; verified for structure and SHA-256, **no browser render evidence** |

## Purpose
Build a *viewer only* platform by combining reusable commercially usable open-source engines and native-browser capabilities where appropriate. Do not add converter/editor/export dependencies without product justification.

## Repository layout
- `engines.json`: upstream/license evidence, obligations, blocked status
- `formats.json`: initial candidate discovery list; explicitly **not** a working-viewer list
- `registry-gate.cjs`: fail-closed commercial-release gate, 9 adversarial self-tests
- `generate-fixtures.py`: 16 wholly original sample fixtures, including deliberately invalid/unsafe inputs
- `generated-fixtures-manifest.json`: sample origin, rights, expected outcomes and SHA-256
- `verify-fixtures.py`: independently verify generated file integrity/invalid scenarios
- `index.html`: QA dashboard, not a viewer
- `LICENSE_POLICY.md`: rights and procurement policy
- `TEST_MATRIX.md`: full test strategy, including scalability to hundreds of formats

## Run locally
```bash
node registry-gate.cjs --self-test
python generate-fixtures.py
python verify-fixtures.py
```
All scripts are manual; NO GitHub Actions deployment, cron, or integration with production site.

## Release procedure
1. Document exact upstream tag/commit, SPDX license and transitive license list, package source/SBOM, known vulnerabilities and obligations.
2. Obtain legitimate first-party/CC0/permissioned fixtures and reference program outputs, make SHA-256 ledger.
3. Add format loader to *isolated* viewer and instrument a real test adapter.
4. Test at least 3 positive + 2 negative fixtures **per format family**, as a baseline; add version/codec/feature variants and malformed files.
5. Compare actual pixels and structural properties, inspect exceptions, memory, privacy and safety.
6. Check browsers (Chrome, Edge, Firefox, Android/iOS as relevant), and large files.
7. Only when evidence and redistribution obligations are complete, mark package and format production-eligible in registry. Gate must report approval.
8. Keep existing tools.healing-mart.com, Blogger XML, Convert and workers unaffected until separate user instruction.

## Proof of concept links
- Isolated 3D viewer: https://healingmart-file-studio-lab-20261101.eternityland34.workers.dev/
- Isolated STEP/IGES proof: https://healingmart-viewer-proof-lab-20261101.eternityland34.workers.dev/
- This dashboard is separate, and DOES NOT embed or replace either viewer.

## Nonclaims
A library's GPL/LGPL/MIT headline is NOT enough to establish that its codec/WASM bundle, bundled fonts, textures or fixtures are cleared. A loader in a catalog is not proof of rendering. Any third-party test file remains under its own license.

**Do not add a candidate count (405) to marketing copy as a supported format count.**
