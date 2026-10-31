# Evidence-based sample source catalog

*2026-11-01. All sources are leads; their presence here does not mean the File Studio supports the file type.*

| Group | Candidate formats | Primary sample or spec source | How to establish evidence | Redistribution |
|---|---|---|---|---|
| CAD B-Rep | STEP, STP, IGES, IGS | https://www.cadprops.com/examples/ | OCCT parse, dimension and face count, 3D render, FreeCAD/OCCT reference | Specific CADProps-generated STEP examples explicitly CC0; check every other file separately |
| General 3D | GLB, GLTF + extensions | https://github.com/KhronosGroup/glTF-Sample-Assets | glTF Validator, Khronos reference viewer, texture/skin/animation comparison | Each model's own license; some CC0, some CC BY, others more restrictive |
| Model/CAD samples | FCStd, STL, OBJ, STEP via export | https://github.com/FreeCAD/Examples | FreeCAD reference display, export known geometry and compare | File-by-file permission review |
| Three.js-specific 3D | 3DS, AMF, BVH, GCODE, PCD, XYZ, VTK, USDZ, VOX, VRML, 3DM | https://threejs.org/examples/ | Loader-specific real fixture, geometry type, control/UI and pixels | Each sample asset license independently |
| BIM | IFC2x3, IFC4, IFC4.3 | https://github.com/buildingSMART/IFC4.x-specification-models | Schema validation + IFC reference display, object counts and geometry | Model repository includes CC BY-ND 4.0 details: review before mirroring/derivative distribution |
| BIM regressions | IFC | https://github.com/IfcOpenShell/files | Known bug/edge cases, regression tracking, IFC geometry verification | Rights must be assessed per file |
| Video / audio | MP4, MOV, MKV, WebM, AVI, MP3, WAV, FLAC, etc. | https://ffmpeg.org/fate.html | Decode frames/audio, duration, stream counts, seek & checksums | The FATE suite is for testing, not a blanket redistribution license |
| Archives | ZIP, TAR, 7Z, RAR, CAB, CPIO, ISO, XAR, LZH etc. | https://github.com/libarchive/libarchive/wiki/LibarchiveAddingTest | actual inner-file extraction, checksums, encrypted/path traversal tests | Check repository and test-file licenses |
| Image | PNG, JPEG, WebP, AVIF, TIFF, BMP, GIF, SVG, HEIC | Generate original geometric patterns with known alpha, metadata, ICC profile, animation frames | Exact pixel comparison where lossless, tolerance-based for lossy, frame count | Prefer wholly owned generator files |

## Counting and evidence rules
- Different file extensions that use the same decoder (STEP/STP, IGES/IGS) should not artificially inflate the independently verified *format-family* count.
- Do not count a registry entry or a loader class as a working viewer.
- Archive listing is not the same as previewing its contents.
- Each format has 3 positive samples (synthetic / representative / complex) and 2 negatives (invalid / missing dependency) as a starting minimum.
- Store SHA-256, origin URL, license status, expected dimensions/frame/page counts, actual browser screenshots, parser logs, edge-case results, test code commit.
- Promote `candidate` → `fixture_pass` → `format_verified` only after full acceptance.
- Keep test assets in separate preview infrastructure. Avoid third-party files of unknown redistribution rights in public releases.
