import type { Platform, PatternDef, ModEntry } from "../types";

export const PLATFORMS: Platform[] = [
  { id: "cfbvault", name: "CFB Vault", url: "cfbvault.gg", mods: 1204, status: "online" },
  { id: "modaxis", name: "ModAxis", url: "modaxis.io", mods: 862, status: "online" },
  { id: "lockerroom", name: "The Locker Room", url: "lockerroom.mods", mods: 431, status: "syncing" },
  { id: "openplay", name: "OpenPlaybooks", url: "openplaybooks.dev", mods: 296, status: "online" },
];

export const PATTERNS: PatternDef[] = [
  { id: "p_init", name: "OnInit(mod_ctx)", kind: "Hook", source: "CFB Core SDK" },
  { id: "p_recruit_hook", name: "OnRecruitDecision(ctx)", kind: "Hook", source: "Recruiting Overhaul '26" },
  { id: "p_clamp", name: "ClampRating(v, lo, hi)", kind: "Block", source: "Recruiting Overhaul '26" },
  { id: "p_bias", name: "conference_bias[13]", kind: "VarTable", source: "Recruiting Overhaul '26" },
  { id: "p_weather_sys", name: "WeatherSystem(seed, region)", kind: "Block", source: "True Weather Systems" },
  { id: "p_windvec", name: "WindVector.apply(pass)", kind: "Block", source: "True Weather Systems" },
  { id: "p_crowd", name: "OnCrowdNoise(db)", kind: "Hook", source: "Saturday Atmosphere Pack" },
  { id: "p_momentum", name: "MomentumShift(delta)", kind: "Block", source: "Saturday Atmosphere Pack" },
  { id: "p_playcall", name: "OnPlaycall(ctx, down, dist)", kind: "Hook", source: "Veer & Shoot Playbook" },
  { id: "p_formpkg", name: "PersonnelPackage(id)", kind: "Block", source: "Veer & Shoot Playbook" },
  { id: "p_q4cpu", name: "LateGameIQ(profile)", kind: "Block", source: "CPU Coordinator Brain" },
  { id: "p_rubber", name: "RubberBand.strip()", kind: "Block", source: "CPU Coordinator Brain" },
  { id: "p_redzone", name: "RedZoneAggression(pct)", kind: "Block", source: "CPU Coordinator Brain" },
  { id: "p_clock_schema", name: "ClockRules.schema", kind: "Schema", source: "Clock Kings" },
  { id: "p_targeting", name: "OnTargetingReview(play)", kind: "Hook", source: "Clock Kings" },
  { id: "p_injury", name: "InjuryModel(severity)", kind: "Block", source: "Redshirt Realism" },
];

export const STARTER_KB_IDS = [
  "p_init",
  "p_recruit_hook",
  "p_clamp",
  "p_weather_sys",
  "p_playcall",
  "p_clock_schema",
];

