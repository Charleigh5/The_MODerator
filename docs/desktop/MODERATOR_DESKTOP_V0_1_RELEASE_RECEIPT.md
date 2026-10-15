# MODerator Desktop v0.1 â€” Release Candidate Receipt

**Status:** `WEEKEND_TEST_CANDIDATE`
**Branch:** `feature/moderator-desktop-siwc-v0.1`
**Target:** Windows x64

## Product result

MODerator is now a local desktop application that preserves the deterministic `MOD_INTENT_V1` evidence compiler while adding an authorized ChatGPT-plan reasoning layer.

Each tester signs into their own eligible ChatGPT account through **Continue with ChatGPT**. The app does not require a pasted OpenAI API key.

## Desktop security boundary

- OAuth Authorization Code + PKCE.
- Loopback callback bound to `127.0.0.1`.
- Fresh state + nonce for each sign-in.
- OpenAI ID token signature / issuer / audience / nonce validation.
- Stable local `ext_agent_host_id`.
- Access / refresh / ID tokens encrypted locally with Electron `safeStorage`.
- Renderer is sandboxed with context isolation and no Node integration.
- Renderer gets a narrow preload API; raw Electron IPC/tokens are not exposed.
- Responses requests set `store:false` and `stream:true`.
- Original selected files are read-only; SHA-256 is calculated before use.
- Current v0.1 does not send binary save/mod bytes to the model.
- Selected small text files can contribute a bounded text preview only after explicit user selection.

## Model truth boundary

The selected model receives deterministic compiler state:
- title/universe;
- readiness;
- capability IDs;
- evidence levels;
- title parity;
- missing material inputs.

The model is instructed not to promote `TARGET`, `UNKNOWN`, `CANDIDATE`, `SCHEMA_DECODED`, or `NEEDS_VERIFICATION` into game-proven behavior.

## Verification

- `npm run typecheck` â€” PASS
- `npm run gauntlet` â€” PASS
- `GAUNTLET_PASS`
- `GAMEPLAY_LAB_PASS`
- `ASSET_FILTER_PASS`
- `AI_ORCHESTRATOR_PASS`
- `SIWC_CORE_PASS`
- Electron development smoke â€” PASS
- Packaged Electron 44.7.0 smoke â€” PASS
- Packaged receipt: `bridge=true`, `chatgptControl=true`, `packaged=true`, version `0.1.0`
- Runtime dependency audit â€” 0 known vulnerabilities
- Overall npm audit â€” 8 moderate, 0 high, 0 critical; remaining findings are in the Electron Builder packaging toolchain.

## Windows artifacts

### Installer
`MODerator-Desktop-Setup-0.1.0.exe`
SHA-256: `9FB21B7FF8E165115ABFBA23EBA7FD5687A285C5E8F5D4997628F57DF61361D6`

### Portable
`MODerator-Desktop-Portable-0.1.0.exe`
SHA-256: `EED7B5E8F2B83AEF18EB2ECE84810FC495C76B42324C29DB38F96912DB92E623`

## Manual acceptance dependency

A real ChatGPT-plan OAuth session is intentionally not auto-approved by the build/test harness. A tester must click **Continue with ChatGPT** and explicitly authorize the app in the browser.

Until that human-consent test is completed, status is `WEEKEND_TEST_CANDIDATE`, not `AUTH_E2E_VERIFIED`.

## Game dependency

The creator PC does not need to own CFB27. The tester who owns the game can run MODerator locally and select their own copied game/save/mod source files. Actual game modification and in-game verification remain separate build/runtime gates.
