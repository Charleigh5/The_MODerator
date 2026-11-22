# GrillMe — ModSpec v2 implementation contract
Date: 2026-10-15. Target: Madden NFL 27 PC, existing MODerator.

## Architecture
`MaddenStudioApp` runs `compileStudioIntent` for evidence truth and separately starts `startGrillSession` for human decisions. The inline `GrillMePanel` renders only the current decision frontier. A/B/C choose a scoped proposal; D requires user-provided detail. Later questions depend on earlier choices; returning to a prior question invalidates descendants. Three rounds (mechanism, situation, skill disparity) precede a fourth confirmation screen.

The first vertical slice is an elite-safety intent: improve 95-vs-72 safety recognition, coverage leverage and pursuit without deterministic superhuman wins. Default A/A/A produces a testable hypothesis (not a game mod). C in round 1 branches to coverage matching versus route combinations. General mod requests receive a generic A–D flow without any claim that an unsupported title is writable.

## Contract
`GRIDIRON_MOD_SPEC_V2` exports only after explicit user confirmation. It includes literal request, typed decisions, position group, behavior layers, candidate capability matches and their original evidence/parity status, missing source inputs, baseline and experimental metrics, source hash (only if actually selected), title build NULL, game artifact NOT BUILT, and runtime NOT RUN. `id` is a stable FNV label, NOT an asset integrity checksum. The selected source may be a copied-file hash, never proof of schema/game physics.

## Tests and acceptance
1. Local pure decision-engine test: branching, four options, D validation, review/rewind, confirmation gate and deterministic spec creation.
2. CI TypeScript typecheck and `gauntlet`, including `tests/grill-me-v2.mjs`.
3. Electron Windows smoke test: choose elite-safety template, analyze, A/A/A decisions, confirm, ensure ModSpec v2 export is enabled. The smoke does not download or modify game files.
4. Review actual Windows screenshot, keyboard focus, responsive behavior, and packaged binary before public release.

## Limitations
No adaptive AI hook, dynamic physics model, defensive decision engine alteration, actual mod package, CFB27 compatibility, licensed third-party code or game runtime verification is claimed. Source-specific mechanics still need a legitimate copied-game build, verified field/asset location, readback, offline A/B trials, metric sampling and rollback.
