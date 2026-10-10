# MODerator — Recurring Madden 27 Evidence Watch, implementation and release candidate

**Date:** 2026-10-10, America/New_York
**Repository:** `Charleigh5/The_MODerator` — local HOMEPC worktree.
**Branch:** `feature/madden27-mod-watch-20261010` (based on `769e6eb`)
**Version:** `MOD_WATCH_SNAPSHOT_V1`
**Decision:** ACTIVE_LOCAL_SOURCE_WATCH / UI_INTEGRATED / GAME_PROOF_NOT_RUN / NOT_PUBLICLY_RELEASED

## What was executed

1. Read Engineering Suite routing, incremental delivery, test-driven development, CI/CD, security, observability and source-driven guidance. Reused existing Madden27 catalog, community-scoring engine and Electron bridge, without creating an unrelated project.
2. Added read-only public-source polling with seven source lanes: EA Madden27 official news index; GitHub release and commit APIs for FMTDev Madden compiler, MMC Frosty modding tools, and the `madden-franchise` parser. Used Node.js standard library only; no new npm dependencies or secrets.
3. Restricted outbound requests to exact official EA and GitHub API origins/paths; response size 700KB; timeout 12 seconds; no HTTP redirect following; public data only. External text is metadata with source links, never commands, scripts or proof of compatibility.
4. Added append-and-dedup ledger keyed by EA article slug, provider release ID, or SHA-1 Git commit; persisted at `%APPDATA%\moderator-desktop\mod-watch\`. Every run has its own ID, source statuses, last-run receipt and last-good snapshot.
5. Integrated Electron IPC read-only snapshot view with fixed path, maximum size, provenance/hostname checks, field allowlist and browser-safe hyperlink requirements. Browser-only UI correctly reports local collector unavailable.
6. Connected **validated GitHub release metadata only** as `HOST_METADATA` to the existing evidence-coverage scoring rubric. GitHub commits and EA news headlines are displayed as observed updates, not promoted automatically to patch events or user satisfaction. Qualified game quality remains UNRATED without human-reviewed game proof and independent user reports.
7. Added a Windows Task Scheduler installer (09:00 local daily) and user-controlled uninstaller, copying a stable Node standard-library runtime script to `%APPDATA%\moderator-desktop\watch-runtime\` so worktree deletions do not break recurrence. Action uses `C:\Program Files\nodejs\node.exe` (installed Node v24.14.0), user `cweir`, logon `Interactive`, run level Limited, and StartWhenAvailable.

## Live source receipts

- First live run: `2026-10-10T13:00:35.688Z` — all seven sources OK, 34 **baseline** observations: EA news 15; FMT commits 5 (releases 0); MMC releases 4 and commits 5; franchise parser commits 5 (releases 0).
- Second successful live poll: `2026-10-10T13:06:52.405Z` — all seven OK, **0 new** observations. Repeated polls do not label baseline items as today's releases.
- Scheduler: `MODerator_Madden27_Mod_Watch` registered, daily 09:00; next scheduled run `2026-10-11 09:00` HomePC local time. Manually invoked and verified **LastTaskResult = 0**, 0 new events. Uses installed stable Node path, not temporary tools.

## QA, faults and repair

- `tests/mod-watch.mjs`: initial baseline, duplicate suppression, new release, source allowlist, invalid source, total outage/last-good retention and partial failures: PASS.
- `tests/mod-watch-bridge.mjs`: fixed read-only IPC boundary, reject malicious URL, spoofed game verification, excessive payload, malformed id: PASS.
- `npm run typecheck`: PASS.
- `npm run gauntlet` existing plus both new suites: PASS.
- `npm run build`: PASS.
- Electron development interaction smoke: PASS. DOM includes 37 catalog items, 37 assessment rows, 2 EA patch cards, live source-watch rows, and an intact chat design plan.
- **Critical live defect found:** initial run created files successfully, but the second run failed on Windows rename-over-existing with `EPERM`. Corrected with bounded retry, prior-copy restore and missing-state fallback. Real subsequent collection and scheduled execution both completed with status `OK`. This failure was surfaced and fixed **before** declaring the monitor operational.
- `npm run desktop:pack`: PASS, Windows x64 NSIS and portable.
- Packaged Windows smoke: PASS, code 0, `packaged=true`, `liveWatchItems=8`, `assessmentRows=37`, `patchCards=2`.
- Screenshot: `%APPDATA%\moderator-desktop\desktop-mod-watch.png`.

## Private Windows binaries (NOT publicly signed)

| Artifact | Bytes | SHA-256 | Authenticode |
| --- | ---: | --- | --- |
| `release/MODerator-Desktop-Setup-0.1.0.exe` | 111530426 | `517A4073410D184C99BF092E5B364B826DC4E172357F42861E03A6143D1CB632` | NotSigned |
| `release/MODerator-Desktop-Portable-0.1.0.exe` | 111300309 | `0527EBE23420C2E37CE8B5FA81C9B8E1520FA922634E85C10869970FEC944B67` | NotSigned |

No public deployment, installer signature trust claim, game-file mutation, downloaded third-party mod binary, anti-cheat alteration or GitHub remote push was performed.

## Known limitations and next gate

1. **Not a complete community-review monitor.** Current active inputs are official EA news and public GitHub source activity. Nexus Mods review ingestion requires appropriate API credentials, rate-limit policy and stable per-post IDs; private Discord announcements require access grants. Related official docs: https://api-docs.nexusmods.com/ and https://help.nexusmods.com/article/114-api-acceptable-use-policy.
2. EA index headline presence is only `PATCH_CANDIDATE`; human verification of official dates, exact build numbers and game surfaces is required before updating canonical patch chronology.
3. Changes in GitHub code do not imply a mod file was published or works with Madden27. GitHub releases contribute host metadata but not reviews.
4. Task requires interactive user session and available computer/network; there is no remote cloud monitor or independent SLA. Source outages are preserved in last-run receipts; Windows task LastTaskResult reflects process exit.
5. Source ledger local only; project Drive backup and central approval of source promotion are pending.
6. Previous npm advisories, unsigned installer, Nexus licensing and game compiler/runtime compatibility remain independent release blockers.

## Source impact and rollback

**Local files:** `scripts/mod-watch/{collector,cli,install-homepc-schedule.ps1}`, `desktop/lib/mod-watch-read.mjs`, `desktop/main.mjs`, `desktop/preload.cjs`, `src/desktop.d.ts`, `src/components/CommunityIntelligencePanel.{tsx,css}`, `tests/mod-watch*.mjs`, `package.json`, `docs/mod-intelligence/MOD_WATCH_OPERATIONS_V1.md`, this receipt.

**Rollback task only:** run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/mod-watch/install-homepc-schedule.ps1 -Remove` from the feature worktree. Do not delete the event ledger unless explicitly requested. **Rollback code only:** revert feature branch; the other local worktrees, main and original game files remain intact.

**Status:** ACTIVE_LOCAL_MONITOR, BUILD_AND_PACKAGED_SMOKE_VERIFIED, SOURCE_METADATA_ONLY.
**Next dependency:** permitted per-mod user-feedback source access and exact-build mod/game evidence for eventual quality/compatibility promotion.
**Next move:** inspect a creator-authorized Nexus API feedback source and implement a per-post ID plus installation-context provenance adapter before adding it to the daily schedule.
