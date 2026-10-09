# Madden 27 Mod Intelligence — public discovery, downloads, source patterns and sentiment audit

**Research date:** 2026-10-09 · **Target:** Madden NFL 27 Windows PC · **Status:** CATALOG_IMPLEMENTED / SOURCE_CODE_INSPECTED / GAME_TEST_NOT_RUN.

## Executive determination

Do not equate published mod descriptions with transferable source code or current patch proof. The MODerator catalog includes **31 community mod candidates** and **6 GitHub development-tool references**. Most community files are discoverable via the Madden Modding Community Discord but are not directly inspectable with public unauthenticated URLs. **No third-party mod executable or game asset was downloaded, run, rehosted or merged into MODerator.** Two public GitHub source repositories were shallow/sparse cloned to a quarantine location; selected textual source files were inspected and SHA-256-hashed, without executing scripts, build tools or DLLs.

## Evidence authority and supported claims

1. [Operation Sports, 2026-09-25, Chase Becotte — Madden Mods and Tools Showcase](https://newsletter.operationsports.com/p/madden-mods-and-tools-showcase): first-person editorial exploration of dozens of Madden 27 mods, with attributed creators and broad effects; descriptive, **not an independent controlled per-mod reproducibility study**. Its main acquisition route is the MMC Discord. Entries linked to this article are `EDITORIAL_REPORT`.
2. [Nexus Mods Madden 27, X2357 Ultimate Roster](https://www.nexusmods.com/maddennfl27/mods/1): direct public listing as of 2026-10-09, version 5, 44 unique downloads, 54 total downloads, 647 views, one endorsement, updated 2026-10-05. The author prohibits redistribution, conversion and modification without permission. Listing is `NEXUS_LISTING`, **not `GAME_VERIFIED`**. Binary content not independently inspected.
3. [Nexus mod discussion](https://www.nexusmods.com/maddennfl27/mods/1?tab=posts): 14 comments. One repeated poster reports missing limbs/transparent visuals and discrepancies, and explicitly says their installation is an unofficial repack; the creator responds that a legitimate copy does not exhibit those problems. This is an **installation-specific conflict**, not a measured failure rate. A small, correlated comment sample cannot support "everyone hates it."
4. [Shady Mike Gaming — Madden 27 setup walkthrough](https://www.youtube.com/watch?v=hHmNCKg-TE8): video shows obtaining a "Trix" hair-fix mod through Discord and using MMC workflow. Useful discoverability and video demonstration; no exact-build binary hash recorded, and its instructions include anticheat changes **which MODerator will not perform or recommend automating**.
5. [r/Madden — Madden 27 Mods (Aug 2026)](https://www.reddit.com/r/Madden/comments/1vtni3a/madden_27_mods/): a commenter says notable franchise and gameplay packages awaited September updates; a historical August snapshot not authoritative for October.
6. [r/Madden — Is modding worth it?](https://www.reddit.com/r/Madden/comments/1rvcowx/is_modding_madden_worth_it/) and [Madden on PC with mods](https://www.reddit.com/r/Madden/comments/1tbtp68/madden_on_pc_with_mods/): favorable on customization/gameplay, critical of fragility, game patches, load-order conflicts, and installation UX. Samples discuss multiple Madden years and MUST NOT be counted as 27-specific endorsements.
7. [r/Madden — PC version stability](https://www.reddit.com/r/Madden/comments/1vp7t2x/how_well_does_madden_27_run_on_pc_is_it_stable_yet/): mixed small PC crash reports, not isolated to mod presence or cause.

## Source-code audit — files actually downloaded, never executed

Public source clones kept OUTSIDE production repo at `%TEMP%\MODerator-reference-quarantine-20261009`. Both clones used shallow, partial checkouts. Files are research inputs, **not embedded redistributed source**.

| Repo | Commit observed | Inspected file | SHA-256 | License/reuse decision |
| --- | --- | --- | --- | --- |
| [FMTDev/FMT.Madden26Plugin](https://github.com/FMTDev/FMT.Madden26Plugin) | `cd76382b2d0549c59cdecb96ab963c710c740d18` | `Madden27Profile.json` | `4494959113B3DD80CBE5BD651FF75E73D05FAA374A35DD9823DA6BB05EC12C95` | CC BY-NC-ND 4.0; inspect for compatibility, **do not lift code into commercial app** |
| Same | Same | `Source/Core/Compiler/Madden27AssetCompiler.cs` | `0EAB773E0AEE76A0F06E6534D4C58C18780137A976055BF5C2D2AD139950EF6A` | Contains operations relating to anti-tamper replacements; do not execute/copy integration |
| [bep713/madden-franchise](https://github.com/bep713/madden-franchise) | `15aa3586b5df27c7b38ac34e968375a36dc81cd7` | `src/FranchiseFile.js` | `96D9970CA9F4D0649C83BFEAC74D2D24B8771EE6BD2BEADF09006CEC1D1813A9` | `package.json` declares MIT; separate license file not confirmed; confirm full notices before copying |
| Same | Same | `package.json` | `7116CAD2A5B78FC6BF9341427F2D3400C20E4C0080F4B6D93C54E7467EEB09D6` | Node package 4.3.7 current checked commit; not proof of Madden 27 schema |

### Grounded engineering patterns

- **FMT profile/plugin:** configuration chooses `Madden27AssetCompiler`, `TextureImporter`, `Madden26AssetLoader`, EBX readers/writers, `DataVersion=20260813`; `CanImportMeshes=false`, `CanLaunchMods=false`, `CanUseModData=false`. The compiler includes TOC/CAS and asset resolution pathways. These flags and code structures do **not** prove successful modern .fbmod compile/install.
- **Franchise parser:** `FranchiseFile.js` uses a `create()` factory, `ready`/`error` event gating, a binary buffer and parsed table structures. We can independently implement wrappers for source-hash, copied-input, schema-bound table inspection and readback with proper license review. It cannot be promoted to a Madden27 writer without exact-build, field-level demonstrations.
- **MMC wrapper:** [README](https://github.com/bphit4/MMC-Frosty-Modding-Tools/blob/main/README.md) points to packaged `.rar` releases; public repository itself mainly documents workflows, not inspectable tool source. Asset loaders and anti-cheat workarounds must not be presumed trustworthy or automated.
- **FrostyToolsuite historical repo:** [CadeEvs/FrostyToolsuite](https://github.com/CadeEvs/FrostyToolsuite) is a code-architecture reference; exact Madden27 profile parity and reuse rights unverified.
- **CFB27 reverse-engineering:** [eric-levinson/cfb27-dynasty-modding](https://github.com/eric-levinson/cfb27-dynasty-modding) belongs to a DIFFERENT universe. Do not apply CFB27 table IDs, character bindings, or save schemas as Madden27 truths.
- **Rejected software listing:** [MilliHairdresserWire/Madden-27-Mod-Manager](https://github.com/MilliHairdresserWire/Madden-27-Mod-Manager) claims complete mod, roster and franchise management; repository contains `README.md` and `manager.py` with only 53 bytes. Flag `INSUFFICIENT_IMPLEMENTATION` and do not recommend or run.

## Sentiment synthesis (qualitative, sample-limited)

**Positive/reported:** equipment unlocks, faces/portraits, uniforms, camera angles, stadium authenticity and Franchise/simulation balancing enhance immersion and longevity. Operation Sports enthusiastically covers these categories and specific creators, but provides neither per-mod user satisfaction denominator nor repeatable benchmark results.

**Negative/reported:** game updates invalidate mods; load-order coordination and multiple gameplay replacements cause conflicts; mod-manager setup is confusing, some source links require Discord, and user communication/support differs. One Nexus roster has disputes about rendering on a modified/cracked game copy; no population prevalence measurable. Many published demo modifications are large composite mods, making failure diagnosis difficult.

**Unverified:** mod-specific star ratings, raw current downloads for Discord-hosted packages, game patch compatibility, anti-malware scanning, executable safety, exact mods' dependencies, authors' reuse permission, and whether the mod's effects survive a copied-game offline run. Absence of a complaint is not proof of functionality.

## App implementation and discovery rules

- `src/data/modIntelligence.ts` is the canonical *derived research snapshot*: 31 Madden27-target mod candidates and six development references. Each item has evidence, creator, type, compatibility state, source URL, license/reuse caveat and available access path. Records are **not canonical executable proof**.
- `src/lib/modLibrarySearch.ts` is deterministic phrase/intent token expansion with a coverage threshold; label it **intent-keyword search**, never embedding-powered semantic similarity.
- `src/components/ModIntelligenceLibrary.tsx` provides browse/search, type/category filters, external source links, caveats, and original-design inspiration. No direct downloads of unreviewed binaries.
- The Phase1 website/desktop retains read-only file selection, plan export/import, and game-runtime `NOT_RUN` truth gates.
- Promotion to `SOURCE_CODE_VERIFIED`: file hashes + source/commit + license + static inspection. Promotion to `GAME_VERIFIED`: exact owned PC build, signed-off offline installation, isolated copied mod experiment, runtime screenshots/logs, package reread, and reversibility.

## Next exact experiment and blockers

1. Identify one **licensed/creator-authorized** small Madden27 cosmetic asset or a provided working local sample mod with author, hash and exact build. Prefer an independent texture repaint, not a composite gameplay mod.
2. Inspect without executing, map resources, confirm permissions, and test read-only package parse; register asset hierarchy and dependency references.
3. Generate a **new original** texture on copied input; use title-specific FMT/MMC adapter only after capability verification and without anti-cheat bypass automation.
4. Validate output package contents/diff, loader behavior in a lawful offline environment, stable frame evidence, and rollback. Do not claim modding proof from screenshots of other creators' demos.
5. Before public catalog redistribution: written permission, appropriate music/logo rights, dependency scanning, download provenance, signed desktop distribution, complaints/bug resolution evidence, and patch watch.

**QA decision:** `CATALOG_READY_FOR_HUMAN_REVIEW`; no third-party file redistributed, downloaded mod binaries: 0, actual game mod builds: 0, gameplay tests: 0, unresolved exact-build and author-permission blockers remain.
