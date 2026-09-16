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
- [ ] T9 Independent review, fix largest defect, rerun gauntlet/CI.

## Stop conditions
Do not merge/deploy. Do not claim runtime/game verification without observed game evidence. Team Builder exact internal JSON paths remain blocked until the distributed ZIP can be extracted and indexed.
