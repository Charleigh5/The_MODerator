# MODerator Madden NFL 27 Studio — Phase 1 implementation and gauntlet receipt

**Date:** 2026-10-09
**Status:** IMPLEMENTED_LOCAL / TESTED_DESKTOP / GAME_ARTIFACT_NOT_BUILT
**Target universe:** MADDEN27, Windows PC, offline mod verification only
**Repository:** Charleigh5/The_MODerator
**Worktree:** `%USERPROFILE%\Documents\GitHub\The_MODerator-madden27-studio`
**Branch:** feature/madden27-studio-phase1-20261009
**Base commit:** ff580d0 (preexisting, locally verified desktop branch)
**Observed remote main at intake:** 4bd0099
**Release:** not pushed, merged, deployed, or distributed. No originals/game assets modified.

## Objective and decision
Evolve the existing MODerator repository into a Madden NFL 27-exclusive ChatGPT-like website, with a Windows companion supporting local source inspection, mod build handoff and later controlled offline game verification. Do not fork a separate standalone generator. Keep existing workbench and earlier CFB evidence/compiler implementation in the codebase as non-promoted history.

## Architecture / execution boundaries
- Default web and Electron UI: Madden 27 chat studio with preset prompts, evidence-gated response, capability inspector, decorative field schematic (not a game preview), source-file chooser, plan JSON download, plan import inspection, and optional desktop model access.
- Prior multi-title workbench preserved only behind DEV-only `?legacy=1`, not displayed in production.
- `compileStudioIntent` forces `MADDEN27` for title-agnostic prompts; blocks explicit other-game title requests. It does not inherit CFB27-only schema/asset bindings.
- Selecting a local source requires Electron Desktop; copied-save/Team-Builder references are represented by name, extension, size, SHA-256. A textual claim of attachment is not accepted as attachment evidence.
- Exported `MADDEN27_STUDIO_PLAN_V1` contains intent, source declarations, recipes, receipt and explicit `GAME_ARTIFACT_NOT_BUILT` and `NOT_RUN` states. Local paths are excluded from plan exports.
- Desktop IPC `studio.importPlan` accepts a user-chosen JSON file no larger than 1 MiB, validates target, format, receipt and metadata, and returns `PLAN_IMPORTED_UNVERIFIED`. It never executes a plan, installs mods, modifies files, or declares that the file hash is matched.
- Electron desktop authorizations, model connections, and file hashing reuse the preexisting desktop branch. Authorization-code OAuth has NOT been revalidated end-to-end with a human account during this slice.

## Code changes
1. `src/lib/modIntentCompiler.ts`: optional forced universe without changing legacy default.
2. `src/lib/maddenStudio.ts`: Madden-only compiler and safe evidence-plan serialization.
3. `src/components/MaddenStudioApp.tsx` / `.css`: responsive stadium-inspired, chat-first studio.
4. `src/main.tsx`, `index.html`: Madden-default route / metadata, legacy dev-only route.
5. `desktop/lib/studio-plan.mjs`: read-only inspector, strict size/type/title/claim checks.
6. `desktop/main.mjs`, `desktop/preload.cjs`, `src/desktop.d.ts`: narrow user-mediated IPC and deterministic GUI smoke.
7. `tests/madden-studio.mjs`, `tests/studio-plan.mjs`: focused regression and negative-path tests.
8. `tsconfig.gauntlet.json`, `package.json`: add new tests and compilation scope.

## Evidence and tests
- Existing regression: `GAUNTLET_PASS`, `GAMEPLAY_LAB_PASS`, `ASSET_FILTER_PASS`, `AI_ORCHESTRATOR_PASS`, `SIWC_CORE_PASS`.
- New regression: `MADDEN_STUDIO_PASS`, `STUDIO_PLAN_IMPORT_PASS`.
- TypeScript strict typecheck and production Vite build: PASSED after implementation and adversarial corrections.
- Electron Windows runtime smoke: PASSED. A sample preset was selected, an actual chat request was submitted, three messages appeared, plan export became enabled, and Desktop preload bridge was present.
- Screenshot: `%APPDATA%\moderator-desktop\desktop-studio.png`.
- Smoke machine result: `%APPDATA%\moderator-desktop\desktop-smoke.json`.
- `npm audit` at intake: eight MODERATE dependency advisories, zero HIGH or CRITICAL. Audited dependency groups include Electron Builder/packaging transitive dependencies. Public redistribution remains gated on security review.
- No Madden 27 game installation, exact patch, asset file, FMT or MMC compatible writable path was verified on the tested machine. Checks of two common installation roots did not show a Madden-named directory; this is not an exhaustive drive audit.
- No browser-to-running-companion pairing, actual asset patch/write, `.fbmod` compilation, FMT/MMC load, in-game visual proof, or gameplay/physics change has been performed.

