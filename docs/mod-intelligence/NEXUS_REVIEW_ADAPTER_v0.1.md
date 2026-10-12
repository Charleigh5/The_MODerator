# MODerator — Nexus Review Adapter v0.1

**Date:** 2026-10-11 · **Target:** Madden NFL 27 PC · **Mode:** `OFFLINE_USER_SUPPLIED_ONLY`
**Live Nexus API:** NOT CONNECTED · **Nexus scraping:** DISABLED · **Daily Nexus scheduler:** NOT ENABLED
**Data quality:** `PENDING_SOURCE_AND_RIGHTS_VERIFICATION`; quality votes: zero.

## Authority and policy review

**Nexus API acceptable-use:** https://help.nexusmods.com/article/114-api-acceptable-use-policy
- Personal API keys are tolerated for private testing/personal use; public-facing apps must register through support.
- Must identify the application correctly. Server-side storage of personal keys, unapproved public key usage and bulk scraping are disallowed.
**Current Nexus Terms of Service:** https://help.nexusmods.com/article/18-terms-of-service
- Section 11 explicitly restricts text/data mining, automated collection/monitoring and using their data to develop/train/validate AI. Ask `support@nexusmods.com` for an exemption before deploying any automated comment-monitoring or analysis.
- Public Nexus API docs: https://api-docs.nexusmods.com/ (v3 and legacy APIs). A supported, access-authorized, stable mod-comment endpoint for this precise application was **not confirmed**.
- Do NOT treat a personal API key, a public URL, a user attestation, or a tool claiming an undocumented GraphQL endpoint as authorization to mine forum/review content.
- The adapter imports **original review summaries explicitly provided for this app with appropriate rights**, not Nexus page contents or automatic site transcripts. Users should never paste another person's protected commentary without authorization.

## Record contract

The JSON pack `MODERATOR_NEXUS_REVIEW_PACK_V1` must include `game:"MADDEN27"`, `collectionMode:"USER_SUPPLIED_ONLY"`, `permission.basis`, `permission.reference`, `permission.attestation:true`, and between 1 and 40 validated records. All IDs must be source-native opaque *numeric* Nexus post and reviewer identifiers. Only the currently mapped Nexus roster `mod-001` is accepted. Dates and schema cannot be inferred.

Required record fields: `postId`, `reviewerId`, `modId`, `sourceUrl`, `postedAt`, `role`, `stance`, `scope`, `issueKey`, `gameBuild` (string or null), `summary` (15–240 chars). The summary is a brief permission-cleared original description, never a scraped full post. No raw review `body`, images, executable scripts, embedded HTML or arbitrary fields are accepted.

Allowed:
- `role`: PLAYER_REPORT / AUTHOR_RESPONSE. Authors never count as player votes.
- `stance`: FAVORABLE / UNFAVORABLE / MIXED / NEUTRAL.
- `scope`: LEGITIMATE_GAME_CLAIM / UNOFFICIAL_REPACK / UNSPECIFIED (context is reported, never independently established by import).
- `issueKey`: PLAYER_APPEARANCE / ROSTER_RATINGS / INSTALLATION / COMPATIBILITY / PERFORMANCE / FRANCHISE / GAMEPLAY / OTHER.
- `permission.basis`: REVIEWER_DIRECT_SUBMISSION / RIGHTS_HOLDER_WRITTEN_PERMISSION / NEXUS_WRITTEN_EXEMPTION. All are user-attested and pending independent verification, not automatic rights grants.

Records are pseudonymized with deterministic SHA-256 reviewer/post keys; **hashing alone is not full anonymization** and small numeric provider IDs can sometimes be guessed. No names, raw bodies or plaintext permission references are persisted. Source URL and user's original short summary are stored. Don't use this for sensitive personal information.

## Workflow

Open **MODerator Desktop → Mod Intelligence Library → Community Quality Audit → Import authorized JSON pack**. Desktop displays a native JSON file chooser, checks size and strict contract, merges by stable source post identity, and reports additions vs conflicts. Conflicting changes to the same post never silently overwrite the earlier entry. Import is a user-directed write to local `%APPDATA%\moderator-desktop\nexus-review-inbox.json`, not an external write.

All records are surfaced as **PENDING PERMISSION REVIEW**; no rating is granted by an import. The bridge force-resets imported records' `qualityVoteEligible:false` and `gameRuntimeVerified:false` even if a local file is tampered with. The Community Intelligence scorer is explicitly wired to a future `CONFIRMED` gate but receives zero eligible entries until a separate human/source verification workflow is implemented. The existing 37-item catalog and 19 dated research records remain intact.

The GitHub/EA seven-feed daily HOMEPC source watch remains independent and unchanged. No scheduled Nexus access has been added.

## QA / remaining gate

- `tests/nexus-review-offline.mjs`: stable identities, no raw source ID in output, pack size/field allowlist, source host/path, rejected collection modes, permission attestations, author-neutral rule, duplicate and conflict handling; PASS.
- Strict typecheck, inherited full gauntlet and production build must pass before committing; actual Electron desktop smoke verifies new import control renders.
- Untested until source grant: actual authorized user review JSON and UI-dialog import on real content.
- Next dependency: (A) original, independently permission-cleared first-person contributor evidence, or (B) written Nexus approval for a specified API use case, including rights to analyze comments, stable API contract and a public-facing application registration. No credential requested at this stage.
- Rollback: revert isolated feature worktree; preserve local user submissions unless the user explicitly requests removal. HOMEPC existing daily watch and other worktrees remain intact.
