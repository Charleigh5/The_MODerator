# Windows package and packaged-runtime receipt — MODerator Madden27 Phase 1

**Date:** 2026-10-09
**Branch:** `feature/madden27-studio-phase1-20261009`
**Implementation commit:** `ae10dccedc4785a8b00735c5449758d5bc2b95ec`
**Build:** `npm run desktop:pack` — PASS (Electron 44.7.0 / Windows x64)
**Distribution state:** `UNSIGNED_LOCAL_TEST_ONLY`; no upload, deployment, or redistribution.

## Built Windows artifacts (HOMEPC)
- Installer: `release/MODerator-Desktop-Setup-0.1.0.exe`
  - bytes: `111516136`
  - SHA-256: `D9B96E889C2ECD5C449D0736E25463E89AFD92217D2EC7D479DAC4253964ECFA`
  - Windows Authenticode status: `NotSigned`.
- Portable: `release/MODerator-Desktop-Portable-0.1.0.exe`
  - bytes: `111286035`
  - SHA-256: `9B7A6AC687DB134AF0AB5FED6316EE0FCE5CA3A883C5EE5FC7C7071767B6D84C`
  - Windows Authenticode status: `NotSigned`.

## Packaged smoke test
Launched `release/win-unpacked/MODerator Desktop.exe` with `MODERATOR_SMOKE_TEST=1`, no ChatGPT account authorization. Exit code `0`.
Observed machine receipt at `%APPDATA%\moderator-desktop\desktop-smoke.json`:
```json
{
  "code": 0,
  "result": {
    "title": "MODerator | Madden 27 Mod Studio",
    "bridge": true,
    "studio": true,
    "promptReady": true,
    "messageCount": 3,
    "planEnabled": true
  },
  "packaged": true,
  "version": "0.1.0"
}
```
GUI screenshot available locally at `%APPDATA%\moderator-desktop\desktop-studio.png`.

## Residual safety/truth gates
Packaging and a smoke test do not prove installer trust, sign-in, asset compilation, Madden 27 executable/profile compatibility, game runtime behavior, accessibility across all viewports, or mod patch safety. `NotSigned` means do not treat these binaries as publicly distributable. Dependencies still include 8 moderate npm advisories; remediate/review prior to release. Do not bypass game anti-cheat or apply changes to originals. Installer hashes refer only to the above current local build, not the earlier 2026-10-08 desktop candidate builds.

**Rollback:** no game files or GitHub remote refs touched. Prior desktop checkout stays at `ff580d0`. Keep Phase 1 branch isolated pending user review and explicit permission for GitHub push/PR/deploy.
