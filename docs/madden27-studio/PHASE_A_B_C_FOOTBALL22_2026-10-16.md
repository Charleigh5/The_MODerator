# MODerator phases A → B → C: football intelligence implementation
**Updated:** 2026-10-16
**Code target:** Charleigh5/The_MODerator, Windows Electron / React / TypeScript
**Universe:** MADDEN27 only; separate CFB27 ingestion and rule schema needed later.

## A — HOMEPC status
HOMEPC and CWEIR-LTP both reported OFFLINE by Remote Desktop Commander when checked on 2026-10-16. No claim of local synchronization, actual Windows screenshot review, game installation or local package execution is made. Existing `main` from merged PR #9 was inspected on GitHub before branching.
A safe operator script is at `scripts/verify-homepc-football22.ps1`. From an authorized HOMEPC PowerShell session:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-homepc-football22.ps1 -Sync -Package
```
The script requires a clean checkout, performs a forward-only merge from remote `main`, uses `npm ci`, executes typecheck, gauntlet, build and optional private packaging/smoke. It will not force-reset, merge conflicts silently, enable new schedulers, install game mods or write game saves. HOMEPC screen-based visual/keyboard verification must follow reconnect. Do not present this as a completed local check until run receipts exist.

## B — football decision intelligence
`src/data/footballPositionIntelligence.ts`: twelve position families (QB, RB, WR, TE, OL, EDGE, DL, LB, CB, NB, SAFETY, SPECIAL_TEAMS) with explicit recognition keys, execution priorities, failure cases, counterplays, baseline tactical context, role-specific evaluation metrics and evidence tags. Distinct OL positions include LT, LG, C, RG, RT; S distinguishes FS/SS. For each family, GrillMe adapts mechanism, game scenario, and skill-tier choices to the player's responsibilities. "A" models grounded coaching concepts, "B" bounded candidate ratings/technique, "C" research-only AI/motion possibilities, and "D" custom descriptions requiring human review. Cosmetics and stadium design still use the generic interview.

The 2026 NFL rulebook is authoritative for legal player counts, formation, eligibility and league rules, **not EA Madden implementation**:
https://operations.nfl.com/rules-officiating/2026-nfl-rulebook/
USA Football coaching articles are examples of particular coaches' assignments, **not universal NFL rules**:
https://blogs.usafootball.com/blog/866/use-these-drills-to-apply-force-and-cutback-rules-to-fit-any-defense
https://blogs.usafootball.com/blog/7313/setting-the-front-in-match-coverage-man-free-with-zone-principles
https://usafootball.com/coaches-organizations/blocking-defeating-blocks

## C — paired 11-on-11 tactical prototype
`src/lib/football22Model.ts` defines two reproducible **instructional** scenarios: shotgun 11 personnel (QB+RB+3WR+TE+5OL) versus a nickel 4-2-5 (4DL+2LB+5DB):
- `PASS_COVER3`: four-man pass rush, protection, post/curl/flat/deep-third reads, seam conflicts.
- `RUN_OUTSIDE_ZONE`: offensive reach/combo responsibilities, field-side force as an illustrative "Sky" call, interior scrape/cutback and safety pursuit.
Each side has exactly eleven uniquely identified generic positions; seven offensive players are marked on line (the diagram is conceptual and not a snap-rule validator). All 22 have proposed assignments, read keys and measurements. Cross-side `interactions` identify pressure, coverage stress, run blocking, and run-fit dependencies; they are not guaranteed matchups or engine hooks. Alternative front/coverage calls will require their own configuration and review.

The interactive `Football22Board` in the Madden chat lets the user switch pass/run and inspect all 22 roles and each player's counterpart interactions. The selection focus follows the detected position family. Special teams need separate personnel/phase models; using these scrimmage lineups for kickoff or punts would be misleading.

The confirmed `GRIDIRON_MOD_SPEC_V2` contains the selected position profile and both schematic scenarios, each with `TACTICAL_CONCEPT_NOT_GAME_RUNTIME` and `NOT_MEASURED`. These are input hypotheses for offline A/B design, **not a Madden 27 mod**. The only verified activity is code-level validation and hosted CI, as reported separately.

## Adversarial limitations and roadmap
1. Position inference uses transparent keyword patterns; ambiguous requests mentioning several positions require a future guided clarification rather than silently assuming cross-position modification.
2. 11-on-11 assignments represent *one* illustrative coverage/run-fit concept. Never universalize these rules to every NFL playbook or NCAA system.
3. Apparent physics and skill gaps have no real Madden runtime bindings, sampling distribution, measured thresholds or guarantee of editability.
4. Add schematic alternatives (man-match, Cover 4, blitz, zone read), cross-role conflict graphs, opponent ratings/size/context variables, film-derived annotations, and a human correction workflow.
5. Keep NFL vs NCAA rules separate; actual game title and patch must be known before promotion. A new CFB27 adapter cannot reuse Madden schema IDs by name alone.
6. Need signed application, local Windows screenshot/accessibility review, exact-build field/file evidence, package roundtrip, game A/B and rollback receipt before claiming a game mod.

**Rollback:** revert this isolated branch or PR; no game files were written.
**Status:** B/C implementation candidate under hosted CI; A deferred pending HOMEPC connectivity.
**Next dependency:** acceptance of hosted checks and local HOMEPC/actual-game evidence.
