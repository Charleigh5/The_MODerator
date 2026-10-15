# Madden NFL 27 — Community Intelligence & Patch Review Audit

**Research cutoff:** 2026-10-09, Eastern Time.
**Scope:** 31 Madden NFL 27 PC community-mod candidates and 6 linked developer/tool references from the preexisting MODerator library.
**Status:** SOURCE-GROUNDED_RESEARCH / IMPLEMENTED_LOCAL / USER_QUALITY_UNRATED / GAME_TEST_NOT_RUN.
**Method:** Web Research Assistant source quality, cross-check and disagreement preservation. Research inputs are selected public web pages. Authenticated/private Discord messages, exact game builds and downloaded mod packages were not inspected.

## Decision and central finding

Do not produce an arbitrary popularity ranking from thin community evidence. The audit now computes a **transparent 0–100 evidence-coverage index for all 37 records**, separates that index from actual player satisfaction, and leaves formal **community quality ratings NULL** because no mod has 3 independent firsthand player experiences plus an independently verified same-build in-game test. The most documented entry is not necessarily the best mod.

## Source-by-source research ledger

| Source / date | Type | Direct evidence | Limitations |
| --- | --- | --- | --- |
| [EA Madden27 August 26 update](https://www.ea.com/games/madden-nfl/madden-nfl-27/news/m27-title-update-august-26-2026), posted 2026-08-25 | Official game notes | August 26 effective; Franchise CPU wear-and-tear fixes, custom roster import, void-year contract calculation, Rivalries uniforms; states no gameplay tuning changes beyond stability in this update | Does not provide exact PC executable build, per-mod support or mod-breaking evidence |
| [EA Madden27 September 16 update](https://www.ea.com/games/madden-nfl/madden-nfl-27/news/madden-nfl-27-title-update-september-16), posted 2026-09-15 | Official game notes | September 16 effective; passing/coverage tuning, Franchise contracts and CPU salary cap, camera/scorebug/presentation fixes, equipment additions | Does not establish whether a third-party mod changed or stopped working; exact build absent |
| [Operation Sports, Chase Becotte, 2026-09-25](https://newsletter.operationsports.com/p/madden-mods-and-tools-showcase) | Named editorial account | Specific Madden27 mod categories, creators and experiences including SABOS 1.2, 1.0 Speed, Unlocked, Realistic Franchise, EJ Gameplay, broadcast, camera, stadium | Single journalist and one article; NOT dozens of statistically independent positive votes; creator binaries not inspected |
| [Nexus mod 1 — listing](https://www.nexusmods.com/maddennfl27/mods/1), current inspection 2026-10-09 | Direct host metadata | X2357 Roster v5, last update 2026-10-05; author prohibits rehosting and needs permission for modifications | Endorsements, scans, downloads and bug-tab counters do NOT establish compatibility |
| [Nexus mod 1 — posts](https://www.nexusmods.com/maddennfl27/mods/1?tab=posts), 2026-09-29–2026-10-03 | First-person claims + author reply | Multiple appearance and rating complaints; author counterevidence and deliberate rating-balancing explanation; repack-specific context | Posts are heavily concentrated in one user and refer to unofficial build, no verified retail reproduction; opinions not independent |
| [Shady Mike Madden27 mod tutorial, posted 2026-08-11](https://www.youtube.com/watch?v=hHmNCKg-TE8) | Creator video | Demonstration of MMC cosmetics workflow and a Trix hair-fix candidate | Demo predates the two mapped patches; author runtime video does not prove October compatibility; anti-tamper changes are excluded from automation |

No statistically valid conclusions about global percentages satisfied/dissatisfied follow from this small non-random sample. Community forums and search snippets were also considered but not promoted into dated mod-specific verdicts without primary links, title matching and actual firsthand content.

## Case study: user review deduplication

On the X2357 roster:
- **Raw evaluative posts:** 5 (four missing-appearance reports and one separate ratings complaint).
- **Distinct evaluative player voices:** 1; the separate requester and author replies are not counted as independent dissatisfaction.
- **Independent context-sensitive issue clusters:** 2 (`PLAYER_APPEARANCE_MISSING_LIMBS`, `ROSTER_RATING_CALIBRATION`).
- **Duplicate same-issue posts:** 3 are retained as dated observations, not multiple unique reviewers.
- **Author responses:** 2 dated responses associated with the concerns; author says missing limbs not reproduced on legitimate game, and confirms ratings were intentionally lowered.
- **Installation scope:** affected appearance reports relate to an unofficial repack, **not established as a retail-version defect**.
- **Outcome:** `DISPUTED` for appearance; `AUTHOR_ACKNOWLEDGED` intentional rating adjustment. Neither can be promoted to a fixed/verified bug.

The Nexus site itself displays 14 comments, not 14 independent users, failures, successes or satisfied customers. A "0 Bugs" tab also does not refute the discussion.

## Patch exposure / causal discipline

Tracked events: `EA-M27-2026-08-26` and `EA-M27-2026-09-16`. Each has source, notes publication date, actual effective date, scope and `knownBuildNumber:null`.

- `RETEST_REQUIRED`: A relevant published mod observation predates a subsequent mapped patch. Example: Trix hair-fix video (August 11) predates equipment-facing patch changes.
- `PATCH_RELEVANT_BUILD_UNCONFIRMED`: Patch touches the same broad game subsystem, but the mod's actual supported game build is not established. Examples: SABOS Franchise, Unlocked, Realistic Franchise, camera/scorebug/stadium packages. This is **not** a reported breakage.
- `NO_DIRECT_PATCH_MATCH`: No explicit category overlap in the limited official patch register; still not a working-mod guarantee.

Note: September 16 EA fixes overlap franchise behaviors addressed by mods. Before recommending those mods for retirement, cap, or free-agency issues, rerun the base-game benchmark to see whether the mod remains necessary.

## Assessment rubric and current sample

The **evidence score** is computed from source directness, inspectable listing or code, real author/user follow-up, source timestamps and unique player reporting. Capped at 65/100 without actual locally verified game proof. It is NOT a popularity or quality-of-gameplay metric. `qualityScore:null` means **not rated**, not zero.

| Mod (sample) | Evidence score | Unique firsthand players | EA patch condition | Community quality |
| --- | ---: | ---: | --- | --- |
| X2357 Ultimate Roster | 59/100 | 1 | Relevant, build unconfirmed | NOT RATED; author/user conflict |
| SABOS Franchise 1.2 | 27/100 | 0 | Relevant, build unconfirmed | NOT RATED; editorial praise |
| Madden 27 Unlocked | 27/100 | 0 | Relevant, build unconfirmed | NOT RATED; editorial description |
| Realistic Franchise | 27/100 | 0 | Relevant, build unconfirmed | NOT RATED; editorial description |
| NFL Broadcast Scorebugs | 27/100 | 0 | Relevant, build unconfirmed | NOT RATED; editorial description |
| EJ Gameplay | 27/100 | 0 | Relevant, build unconfirmed | NOT RATED; editorial description |
| Stadium Experience | 27/100 | 0 | Relevant, build unconfirmed | NOT RATED; editorial description |
| Trix Hair Fix | 22/100 | 0 | RETEST_REQUIRED | NOT RATED; older video |

**Consequence:** the roster's higher 59/100 is higher **documentation density**, not higher satisfaction or reliability. Raw comments, individual reports and author's response remain accessible from each entry's direct source link.

## Implementation, files, tests

- `src/data/communityEvidence.ts`: source-linked dated evidence and two official EA patch items.
- `src/lib/communityScoring.ts`: deterministic deduplication, patch overlap classification, evidence-index scoring and strict insufficient-data gate.
- `src/components/CommunityIntelligencePanel.tsx`, `.css`: chronological patch cards, assessed mod records, source links, independent clusters and interactive patch-exposure filter.
- `src/components/ModIntelligenceLibrary.tsx`, `.css`: evidence/quality indicator in existing mod cards and optional Community Quality Audit workspace.
- `tests/community-intelligence.mjs`: duplicated report convergence, patch dates, skeptical quality gate, author-response independence, unofficial-install context, 37 record coverage.
- `scripts/export-community-intelligence.mjs` and `docs/mod-intelligence/COMMUNITY_INTELLIGENCE_V1.json`: portable machine-readable source ledger (19 dated evidence records, 2 issue clusters, 37 scored references, 2 official patches).
- `desktop/main.mjs`: Windows smoke interaction verifies app, library, audit view, 37 assessment rows and two patch cards; screenshot `%APPDATA%\moderator-desktop\desktop-community-intelligence.png`.

All source evidence is append-and-review, and prior catalog data are preserved rather than overwritten. No game files changed, no anti-cheat actions, no creator mod binaries downloaded or executed, no external deployment.

## Adversarial weaknesses / future improvements

1. Feedback sampling is narrow: 19 dated records include editorial source statements and metadata, **not 19 independent users**. Future collector needs authenticated, permission-respecting source readers with per-post IDs and native timestamps.
2. Current scoring is an interpretable **evidence index**, not a calibrated quality metric. Require three genuinely independent firsthand reports and a verified exact-build game test before presenting user-quality ratings; cross-platform/repack contexts must be separate.
3. Patch mapping uses category/surface heuristics, not parsed asset paths or concrete mod conflict graphs. Improve after lawful authorized package inventories exist; no compatibility declaration solely from shared domain.
4. Public opinion reports may change as creators release new updates. Add per-mod release dates, hashes, patch build IDs, revision history and a last-checked timestamp.
5. A domain-wide editor note is not 31 independent validations. Source independence keys must remain linked across all candidates mentioned by one publication.

## Completion / next dependency

Status: `RESEARCH_AUDIT_PASS`, `LOCAL_UI_SMOKE_PASS`, `NO_QUALIFIED_GAME_QUALITY_RATINGS`.
Next dependency: new independent mod-specific player reviews and creator-released exact-build compatibility evidence, or a legally obtained known-good mod file for a copied-game offline roundtrip.
Next move: establish a permission-aware mod quality data collection pipeline, then patch by exact executable version and merge with hash-backed runtime tests.
