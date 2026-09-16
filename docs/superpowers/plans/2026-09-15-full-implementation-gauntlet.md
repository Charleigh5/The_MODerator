# MODerator Full Implementation Gauntlet — Implementation Plan

**Goal:** Convert The_MODerator from speculative bundle generation to an evidence-gated, source-indexed natural-language mod compiler.

**Architecture:** Pure deterministic compiler modules sit between conversation input and any future build adapter. Capability truth is data-driven, title parity is explicit, and every build path emits verification/rollback requirements. Existing UI remains intact while readiness and output truth are upgraded.

**Tech Stack:** TypeScript, React/Vite existing app, Node assertions for gauntlet checks.

**Spec:** docs/superpowers/specs/2026-09-15-full-implementation-gauntlet-design.md

## Tasks
- [x] T1 Source registry + 58-capability ontology.
- [x] T2 Madden27 parity matrix from current FMT profiles; save parity defaults UNKNOWN.
- [x] T3 Team Builder control schema with ZIP-source boundary.
- [x] T4 Capability resolver + MOD_INTENT_V1 compiler + adaptive quick replies.
- [x] T5 Compatibility analysis + plane-specific build recipes + proof receipts.
- [x] T6 Six vertical-slice fixtures + Madden negative control + ontology/profile assertions.
- [x] T7 Integrate readiness into existing conversation engine/App and retire false game-ready claims.
- [x] T8 Repository typecheck/build/gauntlet CI definition.
- [x] T9 Independent/adversarial review completed; primary defects corrected and push + PR gauntlets rerun successfully.

## Review corrections
1. **Mechanics-vs-rating ambiguity:** pile-leap/tackle language must prioritize animation/runtime mechanics rather than accidentally treating `tackle` as a scalar rating request.
2. **Fail-closed recipe truth:** `BLOCKED` and `NEEDS_INPUT` intents now retain those states in generated build recipes instead of being mislabeled executable.
3. **Cross-plane compatibility:** different manipulation planes remain `UNKNOWN` unless combined behavior is actually verified; lower binary-collision risk is not proof of semantic compatibility.
4. **Legacy generator containment:** synthetic Lua/XML output remains `LEGACY_DEMO_ONLY` and cannot pass the evidence build/test/export path as an installable mod.

## Final verification
- Branch: `feature/full-implementation-gauntlet-20260915`
- Hardened code/test head before this documentation closeout: `2117b4d38fcdcebe81bcabd98c6c31bab7c1096a`
- Push workflow run `35049497923`: PASS — npm ci, typecheck, production build, gauntlet.
- Pull-request workflow run `35049501493`: PASS — npm ci, typecheck, production build, gauntlet.
- Draft PR: #5, mergeable, not merged.

## Stop conditions
Do not merge/deploy. Do not claim runtime/game verification without observed game evidence. Team Builder exact internal JSON paths remain blocked until the distributed ZIP can be extracted and indexed. Madden 27 save/table parity remains blocked until title-specific schema bindings are proven.
