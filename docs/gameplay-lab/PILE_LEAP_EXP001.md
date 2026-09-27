# CFB27 Gameplay Lab — EXP-001 Defender Pile-Leap

**Status:** READY_FOR_ASSET_DISCOVERY / RUNTIME_BLOCKED_CURRENT_BUILD  
**Target:** move `FTC-ANIM-TARGET` and related mechanics from TARGET toward BEHAVIOR_PROVEN without confusing ratings with movement physics.

## Source-grounded starting facts

1. EA's September 3, 2026 title update explicitly changed gameplay through animation selection/tuning (Zig-route cut animation and WR/DB jostle animation changes). That supports animation/tuning as a genuine gameplay-control surface, but does **not** identify a tackle/pile-leap asset.
2. CFB27 engine inventory research resolves gameplay tuning under `football/gameplay/attribsys/data/gameplay_tuning/...` and exposes animation assets through MMC/Frosty.
3. CharacterGameplay is game-verified for **throw/run/carry style**. Research-log #73/#76 also proves flat Player style fields were a no-op for the animation menu. It is therefore a negative control for this defensive tackle mechanic, not our pile-leap implementation path.
4. The Lua hook currently certifies only the July 11 and July 16 executable hashes. Runtime watch/call/write work on the current September build is blocked until its exact EXE is separately registered/certified.
5. HOMEPC was offline during lab setup, so no current EXE hash or in-game baseline could be captured from the authorized machine.

## Mechanic decomposition

`input trigger → eligibility → defensive animation selection → launch/root motion → target acquisition/reach → blocker collision → airborne contact → landing/recovery`

Ratings (Jumping/Tackle/HitPower) are **controls**, not assumed trajectory/physics variables.

## Fixed experimental scenario

Use one defensive player (prefer the same safety), one offensive formation/play, one defensive formation/alignment, same difficulty/sliders, same controller/user path, same stadium/weather where possible. Capture replay/video at ≥60 fps.

Minimum baseline: **20 repetitions** before any material gameplay edit.

Record each trial:
- whether an airborne/dive branch occurs;
- initiation distance;
- takeoff→contact frames/ms;
- apex-height proxy from replay framing;
- horizontal travel;
- whether blocker contact occurs before ballcarrier contact;
- whether ballcarrier contact occurs;
- tackle success / whiff / knockdown;
- landing/recovery time;
- unrelated regression.

## Conditions

- **C0 stock baseline** — no change.
- **C1 Jumping control** — one copied-save rating change only.
- **C2 Tackle control** — one copied-save rating change only.
- **C3 animation/selector candidate** — after exact asset discovery.
- **C4 root-motion candidate** — one parameter/asset edit.
- **C5 reach/target candidate** — one gameplay-tuning edit.
- **C6 blocker-collision candidate** — one gameplay/physics edit.
- **C7 runtime observation** — only after exact-build certification; observation first, guarded one-variable write second.

## Asset discovery pass

Generate or obtain the current-build inventory and score names/fields containing:
`tackle, dive, lunge, hitstick, collision, contact, defender, reach, airborne, locomotion, rootmotion, gameplay_tuning`.

For every candidate preserve:
asset path, type, superbundle/bundle, source hash/build, field names/types, stock values, and why it is connected to the mechanic.

Do not promote an asset because its name merely sounds relevant.

## Promotion ladder

`TARGET → CORRELATED → WRITE_PROVEN → RUNTIME_PROVEN → BEHAVIOR_PROVEN`

BEHAVIOR_PROVEN requires:
- exact recorded game build;
- immutable baseline;
- isolated one-variable change;
- successful package/readback;
- measurable behavior difference;
- at least two independent replicated runs;
- no contradictory regression evidence.

## Current stop condition

The authorized HOMEPC is offline and the Lua-hook build registry does not certify the current September game build. Therefore this turn can complete the experiment software, source map, and static gauntlet, but **cannot truthfully complete the in-game behavior promotion**.
