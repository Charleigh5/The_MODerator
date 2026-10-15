# Nexus Review Adapter v0.1 — delivery / gauntlet receipt

**Date:** October 11, 2026, America/New_York
**Target:** Madden NFL 27 PC MODerator, private HOMEPC build
**Branch:** `feature/madden27-nexus-review-adapter-20261011` on `Charleigh5/The_MODerator`.
**Base commit:** `742646c` (existing live HOMEPC mod-source watch)
**Release promotion:** NO; no GitHub push/merge, no public deployment.

## Objective

Extend the prior source-watch and 37-record community intelligence system with rights-aware intake of first-person review evidence without operating an unauthorized Nexus comment scraper.

## Policy decision

Sources inspected:
- https://help.nexusmods.com/article/18-terms-of-service (current section 11 bans automated data mining and scraping, and AI/system development use without exemption)
- https://help.nexusmods.com/article/114-api-acceptable-use-policy (public app registration, no misuse of personal API keys)
- https://api-docs.nexusmods.com/ (current API surface; stable official per-mod comment contract not independently confirmed)

No Nexus credential requested, no API request sent, no site scraping or automated AI summarization of Nexus reviews, and no Nexus monitor registered with Task Scheduler. A written exemption and API contract would be required before such functions are unlocked. Author-submitted original commentary and separately licensed user-supplied summaries can be analyzed as local inputs, subject to permission review.

## Files changed

- `desktop/lib/nexus-review-offline.mjs`: strict user-supplied evidence pack schema, fields and URL allowlist, stable source/reviewer identity hashes, source context, issue/stance/role enums, duplicate handling, conflict preservation, provenance and hard rating gates.
- `desktop/main.mjs`: user-directed JSON import via native dialog, pending-inbox storage with local backup/fallback, fixed-path read IPC and smoke assertions.
- `desktop/preload.cjs`, `src/desktop.d.ts`: narrow, read-only snapshot + user-directed import functions; no unrestricted path access.
- `src/components/CommunityIntelligencePanel.tsx` / `.css`: import action, pending count and review issue/context display, explicit "no quality votes" boundary, scoring eligible-evidence seam.
- `tests/nexus-review-offline.mjs` and `package.json`: automated negative and positive test fixtures appended to full gauntlet.
- `docs/mod-intelligence/NEXUS_REVIEW_ADAPTER_v0.1.md`: source constraints, data contract, operations, rollback and next permission gate.

## Tests and evidence

- `git diff --check`: PASS (CRLF conversion warning nonfatal).
- `npm run typecheck`: PASS.
- `npm run gauntlet`: all preceding groups plus `NEXUS_REVIEW_OFFLINE_PASS` — PASS.
- `npm run build`: PASS.
- Electron development GUI smoke: PASS. 37 catalog entries, 37 assessment rows, 2 EA patch cards, 8 source-watch row examples, import control.
- Windows `npm run desktop:pack`: PASS, Electron 44.7.0 / Windows x64.
- Packaged Electron application smoke: exit `0`, `packaged=true`, `reviewAdapterReady=true`, `libraryCards=37`, `assessmentRows=37`.
- Screenshot visually reviewed: `%APPDATA%\moderator-desktop\desktop-nexus-review-adapter.png`.
- Packaged unsigned installer: `release/MODerator-Desktop-Setup-0.1.0.exe` · 111533417 bytes · SHA-256 `2B5510489CE10376D31EFF1668B0D12B63943FBB69FA8701AB5B37CAAF6E0A51` · Authenticode `NotSigned`.
- Packaged unsigned portable: `release/MODerator-Desktop-Portable-0.1.0.exe` · 111303308 bytes · SHA-256 `7D3008DFD61A4B0E3A15DF64E96FE1FF61EF7A4636FAA1F829B5A69E1592DAC2` · Authenticode `NotSigned`.

## Receipt: data and scoring

- Preexisting 37 catalog candidates, two official EA patches and 19 dated source research records are unchanged.
- Actual authorized user-supplied Nexus review packs imported: **0**.
- Actual Nexus comments fetched by adapter: **0**.
- Synthetic test records used for schema and dedup validation only; no synthetic test evidence promoted.
- Pending inbox entries: **0** at delivery.
- Independent verified user-quality votes derived from adapter: **0**.
- The scorer can accept future `CONFIRMED` evidence, but the import deliberately **cannot** produce confirmed status. Manual independent rights/source verification remains a separate future feature.

## Adversarial critique and correction

1. Initial implementation could have treated personal API access as permission to mine comments; source policy review blocked network integration and limited adapter to original/permissioned user submissions.
2. Import requires declared permission basis but such attestation is not independent proof. Every record remains pending, and full ratings are unchanged.
3. Source ID + reviewer ID stable numeric keys are hashed and never written in clear; hashing alone is pseudonymization, not full anonymity.
4. The adapter rejects unsupported title/mod mapping, invalid URLs, unrecognized fields, unknown collection modes, author-as-voter, duplicate post IDs, oversize files, and unapproved raw quote body fields.
5. Conflict reports for same post are retained rather than silently overwriting.
6. Local inbox read path forcibly clears any claimed `qualityVoteEligible`, `CONFIRMED`, or runtime-verified flags to prevent manual JSON edits from automatically promoting evidence.
7. Screenshot review captured the UI with the new import button and explicit pending/quality counters; supporting page remains scrollable.

## Pending tasks

- [x] Offline intake schema, stable pseudonymous IDs, roles, issue categories and installation scope.
- [x] Dedup/conflict validation, permission attestation, read-only snapshot and scoring seam.
- [x] Responsive native desktop import UI, full regression and packed desktop runtime QA.
- [ ] Confirm written Nexus permission or narrow API exemption and public app registration, if automated Nexus ingestion is still desired.
- [ ] Verify existence and stability of documented per-mod comments endpoint and identify sanctioned rate limits.
- [ ] Implement independent evidence/rights reviewer workflow before any submission affects quality scores.
- [ ] Obtain actual permissioned first-person review pack, run user-initiated UI import and reconcile conflict receipt.
- [ ] Conduct full privacy/security assessment before public deployment; signed installer and dependency remediation.

**Status:** IMPLEMENTED_LOCAL / TESTED / PERMISSION_REQUIRED_FOR_LIVE_NEXUS.
**Next dependency:** written Nexus exemption or direct first-person evidence explicitly licensed to MODerator.
**Next move:** source-governed review verification workflow; do not add Nexus to unattended polling until permitted.
**Rollback:** revert local branch. HOMEPC's existing `MODerator_Madden27_Mod_Watch` schedule remains untouched.
