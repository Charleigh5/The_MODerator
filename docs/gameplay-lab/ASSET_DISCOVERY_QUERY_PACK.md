# Pile-Leap Asset Discovery Query Pack

Run against a **current-build** CFB27 asset inventory. The upstream inventory generator is documented in `eric-levinson/cfb27-dynasty-modding/franchise-lab/frosty/inventory.py`.

## Search families
- tackle / tackling / defender tackle
- dive / diving / lunge / launch
- hit stick / hitstick / knockout / contact
- collision / contact / obstacle / blocker
- reach / target / acquisition / attach
- airborne / jump / leap
- root motion / locomotion
- gameplay tuning / attribsys
- recovery / getup / landing

## Candidate acceptance fields
For each hit capture:
- exact asset path/name;
- EBX/RES/CHUNK/type;
- bundle/superbundle;
- build + source hash;
- typed field names and stock values;
- why the candidate maps to a mechanic component;
- whether it can be isolated to one variable;
- package/readback method.

## Rejection rules
Reject candidates that are only:
- presentation strings;
- unrelated offensive animation styles;
- save-side CharacterGameplay throw/run/carry records;
- ratings fields without a direct engine-mechanics link;
- names that sound relevant but have no inspectable field/asset behavior.

Use `node scripts/gameplay-lab/filter-asset-inventory.mjs <inventory.tsv> <out.json>` for first-pass ranking.