export const MODS: ModEntry[] = [
  {
    id: "m_recruit",
    name: "Recruiting Overhaul '26",
    platform: "CFB Vault",
    version: "v2.3.1",
    schema: "ncaa27-mod/3.1",
    blocks: 48,
    reliability: 98,
    downloads: "112k",
    tags: ["recruiting", "portal", "AI"],
    patternIds: ["p_recruit_hook", "p_clamp", "p_bias"],
    excerpt: `-- Recruiting Overhaul '26 · core governor
Game.hooks.on("OnRecruitDecision", function(ctx)
  local bias = VarTable.get("conference_bias")[ctx.conf]
  ctx.interest = ctx.interest * (bias or 1.0)
  ctx.interest = ClampRating(ctx.interest, 0, 100)
  return ctx
end)`,
  },
  {
    id: "m_weather",
    name: "True Weather Systems",
    platform: "ModAxis",
    version: "v1.8.0",
    schema: "ncaa27-mod/3.1",
    blocks: 36,
    reliability: 96,
    downloads: "87k",
    tags: ["weather", "wind", "broadcast"],
    patternIds: ["p_weather_sys", "p_windvec"],
    excerpt: `-- True Weather Systems · front generator
local wx = WeatherSystem(seed, region)
wx.fronts:drift(dt)
if wx.cell.intensity > 0.6 then
  WindVector.apply(pass, wx.wind)
end`,
  },
  {
    id: "m_veer",
    name: "Veer & Shoot Playbook",
    platform: "The Locker Room",
    version: "v3.0.2",
    schema: "ncaa27-mod/3.1",
    blocks: 61,
    reliability: 94,
    downloads: "64k",
    tags: ["playbook", "option", "spread"],
    patternIds: ["p_playcall", "p_formpkg"],
    excerpt: `-- Veer & Shoot · option mesh read
Game.hooks.on("OnPlaycall", function(ctx, down, dist)
  if ctx.scheme == "veer" and dist <= 4 then
    return PersonnelPackage("11-option")
  end
  return ctx.pkg
end)`,
  },
  {
    id: "m_atmos",
    name: "Saturday Atmosphere Pack",
    platform: "CFB Vault",
    version: "v2.1.4",
    schema: "ncaa27-mod/3.1",
    blocks: 29,
    reliability: 97,
    downloads: "98k",
    tags: ["crowd", "stadium", "night"],
    patternIds: ["p_crowd", "p_momentum"],
    excerpt: `-- Saturday Atmosphere · noise → false start
Game.hooks.on("OnCrowdNoise", function(db)
  if db > 108 then
    MomentumShift(-0.4, offense)
    officiating.falseStartBias = 0.22
  end
end)`,
  },
  {
    id: "m_cpu",
    name: "CPU Coordinator Brain",
    platform: "ModAxis",
    version: "v4.2.0",
    schema: "ncaa27-mod/3.1",
    blocks: 83,
    reliability: 99,
    downloads: "141k",
    tags: ["AI", "difficulty", "coordinator"],
    patternIds: ["p_q4cpu", "p_rubber", "p_redzone"],
    excerpt: `-- Coordinator Brain · late-game profile
if quarter == 4 and margin <= 7 then
  cpu.profile = LateGameIQ("closer")
  RubberBand.strip()          -- no catch-up scripting
  cpu.redZone = RedZoneAggression(0.85)
end`,
  },
  {
    id: "m_clock",
    name: "Clock Kings",
    platform: "OpenPlaybooks",
    version: "v1.3.7",
    schema: "ncaa27-mod/3.1",
    blocks: 22,
    reliability: 92,
    downloads: "31k",
    tags: ["clock", "rules", "penalties"],
    patternIds: ["p_clock_schema", "p_targeting"],
    excerpt: `-- Clock Kings · runoff policy
Game.hooks.on("ClockRules", function(c)
  c.firstDownRunoff = true
  c.spikeWindow = 0.9   -- seconds, stock is 0.4
  return c
end)`,
  },
  {
    id: "m_portal",
    name: "Transfer Portal Chaos",
    platform: "The Locker Room",
    version: "v0.9.9-beta",
    schema: "ncaa27-mod/3.0",
    blocks: 41,
    reliability: 88,
    downloads: "52k",
    tags: ["portal", "recruiting"],
    patternIds: ["p_recruit_hook", "p_bias"],
    excerpt: `-- Portal Chaos · spring window surge
Game.hooks.on("PortalWindow", function(w)
  if w.season == "spring" then
    w.entryRate = w.entryRate * 2.4
  end
end)`,
  },
  {
    id: "m_redshirt",
    name: "Redshirt Realism",
    platform: "OpenPlaybooks",
    version: "v1.1.2",
    schema: "ncaa27-mod/3.1",
    blocks: 18,
    reliability: 95,
    downloads: "27k",
    tags: ["progression", "injuries"],
    patternIds: ["p_injury"],
    excerpt: `-- Redshirt Realism · medical chart
Game.hooks.on("OnInjury", function(play)
  play.severity = InjuryModel(play.contact)
  if play.gamesMissed > 4 then redshirt.burn = false end
end)`,
  },
  {
    id: "m_sound",
    name: "Stadium Soundstage",
    platform: "CFB Vault",
    version: "v1.6.0",
    schema: "ncaa27-mod/3.1",
    blocks: 25,
    reliability: 93,
    downloads: "45k",
    tags: ["audio", "crowd", "band"],
    patternIds: ["p_crowd"],
    excerpt: `-- Soundstage · crowd stem layering
Audio.layers.crowd:setStems({
  base = 0.6, chant = crowd.momentum,
  band = (band.on and 0.4) or 0
})`,
  },
];

export const TICKER_ITEMS = [
  "CFB VAULT · 1,204 mods indexed",
  "MODAXIS sync OK · 862 mods",
  "THE LOCKER ROOM · re-syncing 431 mods",
  "OPENPLAYBOOKS · 296 mods verified",
  "schema ncaa27-mod/3.1 · stable",
  "game target: NCAA Football 27 · build ≥1.0.3841",
  "hook-conflict scanner armed",
  "KB warm · patterns ready to weave",
];
