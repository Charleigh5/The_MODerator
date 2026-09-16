# MODerator Full Implementation Gauntlet — Design

## Objective
Replace speculative/fabricated mod generation with a source-grounded football modification compiler that can resolve natural-language intents into evidence-gated CFB27/Madden27 capability bindings, adaptive missing-input questions, conflict analysis, plane-specific build recipes, and verification receipts.

## Non-negotiable truth model
- Never equate a decoded field with proven gameplay behavior.
- Never infer CFB27 save/table bindings into Madden 27.
- Never claim an artifact is game-ready until an actual output is built from exact-build user/game inputs, reopened/re-read, and runtime verified where required.
- Preserve source files; save writes target copies only.
- Runtime/native work is offline-only and a fallback after data/asset surfaces.

## Architecture
1. capabilityRegistry.ts: 58 source-indexed capability records from the v1 atlas.
2. madden27Parity.ts: shared/different Frostbite profile facts plus conservative title-parity rules.
3. teamBuilderSchema.ts: game-verified Team Builder controls; exact ZIP-internal JSON paths remain unresolved until bytes can be extracted.
4. gameOntology.ts: domain → capability → surface → evidence graph.
5. capabilityResolver.ts: deterministic lexical/phrase routing with confidence floor.
6. modIntentCompiler.ts: MOD_INTENT_V1, evidence/readiness gate, missing-input detection, contextual quick replies.
7. compatibilityEngine.ts: resource-family conflict classification.
8. buildRecipe.ts: plane-specific deterministic build/verification sequences.
9. proofEngine.ts: plan/build/experiment proof receipt; runtime is NOT_RUN unless observed.
10. evidenceBundle.ts: source bindings + recipes + compatibility + proof receipt as a non-installable execution package.
11. App integration: conversation readiness is capability/evidence driven; legacy fictional Lua/XML generator is demo-only and blocked from build/test/export promotion.

## Six proof slices
Rating edit; realistic jersey renumbering; CharacterVisuals gear; Team Builder helmet/uniform; recruit-generation/progression FTC; pile-leap animation experiment.

## Acceptance
- Pure compiler modules typecheck.
- Existing application typecheck/build pass.
- All six fixtures resolve expected capability IDs.
- Pile-leap remains NEEDS_VERIFICATION.
- Madden save-field prompt blocks absent a parity crosswalk.
- Ontology count equals 58 capabilities.
- Team Builder ZIP boundary is explicit, not invented.
- Evidence bundle always emits runtimeClaim NOT_RUN before actual runtime proof.
- Legacy synthetic bundle cannot be promoted/exported as an installable mod.
