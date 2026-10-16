# MODerator — Madden NFL 27 Mod Studio

An evidence-gated, chat-first research and mod-design workbench for **Madden NFL 27 on Windows PC**. It evolves the original MODerator and its Electron companion, rather than introducing a separate generator.

> **Capability boundary:** The studio analyzes requests, identifies modification surfaces, and exports evidence plans. It does **not** yet prove it can compile a Madden 27 game mod, write a compatible franchise save, launch a mod into the game, or verify gameplay. No game-tested mod claims are made without exact-build evidence.

## Current application

- **GrillMe mod design:** interactive A–D interview with dependent questions, custom D answers, revision, explicit confirmation and `GRIDIRON_MOD_SPEC_V2` JSON export. The elite-safety IQ scenario tests differences between 95- and 72-rated safeties without claiming engine physics parity. The exported schema remains `GAME_ARTIFACT_NOT_BUILT` / `NOT_RUN` and requires exact-build test evidence.
- **Madden 27 Studio:** natural-language request entry, deterministic `MOD_INTENT_V1` capability and missing-input analysis, plan export, and visible `GAME_ARTIFACT_NOT_BUILT` / `NOT_RUN` states.
- **Windows desktop companion:** local file selection and SHA-256 hashing, read-only plan inspection, context-isolated Electron UI, and optionally **Continue with ChatGPT** sign-in with user approval. The initial sign-in model follows [OpenAI's open-source OAuth guidance](https://developers.openai.com/siwc/token-sharing-open-source/sign-in), but actual account authorization and plan eligibility require a separate user-specific test.
- **Mod Intelligence Library:** 31 sourced mod candidates and six developer/tool references, source links, reuse-rights caveats, and intent-keyword search (not embeddings). Third-party game/mod binaries are not redistributed.
- **Community Quality Audit:** 19 dated source observations, two official Madden 27 patch events, independent-review deduplication, and 37 evidence-coverage assessments. Evidence coverage is not a consumer satisfaction rating.
- **HOMEPC source watch:** a separately installed, read-only Windows Scheduled Task `MODerator_Madden27_Mod_Watch` polls seven public EA/GitHub endpoints daily at 9:00 AM local time. It is **not** created or enabled by merely installing the app, and it does not scrape Nexus or Discord.
- **Nexus review inbox:** explicit, user-directed offline import of structured permission-cleared review summaries. Imported claims remain pending until independently verified. **No automatic Nexus mining or consumer rating promotion.**

Previous CFB-specific ontology and research are preserved as historical reference and **cannot be promoted as Madden 27 schema parity**. The previous multi-title workbench is accessible in the development build only with `?legacy=1`.

## Getting started

```powershell
npm ci
npm run typecheck
npm run gauntlet
npm run build
npm run desktop
```

For local unsigned Windows test packages:

```powershell
npm run desktop:pack
```

The installer and portable executable appear in `release/`. They are private development artifacts, **not signed or publicly certified**.

From within the app, open the **Mod Intelligence Library** to browse source-backed records. The **Community Quality Audit** offers the EA patch timeline, latest collected metadata when a HOMEPC source-watch snapshot exists, and an offline Nexus-review import control. The desktop companion displays **Continue with ChatGPT** in its reasoning section when applicable; this requires the user's browser sign-in and explicit OAuth consent.

## Architecture and evidence safety

```text
Prompt -> Madden27 intent -> capability/parity checks -> source requirements
       -> evidence plan -> optional local source selection -> read-only receipt
Public EA/GitHub source metadata -> local dedup ledger -> reviewed candidates
Permission-cleared review pack -> quarantined evidence inbox -> human verification gate
```

- Desktop OAuth uses PKCE and a `127.0.0.1` loopback callback. Tokens are held locally by Electron safeStorage/Windows DPAPI, not exposed to the renderer.
- Electron uses a sandboxed renderer with context isolation, disabled Node integration, restricted preload capabilities, and a content-security policy.
- Original game/save inputs are treated read-only. Text source previews are bounded; source binaries are not automatically sent to a model.
- Build recipes are plans. No `.fbmod` packaging success, title-update compatibility or in-game runtime claim is inferred from a static preview or third-party report.
- Community comments are not scraped or processed from Nexus/Discord without appropriate permission. Publisher and creator asset and redistribution rights remain distinct.
- The independent HOMEPC daily source-watch task is documented in [MOD_WATCH_OPERATIONS_V1.md](docs/mod-intelligence/MOD_WATCH_OPERATIONS_V1.md).

## Validation and release gates

`npm run gauntlet` includes the original evidence compiler, gameplay lab, asset filters, OAuth helper, Madden-only intent, mod library, community quality, source-watch and offline Nexus review contract tests.

GitHub's **MODerator Desktop Windows** workflow installs dependencies, runs typecheck/gauntlet, performs runtime and high-severity dependency audits, builds unsigned Windows packages, and verifies the packaged Madden Studio UI. Its acceptance checks do **not** require a prior HOMEPC source-watch history on a clean Windows CI runner.

Pending release gates include real ChatGPT sign-in consent, approved Madden27 source assets and exact game builds, actual compiler/loader proof, copy-only package round trips, offline runtime verification, code-signing, dependency remediation, public app privacy/security review, and a separate deployment decision.

## License

MIT. See [LICENSE](LICENSE). MIT covers this repository's authored code and **does not confer rights to other creators' mods, copyrighted game data, music, licensed branding, or restricted third-party source code**.
