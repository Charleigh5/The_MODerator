# HOMEPC Gameplay Lab Execution Receipt — 2026-09-23

**Experiment:** `CFB27-GAMEPLAY-EXP-001-PILE-LEAP`
**Device:** HOMEPC
**Repository:** `C:\Users\cweir\Documents\GitHub\The_MODerator`
**Branch:** `feature/gameplay-lab-pile-leap-exp001-20260916`
**Starting branch head:** `18057fa0f5d35978fe9ebe329e8a1ec3d1b79f85`

## Local execution
- Node: `v24.14.0`
- npm: `11.9.0`
- `npm ci`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run gauntlet`: PASS
- `GAUNTLET_PASS`
- `GAMEPLAY_LAB_PASS`
- `ASSET_FILTER_PASS`

## Upstream source
`eric-levinson/cfb27-dynasty-modding` was cloned locally and reset to:
`2ff86a25924d9fe88ca7565dd26b6e7745c06452`
## CFB27 installation check
Checked:
- default EA Games path;
- EA Desktop InstallData;
- C: Steam library;
- E: Steam library;
- E: game-library roots.

EA InstallData currently lists Battlefield 2042, Madden NFL 23, Madden NFL 24, Madden NFL 25, and Super Mega Baseball 4.
No College Football 27 InstallData entry or `CollegeFB27.exe` was found.

The upstream asset inventory generator requires:
`C:\Program Files\EA Games\EA SPORTS College Football 27\Data`

Therefore a current-build TOC/CAS inventory cannot be truthfully generated on this HOMEPC until CFB27 game files are present.

## Gauntlet refinement
A real Windows fixture exposed a UTF-8 BOM defect in `filter-asset-inventory.mjs`.
The parser now strips a BOM from the first TSV header.
A regression test was added at `tests/filter-asset-inventory.mjs`.

## Truth state
- local compiler/test execution: `CONFIRMED`
- asset-filter execution: `CONFIRMED`
- current CFB27 asset inventory: `BLOCKED_GAME_INSTALL_ABSENT`
- current EXE SHA-256: `UNKNOWN`
- runtime instrumentation: `NOT_RUN`
- behavior proof: `NOT_RUN`
