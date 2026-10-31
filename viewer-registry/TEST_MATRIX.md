# Viewer QA matrix for hundreds of file types

## Priorities
Use **format families and real feature variants**, not extension-count marketing:
- Level A: file magic, safe parsing, meaningful visible data, 3+ positive / 2+ negative fixtures, source license.
- Level B: complex variants (version, compression, encryption, external textures, fonts, animation, layers, archives inside archives), fidelity vs independent reference, browser performance.
- Level C: browser/device matrix, memory and malformed-input fuzz, regression, SBOM, notices, zero uploads.

## Test dimensions
| Kind | Positive assertions | Negative assertions |
|---|---|---|
| 3D | actual mesh count / finite bounds / textures / animations / camera controls / reference screenshot | invalid vertices, zero-sized mesh, missing texture, too many polygons, unsupported compression |
| CAD/BIM | B-Rep/mesh extents, units (mm/inch), components, layers, hierarchy vs FreeCAD/OCCT | malformed STEP entities, incorrect units, too many faces, missing parts |
| PDF/Office | page count, text, fonts, images, charts, layers, page-to-page rendering | password/macros, embedded scripts, malformed ZIP, missing fonts |
| Raster/medical | width/height, alpha, ICC, frames, color fidelity, pixel hash / DICOM metadata and anonymization | malformed header, image bombs, PHI leakage, unsupported codec |
| Audio/video | actual decoding, duration, sample rate, seek, tracks, reference frame/audio spectral fidelity | unsupported codecs, corrupt media, enormous frame, stalled decode, seek invalid |
| Archive | list + CRC + actual extraction + nested previews, memory caps | path traversal, encrypted without password, zip bombs, recursive nested payloads |
| Text/data | encoding, records, row counts, escaped HTML, line numbering, search | CSV formula injection when exported, active SVG/HTML, malformed JSON/XML, XXE |

## Scale
- 405 candidate extension labels in registry ≠ 405 file decoders.
- Baseline if testing every extension independently: `405 × (3 positives + 2 negatives) = 2,025 fixture cases`. Only a planning upper bound; reuse format-family fixtures where appropriate.
- Normal smoke: 1 representative positive per verified family, Chrome desktop.
- Release/regression: 3+ positives, 2+ negatives, complex variants, Chrome+Edge+Firefox, Android+ iOS browser in physical devices where applicable; source/rights review again.
- Periodic deeper tests: huge files, 1000 nested entries, 10x texture memory, cross-browser rendering parity. Never load them into a user-facing main thread unrestricted.

## Test records
Required fields: engine ID/tag + artifact sha256; fixture id/category/format + sha256 + license proof; expected and actual data; reference file/source and rights; screenshot/checksum; memory/CPU/time/browser/device; pass/partial/failed/restricted; failure reason; test code commit SHA.
- Store raw fixture only if rights cleared.
- `generated-fixtures-manifest.json` proves that fixtures were generated, not that any viewer renders them.
- A renderer test must be executed with a real browser and a real loader. The registry gate is a **release-preflight metadata checker**, not a substitute for rendering QA.
- Test URL must not be publicly described as a production tool before all gates pass.

## Non-negotiable ship gate
`node registry-gate.cjs --self-test` must exit 0. A *green gate* means the metadata is internally consistent; it does not turn an untested candidate into a supported viewer.
Project owner must sign the downstream license/notice/source and live browser record before changing `release_allowed` / `commercial_production_approved`.