## Adversarial gauntlet — defects and corrections
1. Old compiler defaulted to CFB27 if 'Madden 27' absent. The new Madden-only frontend calls an explicitly forced-universe wrapper, with original parser behavior retained for historical tests.
2. Text containing 'source save' could accidentally satisfy a file requirement. The wrapper now requires an actual locally selected valid hash/source reference for save and Team Builder flows.
3. The first UI build used unavailable Lucide icons and ES `replaceAll` outside configured type target; replaced with exported icons and compatible `replace(/_/g," ")`, then reran tests.
4. Original Electron smoke asserted obsolete CHATGPT button and failed on redesigned UI. Replaced it with actual DOM interaction verification and screenshot capture.
5. Visual QA revealed duplicate primary capability rows and save-input requirements on an equipment-only prompt; deduplicated inspector and constrained save requirement to save-targeted intent.
6. Production routing to old multi-title workbench could undermine Madden-exclusivity. Restricted legacy route to development environment.
7. No automatic privilege escalation: imported JSON plans remain read-only, fail closed, reject unsupported target and false runtime claims.

## Hard blockers / acceptance gates before real game claims
- **ASSET_INPUT_REQUIRED:** owned/authorized Madden NFL 27 PC installation, exact game build, and a copied known-good asset/source or already working mod with hash/provenance.
- **MADDEN27_COMPILER_REQUIRED:** independently verified FMT/MMC packager and loader compatibility on exact build. Madden 27 FMT profile evidence previously showed mesh import and mod-launch capability disabled. Source-backed recipes are plans, NOT executables.
- **ROUNDTRIP_REQUIRED:** compile a tiny copied cosmetic texture edit, reread package, diff only changed resource and confirm source hash unchanged.
- **RUNTIME_REQUIRED:** user-authorized, offline test with in-game screenshot/log/metadata and rollback check. No online anti-cheat bypass functionality.
- **AUTH_E2E_REQUIRED:** explicit human sign-in if testing the existing ChatGPT account model connector; do not infer plan eligibility.
- **PUBLIC_RELEASE_REQUIRED:** application threat model, package dependency remediation, license/asset provenance, consent/privacy design, signed installers and deploy/merge approval.

## Roadmap / pending checklist
- [x] R1 / In-place repo baseline and existing desktop discovery.
- [x] R2 / Isolated worktree (no changes to original branch, main or game assets).
- [x] R3 / Madden-only intent and fail-closed source gates.
- [x] R4 / Chat-first desktop + browser UI and evidence inspector.
- [x] R5 / Local companion source selection, plan export + read-only import.
- [x] R6 / Regression/build/Electron interaction smoke and visual review.
- [ ] R7 / File source integration and exact-build asset inventory.
- [ ] R8 / First real cosmetic asset build adapter and package-roundtrip verification.
- [ ] R9 / User-authorized offline game test and evidence receipt.
- [ ] R10 / Browser-to-companion pairing with authenticated session and threat-model review.
- [ ] R11 / Editable player/stadium 3D visual preview calibrated against in-game evidence.
- [ ] R12 / Public mod library, metadata, compatibility patch watch, permissions and releases.

## Review states, rollback and source impact
- Evidence plan: CONFIRMED_CODE_PATH, NOT_GAME_VERIFIED.
- Actual Madden 27 mod compiler: NEEDS_VERIFICATION.
- Runtime/game acceptance: NOT_RUN.
- UI: PASSED_SMOKE; automated accessibility and multi-viewport screenshot regression not yet completed.
- Largest defect remaining: missing exact-build Madden27 asset/loader roundtrip proving a genuine game artifact.
- Rollback: delete/revert the isolated branch/worktree or revert its feature commit; do not touch `main`, the original desktop branch, real game files or prior artifacts.
- Source impact: add this receipt and later exact-build game experiment logs to the canonical Madden project sources after user review. This source does not supersede the historical CFB27 data/ontology.
- Next dependency: authorized exact-build Madden 27 PC texture/asset input or known-good working cosmetic mod plus FMT/MMC build/profile details.
- Next move: one independently inspected source asset -> isolated asset edit -> compilable package -> package reread -> offline game evidence. Push/PR and distribution need separate authorization.
