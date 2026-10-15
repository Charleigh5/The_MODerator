# MODerator Madden 27 — Recurring Source Watch v0.1

**Authority:** source observations and host metadata, not mod binary/game-run proof.
**Operating mode:** read-only public-source polling; HOMEPC Task Scheduler, 09:00 America/New_York daily when the user is signed in. Windows StartWhenAvailable enabled. Uses installed Node.js v24 at `C:\Program Files\nodejs\node.exe`.
**Task name:** `MODerator_Madden27_Mod_Watch`.
**Runtime:** `%APPDATA%\moderator-desktop\watch-runtime\` (independent of Git feature worktree).
**Ledger:** `%APPDATA%\moderator-desktop\mod-watch\` (`state.json`, `latest.json`, `last-run.json`, optional `.previous` recovery files).

## Sources and trust

| Source | Endpoint | Verification promoted |
| --- | --- | --- |
| EA official Madden NFL 27 news | https://www.ea.com/games/madden-nfl/madden-nfl-27/news | Only first-party source-link presence. New patch candidates require a human to verify exact effective date, build, affected features. |
| FMTDev/FMT.Madden26Plugin | Public GitHub releases + commits via `api.github.com` | Official GitHub repository release/commit *metadata*, not software safety or Madden27 runtime success. |
| bphit4/MMC-Frosty-Modding-Tools | Public GitHub releases + commits via `api.github.com` | Same. |
| bep713/madden-franchise | Public GitHub releases + commits via `api.github.com` | Same. |

The collector checks **seven endpoints**, does not clone repositories, download binaries, bypass anti-cheat, modify games or send notifications. GitHub's public releases endpoint can be read without authentication: https://docs.github.com/en/rest/releases/releases. Official EA notes index: https://www.ea.com/games/madden-nfl/madden-nfl-27/news.

**Not yet automated:** Nexus Mods comments / new mods, Reddit first-person ratings, Discord announcements. Nexus developer APIs and acceptable use policy are at https://api-docs.nexusmods.com/ and https://help.nexusmods.com/article/114-api-acceptable-use-policy; authenticated access, user consent and per-post stable identifiers are needed before adding these lanes. Do not covertly scrape private Discord channels or bypass website access controls.

## Data contract

- Initial run: `INITIAL_BASELINE` entries capture current source history. Do NOT call these 'newly released today'.
- Subsequent run: only never-seen provider IDs/commit SHA/EA page slugs are `NEW_SOURCE_ITEM`. Duplicate data is not emitted on repeated polls.
- Source requests: HTTPS allowlisted GitHub API/EA official host and paths, 12s timeout, 700KB body maximum, manual redirect denial, content-type and schema validation.
- Collector lock and task's `MultipleInstances IgnoreNew` prevent normal overlapping writes. Failed source requests never fabricate new events. All-source failure leaves last good snapshot intact. Windows updates use bounded rename retries and `.previous` recovery fallback.
- A new GitHub **release** may contribute `HOST_METADATA` to the app's existing evidence-coverage rubric; commits are displayed as observed code activity and never count as satisfaction reviews. EA news headlines are review candidates; they do not automatically append verified game patches.
- No event changes player quality ratings or `gameRuntimeVerified`. A mod remains `NOT RATED` until the separately governed independent-player sample and exact-build human-reviewed runtime gates pass.
- Application bridge reads only the fixed local snapshot path and exports a host-validated, field-allowlisted view; it cannot accept arbitrary file paths or trusted game claims from the state file.
- Per-run machine-readable receipt uses `runId`, `sourceId`, status and item counts. No credentials are stored or transmitted; public endpoints only.

## Operator commands (HOMEPC PowerShell)

From `scripts/mod-watch` within the current feature worktree:

```powershell
node .\cli.mjs
powershell -NoProfile -ExecutionPolicy Bypass -File .\install-homepc-schedule.ps1 -At 09:00
Get-ScheduledTaskInfo -TaskName MODerator_Madden27_Mod_Watch
Start-ScheduledTask -TaskName MODerator_Madden27_Mod_Watch
powershell -NoProfile -ExecutionPolicy Bypass -File .\install-homepc-schedule.ps1 -Remove
```

Removal unregisters the task but does not destroy the event history. There is no background polling when HOMEPC is offline; StartWhenAvailable retries on eligible next opportunity. If the installed Node.js runtime is removed/replaced, re-run the installer script. If the user is signed out for long periods, interactive task availability may be limited.

## QA and receipt

- 2026-10-10 live initial: seven successful feeds, 15 EA existing news links, 5 FMT commits, 4 MMC releases + 5 MMC commits, 5 franchise-parser commits; **34 baseline events** in total; zero game-tested mods.
- Second live run: 0 new events; duplicate suppression confirmed.
- Windows task registered: daily 09:00, next run 2026-10-11 09:00 local; manual scheduler execution confirmed `LastTaskResult=0`, last-run `status=OK`, 0 additions.
- Repeated-run Windows `EPERM` replacement defect was found in live QA and repaired with bounded retry, backup-and-restore, and state-recovery fallback before scheduler enablement.
- `tests/mod-watch.mjs`: baseline, new item, duplicate suppression, partial/total failure, last good preserved, disallowed host.
- `tests/mod-watch-bridge.mjs`: reject spoofed game proof, oversize snapshots, untrusted URLs, path-like IDs.
- `npm run typecheck`, `npm run gauntlet`, `npm run build`, Electron desktop smoke, screenshot `%APPDATA%\moderator-desktop\desktop-mod-watch.png`: PASS after integration.
- The collector and local monitor are implemented. This is NOT a live public cloud service, user-comment sentiment crawler, or verified mod compiler.

## Follow-on roadmap

- [ ] Nexus official API consent/credential and read-only mod review ingestion with stable comment IDs; no quality-rating imputation from anonymous repeats.
- [ ] Discord opt-in creator announcement ingestion with explicit permissions and provenance.
- [ ] Patch-executable build identification + human review/promotion of EA headline candidates.
- [ ] Per-mod package SHA-256, build-specific proof, install/conflict graphs, rollback receipts.
- [ ] Backup/restore durable event ledger to approved `MY AI/` governance location.
- [ ] Signed Windows installer, security reviews, license/provenance approvals and GitHub push/PR gate.

**Rollback:** unregister `MODerator_Madden27_Mod_Watch` and revert the isolated feature branch. Preserve or export the append-only local history before deleting user data. No game files or public repository refs were modified.
