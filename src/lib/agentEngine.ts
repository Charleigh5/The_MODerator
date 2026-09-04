import type { CategoryId, QAQuestion, GenFile, BundleMeta, PatternDef } from "../types";
import { MODS, PATTERNS, STARTER_KB_IDS } from "../data/modLibrary";

/* ---------------- helpers ---------------- */

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 42) || "custom-tweak"
  );
}

export function hashStr(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function starterKb(): PatternDef[] {
  return PATTERNS.filter((p) => STARTER_KB_IDS.includes(p.id));
}

function intOf(chip: string, fallback: number): number {
  const m = chip.match(/-?\d+(\.\d+)?/);
  return m ? Math.round(parseFloat(m[0])) : fallback;
}

function floatOf(chip: string, fallback: number): number {
  const m = chip.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : fallback;
}

function jsonStr(v: string): string {
  return JSON.stringify(v);
}

/* ---------------- file builders ---------------- */

interface HookSpec {
  event: string;
  entry: string;
  via: string;
  from: string;
}

interface PropSpec {
  name: string;
  type: "string" | "number" | "boolean";
  desc: string;
  def: string;
  enumVals?: string[];
}

interface VarSpec {
  name: string;
  type: "string" | "int" | "float" | "bool";
  value: string;
  note: string;
}

function buildManifest(
  meta: { slug: string; title: string; id: string; hash: string },
  hooks: HookSpec[],
  entry: string,
  schema: string,
  vars: string,
  kb: PatternDef[]
): string {
  const sources = Array.from(new Map(kb.map((k) => [k.source, k])).values()).slice(0, 4);
  const learned = sources
    .map((k) => {
      const mod = MODS.find((m) => m.name === k.source);
      return `    { "mod": ${jsonStr(k.source)}, "version": ${jsonStr(
        mod ? mod.version : "core"
      )}, "patterns_used": ${kb.filter((x) => x.source === k.source).length} }`;
    })
    .join(",\n");
  const hookLines = hooks
    .map((h) => `    { "event": ${jsonStr(h.event)}, "entry": ${jsonStr(h.entry)} }`)
    .join(",\n");
  return `{
  "manifest_version": "ncaa27-mod/3.1",
  "id": ${jsonStr(meta.id)},
  "name": ${jsonStr(meta.title)},
  "author": "Gridiron Forge // CODEWRIGHT",
  "target": { "game": "NCAA Football 27", "build": ">=1.0.3841", "schema": "ncaa27-mod/3.1" },
  "entry": ${jsonStr(entry)},
  "schema": ${jsonStr(schema)},
  "variables": ${jsonStr(vars)},
  "hooks": [
${hookLines}
  ],
  "learned_from": [
${learned}
  ],
  "signature": ${jsonStr(meta.hash)}
}`;
}

function buildSchema(title: string, props: PropSpec[]): string {
  const propLines = props
    .map((p) => {
      const enumPart = p.enumVals ? `,\n      "enum": [${p.enumVals.map(jsonStr).join(", ")}]` : "";
      return `    ${jsonStr(p.name)}: {
      "type": ${jsonStr(p.type)},
      "description": ${jsonStr(p.desc)},
      "default": ${p.def}${enumPart}
    }`;
    })
    .join(",\n");
  const required = props.map((p) => jsonStr(p.name)).join(", ");
  return `{
  "$schema": "ncaa27-mod/3.1/schema",
  "title": ${jsonStr(title + " — tunables")},
  "type": "object",
  "additionalProperties": false,
  "properties": {
${propLines}
  },
  "required": [${required}]
}`;
}

function buildVarsXml(table: string, vars: VarSpec[]): string {
  const rows = vars
    .map(
      (v) =>
        `  <!-- ${v.note} -->\n  <Var name="${v.name}" type="${v.type}">${v.value}</Var>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<VarTable name="${table}" schema="ncaa27-mod/3.1" hotreload="true">
${rows}
</VarTable>`;
}

function buildLua(
  headerNote: string,
  hooks: HookSpec[],
  body: string[]
): string {
  const hookList = hooks.map((h) => `--  hook ${h.event}  ←  ${h.via} (${h.from})`).join("\n");
  return `-- ============================================================
--  ${headerNote}
--  woven by CODEWRIGHT · patterns cited inline · do not hand-edit
${hookList}
-- ============================================================
local VarTable = require("ncaa27.vartable")
local cfg      = VarTable.load("mod_vars")

${body.join("\n")}

return { healthy = true, cfg = cfg }`;
}

/* ---------------- category scripts ---------------- */

export interface CategoryDef {
  id: CategoryId;
  label: string;
  code: string;
  keywords: string[];
  opener: (brief: string) => string;
  questions: QAQuestion[];
  build: (a: Record<string, string>, brief: string, kb: PatternDef[]) => BundleMeta;
}

function finalize(
  cat: CategoryDef,
  title: string,
  entryName: string,
  hooks: HookSpec[],
  props: PropSpec[],
  vars: VarSpec[],
  luaBody: string[],
  brief: string,
  kb: PatternDef[]
): BundleMeta {
  const slug = slugify(title);
  const id = `gf.${slug}`;
  const hash = hashStr(id + brief + JSON.stringify(vars));
  const meta = { slug, title, id, hash };
  const files: GenFile[] = [
    {
      path: `${slug}/manifest.json`,
      lang: "json",
      content: buildManifest(meta, hooks, `logic/${entryName}.lua`, `schema/${entryName}.schema.json`, `variables/${entryName}_vars.xml`, kb),
      bytes: 0,
    },
    { path: `${slug}/schema/${entryName}.schema.json`, lang: "json", content: buildSchema(title, props), bytes: 0 },
    { path: `${slug}/logic/${entryName}.lua`, lang: "lua", content: buildLua(`${id} · ${entryName}.lua`, hooks, luaBody), bytes: 0 },
    { path: `${slug}/variables/${entryName}_vars.xml`, lang: "xml", content: buildVarsXml(`${entryName}_vars`, vars), bytes: 0 },
  ];
  files.forEach((f) => (f.bytes = new TextEncoder().encode(f.content).length));
  return {
    title,
    slug,
    id,
    version: "1.0.0",
    hash,
    category: cat.id,
    blocksLinked: 8 + kb.length * 2,
    kbUsed: kb.slice(0, 6),
    files,
  };
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "recruiting",
    label: "Recruiting Engine",
    code: "RCR",
    keywords: ["recruit", "portal", "transfer", "commit", "poach", "offer", "signing", "stars", "visit"],
    opener: () =>
      "Read you loud, coach — you want the recruiting engine rewired. I've run this route before: blocks from \"Recruiting Overhaul '26\" and \"Transfer Portal Chaos\" are already warm in my head. Four quick questions, then I write the bundle.",
    questions: [
      { key: "scope", label: "Blast radius", ask: "Q1/4 — Blast radius. What does this rule apply to?", chips: ["National", "Conference only", "My program only"] },
      { key: "intensity", label: "CPU intensity", ask: "Q2/4 — How aggressive should CPU coaches recruit, 1–10?", chips: ["4 — mild", "7 — realistic", "10 — bloodbath"] },
      { key: "poaching", label: "Poach policy", ask: "Q3/4 — Can CPU coaches poach your commits?", chips: ["No poaching", "Soft poach only", "Full chaos"] },
      { key: "homeboost", label: "Home-state bonus", ask: "Q4/4 — Home-state interest multiplier?", chips: ["1.2x", "1.5x", "2.0x", "Off"] },
    ],
    build: (a, brief, kb) => {
      const poach = a.poaching?.toLowerCase().includes("no") ? "off" : a.poaching?.toLowerCase().includes("soft") ? "soft" : "full";
      const boost = a.homeboost?.toLowerCase() === "off" ? 0 : floatOf(a.homeboost ?? "", 1.2);
      const scope = a.scope?.toLowerCase().includes("conf") ? "conference" : a.scope?.toLowerCase().includes("program") ? "program" : "national";
      const intensity = intOf(a.intensity ?? "", 7);
      const cat = CATEGORIES[0];
      const hooks: HookSpec[] = [
        { event: "OnRecruitDecision", entry: "recruit_engine.applyPolicy", via: "OnRecruitDecision(ctx)", from: "Recruiting Overhaul '26" },
        { event: "OnInit", entry: "recruit_engine.boot", via: "OnInit(mod_ctx)", from: "CFB Core SDK" },
      ];
      const props: PropSpec[] = [
        { name: "scope", type: "string", desc: "Who the policy governs", def: jsonStr(scope), enumVals: ["national", "conference", "program"] },
        { name: "cpu_intensity", type: "number", desc: "CPU recruiting aggression, 1–10", def: String(intensity) },
        { name: "poach_mode", type: "string", desc: "Commit-poaching policy vs. the player", def: jsonStr(poach), enumVals: ["off", "soft", "full"] },
        { name: "home_boost", type: "number", desc: "Interest multiplier for in-state recruits (0 = off)", def: String(boost) },
      ];
      const vars: VarSpec[] = [
        { name: "scope", type: "string", value: scope, note: a.scope ?? "national" },
        { name: "cpu_intensity", type: "int", value: String(intensity), note: a.intensity ?? "7 — realistic" },
        { name: "poach_mode", type: "string", value: poach, note: a.poaching ?? "default" },
        { name: "home_boost", type: "float", value: String(boost), note: a.homeboost ?? "1.2x" },
      ];
      const lua = [
        `-- block: ClampRating ← Recruiting Overhaul '26`,
        `local function clamp(v, lo, hi) return math.max(lo, math.min(hi, v)) end`,
        ``,
        `local function boot(ctx)`,
        `  Game.log("[${`gf`}] recruit engine online · scope=" .. cfg.scope)`,
        `end`,
        ``,
        `Game.hooks.on("OnInit", boot)`,
        ``,
        `Game.hooks.on("OnRecruitDecision", function(ctx)`,
        `  if cfg.scope == "conference" and ctx.recruit.conf ~= ctx.program.conf then return ctx end`,
        `  if cfg.scope == "program"  and ctx.actor.id ~= ctx.program.id        then return ctx end`,
        ``,
        `  -- home-state interest spike`,
        `  if cfg.home_boost > 0 and ctx.recruit.homeState == ctx.program.state then`,
        `    ctx.interest = ctx.interest * cfg.home_boost`,
        `  end`,
        ``,
        `  -- poach governor (CPU touching YOUR commits)`,
        `  if ctx.actor.isCPU and ctx.target.committedTo == ctx.program.id then`,
        `    if cfg.poach_mode == "off"  then return Game.block(ctx) end`,
        `    if cfg.poach_mode == "soft" then ctx.pressure = ctx.pressure * 0.35 end`,
        `  end`,
        ``,
        `  ctx.cpuAggression = clamp(cfg.cpu_intensity, 1, 10) / 10`,
        `  ctx.interest      = clamp(ctx.interest, 0, 100)`,
        `  return ctx`,
        `end)`,
      ];
      return finalize(cat, "No-Poach Recruiting Engine", "recruit_engine", hooks, props, vars, lua, brief, kb);
    },
  },
  {
    id: "playbook",
    label: "Playbook / Schemes",
    code: "PLY",
    keywords: ["playbook", "play", "offense", "option", "spread", "formation", "audible", "tempo", "scheme", "run game", "passing"],
    opener: () =>
      "Got it — scheme work. My playbook shelf is stocked: \"Veer & Shoot Playbook\" gives me the mesh-read blocks and clean personnel packaging. Nail down four calls and I'll draw it up.",
    questions: [
      { key: "scheme", label: "Scheme family", ask: "Q1/4 — Base scheme family?", chips: ["Triple option", "Spread / tempo", "Pro-style", "Air raid"] },
      { key: "frequency", label: "AI call rate", ask: "Q2/4 — How often should the CPU actually call it?", chips: ["Situational", "25% of snaps", "40%+ of snaps"] },
      { key: "personnel", label: "Personnel", ask: "Q3/4 — Personnel grouping policy?", chips: ["Auto-fit", "Force 11 personnel", "Force heavy (21)"] },
      { key: "tempo", label: "Tempo / clock", ask: "Q4/4 — Tempo's effect on the game clock?", chips: ["Real tempo rules", "No clock change", "Chaos tempo"] },
    ],
    build: (a, brief, kb) => {
      const scheme = (a.scheme ?? "Spread / tempo").toLowerCase().replace(/[^a-z]+/g, "_").replace(/^_|_$/g, "");
      const freq = a.frequency?.includes("25") ? 0.25 : a.frequency?.includes("40") ? 0.42 : -1;
      const pkg = a.personnel?.includes("11") ? "11-auto" : a.personnel?.includes("heavy") ? "21-heavy" : "auto-fit";
      const tempo = a.tempo?.toLowerCase().includes("real") ? "real" : a.tempo?.toLowerCase().includes("chaos") ? "chaos" : "neutral";
      const cat = CATEGORIES[1];
      const hooks: HookSpec[] = [
        { event: "OnPlaycall", entry: "scheme_engine.call", via: "OnPlaycall(ctx, down, dist)", from: "Veer & Shoot Playbook" },
        { event: "OnTempo", entry: "scheme_engine.tempo", via: "ClockRules.schema", from: "Clock Kings" },
      ];
      const props: PropSpec[] = [
        { name: "scheme", type: "string", desc: "Scheme family injected into CPU & player playbooks", def: jsonStr(scheme) },
        { name: "ai_call_rate", type: "number", desc: "CPU call frequency (-1 = situational)", def: String(freq) },
        { name: "personnel_pkg", type: "string", desc: "Grouping policy", def: jsonStr(pkg) },
        { name: "tempo_mode", type: "string", desc: "Clock behavior under hurry-up", def: jsonStr(tempo), enumVals: ["real", "neutral", "chaos"] },
      ];
      const vars: VarSpec[] = [
        { name: "scheme", type: "string", value: scheme, note: a.scheme ?? "spread" },
        { name: "ai_call_rate", type: "float", value: String(freq), note: a.frequency ?? "situational" },
        { name: "personnel_pkg", type: "string", value: pkg, note: a.personnel ?? "auto-fit" },
        { name: "tempo_mode", type: "string", value: tempo, note: a.tempo ?? "neutral" },
      ];
      const lua = [
        `-- block: PersonnelPackage(id) ← Veer & Shoot Playbook`,
        `local SCHEME = cfg.scheme`,
        ``,
        `Game.hooks.on("OnPlaycall", function(ctx, down, dist)`,
        `  local want = (cfg.ai_call_rate < 0)`,
        `      and (dist <= 3 or ctx.fieldPos == "redzone")   -- situational`,
        `      or (math.random() < cfg.ai_call_rate)`,
        `  if not want then return ctx.pkg end`,
        ``,
        `  ctx.scheme = SCHEME`,
        `  if cfg.personnel_pkg ~= "auto-fit" then`,
        `    ctx.pkg = PersonnelPackage(cfg.personnel_pkg)`,
        `  end`,
        `  ctx.meshRead = (SCHEME == "triple_option") and "qb-give" or "rb-scan"`,
        `  return ctx.pkg`,
        `end)`,
        ``,
        `Game.hooks.on("OnTempo", function(c)`,
        `  if cfg.tempo_mode == "real"   then c.runoff = true;  c.clockBleed = 1.0 end`,
        `  if cfg.tempo_mode == "chaos"  then c.runoff = false; c.clockBleed = 0.4 end`,
        `  return c`,
        `end)`,
      ];
      return finalize(cat, `${titleCase(a.scheme ?? "Spread")} Scheme Injector`, "scheme_engine", hooks, props, vars, lua, brief, kb);
    },
  },
  {
    id: "weather",
    label: "Gameday Weather",
    code: "WX",
    keywords: ["weather", "rain", "snow", "wind", "storm", "forecast", "elements"],
    opener: () =>
      "Weather ball — my favorite kind of Saturday. \"True Weather Systems\" hands me the front generator and a vector wind model that actually bends deep balls. Four calls and we forecast.",
    questions: [
      { key: "regions", label: "Regions", ask: "Q1/4 — Where does dynamic weather roll?", chips: ["All FBS", "Northern only", "Coastal + plains"] },
      { key: "severity", label: "Severity ceiling", ask: "Q2/4 — How ugly can it get?", chips: ["Broadcast-safe", "Storm level", "Apocalypse"] },
      { key: "wind", label: "Wind model", ask: "Q3/4 — Wind model for the passing game?", chips: ["Vector wind", "Scalar gusts", "Wind off"] },
      { key: "drift", label: "Live drift", ask: "Q4/4 — Conditions locked at kickoff, or live drift?", chips: ["Locked at kickoff", "Live drift", "Drift + cold fronts"] },
    ],
    build: (a, brief, kb) => {
      const region = a.regions?.toLowerCase().includes("north") ? "northern" : a.regions?.toLowerCase().includes("coast") ? "coastal_plains" : "all_fbs";
      const sev = a.severity?.toLowerCase().includes("apoc") ? 1.0 : a.severity?.toLowerCase().includes("storm") ? 0.7 : 0.4;
      const wind = a.wind?.toLowerCase().includes("vector") ? "vector" : a.wind?.toLowerCase().includes("scalar") ? "scalar" : "off";
      const drift = a.drift?.toLowerCase().includes("front") ? "fronts" : a.drift?.toLowerCase().includes("live") ? "drift" : "locked";
      const cat = CATEGORIES[2];
      const hooks: HookSpec[] = [
        { event: "OnKickoff", entry: "wx_engine.seed", via: "WeatherSystem(seed, region)", from: "True Weather Systems" },
        { event: "OnPassThrown", entry: "wx_engine.bendBall", via: "WindVector.apply(pass)", from: "True Weather Systems" },
      ];
      const props: PropSpec[] = [
        { name: "region_set", type: "string", desc: "Stadiums eligible for dynamic weather", def: jsonStr(region) },
        { name: "severity_cap", type: "number", desc: "0–1 ceiling on cell intensity", def: String(sev) },
        { name: "wind_model", type: "string", desc: "How wind touches the football", def: jsonStr(wind), enumVals: ["vector", "scalar", "off"] },
        { name: "drift_mode", type: "string", desc: "In-game weather evolution", def: jsonStr(drift), enumVals: ["locked", "drift", "fronts"] },
      ];
      const vars: VarSpec[] = [
        { name: "region_set", type: "string", value: region, note: a.regions ?? "all FBS" },
        { name: "severity_cap", type: "float", value: String(sev), note: a.severity ?? "storm level" },
        { name: "wind_model", type: "string", value: wind, note: a.wind ?? "vector" },
        { name: "drift_mode", type: "string", value: drift, note: a.drift ?? "locked" },
      ];
      const lua = [
        `-- block: WeatherSystem ← True Weather Systems v1.8.0`,
        `local wx = nil`,
        ``,
        `Game.hooks.on("OnKickoff", function(stadium)`,
        `  if not eligible(stadium, cfg.region_set) then return end`,
        `  wx = WeatherSystem(stadium.seed, cfg.region_set)`,
        `  wx.cell.intensity = math.min(wx.cell.intensity, cfg.severity_cap)`,
        `  Broadcast.overlay:setWeather(wx)   -- TV-friendly lower third`,
        `end)`,
        ``,
        `Game.hooks.on("OnTick", function(dt)`,
        `  if wx == nil then return end`,
        `  if cfg.drift_mode == "drift" then wx.fronts:drift(dt) end`,
        `  if cfg.drift_mode == "fronts" then wx.fronts:spawnCold(dt, 0.02) end`,
        `end)`,
        ``,
        `Game.hooks.on("OnPassThrown", function(pass)`,
        `  if cfg.wind_model == "off" or wx == nil then return pass end`,
        `  if cfg.wind_model == "vector" then WindVector.apply(pass, wx.wind) end`,
        `  if cfg.wind_model == "scalar" then pass.accuracy = pass.accuracy - wx.wind.mph * 0.004 end`,
        `  return pass`,
        `end)`,
      ];
      return finalize(cat, "True Gameday Weather", "wx_engine", hooks, props, vars, lua, brief, kb);
    },
  },
  {
    id: "atmosphere",
    label: "Stadium Atmosphere",
    code: "ATM",
    keywords: ["crowd", "noise", "stadium", "night", "atmosphere", "home field", "band", "momentum"],
    opener: () =>
      "Saturday vibes, huh? \"Saturday Atmosphere Pack\" and \"Stadium Soundstage\" are already indexed — noise-to-penalty hooks, momentum shifts, the whole page. Four calls and the building gets loud.",
    questions: [
      { key: "effect", label: "Crowd effect", ask: "Q1/4 — What does a loud crowd actually do on the field?", chips: ["False starts", "Masks audibles", "Both + momentum swings"] },
      { key: "night", label: "Night multiplier", ask: "Q2/4 — Night-game home advantage multiplier?", chips: ["1.15x", "1.3x", "1.5x"] },
      { key: "band", label: "Band & celebrations", ask: "Q3/4 — Band cams and celebration hooks?", chips: ["Full show", "Minimal", "Off"] },
    ],
    build: (a, brief, kb) => {
      const eff = a.effect?.toLowerCase().includes("both") ? "both" : a.effect?.toLowerCase().includes("false") ? "false_start" : "mask";
      const night = floatOf(a.night ?? "", 1.3);
      const band = a.band?.toLowerCase().includes("full") ? "full" : a.band?.toLowerCase().includes("min") ? "minimal" : "off";
      const cat = CATEGORIES[3];
      const hooks: HookSpec[] = [
        { event: "OnCrowdNoise", entry: "atmo_engine.noise", via: "OnCrowdNoise(db)", from: "Saturday Atmosphere Pack" },
        { event: "OnKickoff", entry: "atmo_engine.nightCheck", via: "MomentumShift(delta)", from: "Saturday Atmosphere Pack" },
      ];
      const props: PropSpec[] = [
        { name: "crowd_effect", type: "string", desc: "On-field consequence of 108dB+ noise", def: jsonStr(eff), enumVals: ["false_start", "mask", "both"] },
        { name: "night_multiplier", type: "number", desc: "Home advantage boost for night games", def: String(night) },
        { name: "band_mode", type: "string", desc: "Band / celebration presentation", def: jsonStr(band), enumVals: ["full", "minimal", "off"] },
      ];
      const vars: VarSpec[] = [
        { name: "crowd_effect", type: "string", value: eff, note: a.effect ?? "both" },
        { name: "night_multiplier", type: "float", value: String(night), note: a.night ?? "1.3x" },
        { name: "band_mode", type: "string", value: band, note: a.band ?? "full" },
      ];
      const lua = [
        `-- hook: OnCrowdNoise ← Saturday Atmosphere Pack`,
        `Game.hooks.on("OnCrowdNoise", function(db)`,
        `  if db < 108 then return end`,
        `  local e = cfg.crowd_effect`,
        `  if e == "false_start" or e == "both" then`,
        `    officiating.falseStartBias = 0.22`,
        `  end`,
        `  if e == "mask" or e == "both" then`,
        `    offense.audibleWindow = offense.audibleWindow * 0.5`,
        `  end`,
        `  if e == "both" then MomentumShift(-0.4, offense) end`,
        `end)`,
        ``,
        `Game.hooks.on("OnKickoff", function(stadium)`,
        `  if stadium.lights == "night" then`,
        `    home.advantage = home.advantage * cfg.night_multiplier`,
        `  end`,
        `  Audio.layers.band:setMode(cfg.band_mode)`,
        `end)`,
      ];
      return finalize(cat, "Saturday Night Atmosphere", "atmo_engine", hooks, props, vars, lua, brief, kb);
    },
  },
  {
    id: "difficulty",
    label: "CPU Difficulty / Balance",
    code: "BAL",
    keywords: ["difficulty", "cpu", "ai", "hard", "harder", "balance", "brutal", "rubber band", "catch-up", "cheat", "fair"],
    opener: () =>
      "Balance work. Good — \"CPU Coordinator Brain\" is the cleanest code on the wire: late-game IQ profiles and a rubber-band stripper. Tell me where you want the teeth and I'll tune it.",
    questions: [
      { key: "axis", label: "Where CPU gets teeth", ask: "Q1/4 — Where should the CPU get dangerous?", chips: ["4th quarter", "Red zone", "All phases"] },
      { key: "rubber", label: "Rubber-banding", ask: "Q2/4 — How do we treat catch-up scripting?", chips: ["Strip all rubber-banding", "Soft catch-up only", "Keep stock"] },
      { key: "injuries", label: "Injury realism", ask: "Q3/4 — Injury model?", chips: ["Stock", "Slightly brutal", "Full medical chart"] },
    ],
    build: (a, brief, kb) => {
      const axis = a.axis?.toLowerCase().includes("red") ? "redzone" : a.axis?.toLowerCase().includes("all") ? "all_phases" : "fourth_quarter";
      const rubber = a.rubber?.toLowerCase().includes("strip") ? "strip_all" : a.rubber?.toLowerCase().includes("soft") ? "soft" : "stock";
      const inj = a.injuries?.toLowerCase().includes("full") ? "full_chart" : a.injuries?.toLowerCase().includes("slight") ? "brutal_lite" : "stock";
      const cat = CATEGORIES[4];
      const hooks: HookSpec[] = [
        { event: "OnQuarterStart", entry: "balance_engine.profile", via: "LateGameIQ(profile)", from: "CPU Coordinator Brain" },
        { event: "OnInjury", entry: "balance_engine.medical", via: "InjuryModel(severity)", from: "Redshirt Realism" },
      ];
      const props: PropSpec[] = [
        { name: "threat_axis", type: "string", desc: "Game situation where CPU aggression spikes", def: jsonStr(axis), enumVals: ["fourth_quarter", "redzone", "all_phases"] },
        { name: "rubberband", type: "string", desc: "Catch-up scripting policy", def: jsonStr(rubber), enumVals: ["strip_all", "soft", "stock"] },
        { name: "injury_model", type: "string", desc: "Injury severity curve", def: jsonStr(inj), enumVals: ["stock", "brutal_lite", "full_chart"] },
      ];
      const vars: VarSpec[] = [
        { name: "threat_axis", type: "string", value: axis, note: a.axis ?? "4th quarter" },
        { name: "rubberband", type: "string", value: rubber, note: a.rubber ?? "strip all" },
        { name: "injury_model", type: "string", value: inj, note: a.injuries ?? "stock" },
      ];
      const lua = [
        `-- block: LateGameIQ ← CPU Coordinator Brain v4.2.0`,
        `Game.hooks.on("OnQuarterStart", function(q)`,
        `  local hot = (cfg.threat_axis == "all_phases")`,
        `      or (cfg.threat_axis == "fourth_quarter" and q == 4)`,
        `      or (cfg.threat_axis == "redzone" and Game.fieldPos == "redzone")`,
        `  cpu.profile = hot and LateGameIQ("closer") or LateGameIQ("base")`,
        ``,
        `  if cfg.rubberband == "strip_all" then RubberBand.strip() end`,
        `  if cfg.rubberband == "soft" then RubberBand.cap(0.15) end`,
        ``,
        `  cpu.redZone = RedZoneAggression(hot and 0.85 or 0.55)`,
        `end)`,
        ``,
        `Game.hooks.on("OnInjury", function(play)`,
        `  if cfg.injury_model == "stock" then return end`,
        `  play.severity = InjuryModel(play.contact * (cfg.injury_model == "full_chart" and 1.6 or 1.2))`,
        `  if cfg.injury_model == "full_chart" then Medical.log(play) end`,
        `end)`,
      ];
      return finalize(cat, "Honest CPU Difficulty", "balance_engine", hooks, props, vars, lua, brief, kb);
    },
  },
  {
    id: "rules",
    label: "Clock & Rules",
    code: "RUL",
    keywords: ["clock", "rules", "targeting", "overtime", "penalty", "runoff", "flag", "review", "ot"],
    opener: () =>
      "Rules lawyer — respect. \"Clock Kings\" gives me the clock schema and review hooks, and they're tidy. Three rulings from the booth and I'll codify them.",
    questions: [
      { key: "clock", label: "Clock rule set", ask: "Q1/3 — Which clock rule set do we enforce?", chips: ["NCAA stock", "NFL-style", "No runoff ever"] },
      { key: "targeting", label: "Targeting", ask: "Q2/3 — Targeting enforcement?", chips: ["Strict eject", "Reviewable + lenient", "Disabled"] },
      { key: "ot", label: "Overtime", ask: "Q3/3 — Overtime format?", chips: ["NCAA 2PT OTs", "Single OT only", "Sudden death"] },
    ],
    build: (a, brief, kb) => {
      const clock = a.clock?.toLowerCase().includes("nfl") ? "nfl" : a.clock?.toLowerCase().includes("no runoff") ? "no_runoff" : "ncaa";
      const target = a.targeting?.toLowerCase().includes("strict") ? "strict" : a.targeting?.toLowerCase().includes("lenient") ? "lenient" : "off";
      const ot = a.ot?.toLowerCase().includes("single") ? "single" : a.ot?.toLowerCase().includes("sudden") ? "sudden_death" : "ncaa_2pt";
      const cat = CATEGORIES[5];
      const hooks: HookSpec[] = [
        { event: "ClockRules", entry: "rules_engine.clock", via: "ClockRules.schema", from: "Clock Kings" },
        { event: "OnTargetingReview", entry: "rules_engine.targeting", via: "OnTargetingReview(play)", from: "Clock Kings" },
      ];
      const props: PropSpec[] = [
        { name: "clock_set", type: "string", desc: "Clock mechanics package", def: jsonStr(clock), enumVals: ["ncaa", "nfl", "no_runoff"] },
        { name: "targeting", type: "string", desc: "Targeting review & ejection policy", def: jsonStr(target), enumVals: ["strict", "lenient", "off"] },
        { name: "overtime", type: "string", desc: "OT format", def: jsonStr(ot), enumVals: ["ncaa_2pt", "single", "sudden_death"] },
      ];
      const vars: VarSpec[] = [
        { name: "clock_set", type: "string", value: clock, note: a.clock ?? "NCAA stock" },
        { name: "targeting", type: "string", value: target, note: a.targeting ?? "strict" },
        { name: "overtime", type: "string", value: ot, note: a.ot ?? "NCAA 2PT OTs" },
      ];
      const lua = [
        `-- schema: ClockRules ← Clock Kings v1.3.7`,
        `Game.hooks.on("ClockRules", function(c)`,
        `  if cfg.clock_set == "nfl" then`,
        `    c.firstDownRunoff = true;  c.spikeWindow = 0.4;  c.outOfBoundsStop = "last2min"`,
        `  elseif cfg.clock_set == "no_runoff" then`,
        `    c.firstDownRunoff = false; c.spikeWindow = 1.2`,
        `  else -- ncaa stock`,
        `    c.firstDownRunoff = true;  c.spikeWindow = 0.9`,
        `  end`,
        `  return c`,
        `end)`,
        ``,
        `Game.hooks.on("OnTargetingReview", function(play)`,
        `  if cfg.targeting == "off" then return Game.dismiss(play) end`,
        `  if cfg.targeting == "lenient" and play.replayGrade < 0.8 then`,
        `    return Game.downgrade(play, "roughing")`,
        `  end`,
        `  return play -- strict: stock eject stands`,
        `end)`,
        ``,
        `Game.hooks.on("Overtime", function(ot)`,
        `  ot.format = cfg.overtime`,
        `  return ot`,
        `end)`,
      ];
      return finalize(cat, "Booth Rules Package", "rules_engine", hooks, props, vars, lua, brief, kb);
    },
  },
];

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

/* ---------------- intent detection ---------------- */

export function detectCategory(text: string): CategoryDef {
  const t = text.toLowerCase();
  let best: CategoryDef | null = null;
  let bestScore = 0;
  for (const c of CATEGORIES) {
    const score = c.keywords.reduce((n, k) => (t.includes(k) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best ?? CATEGORIES[4]; // default: balance tuning
}

export function generateBundle(
  cat: CategoryDef,
  answers: Record<string, string>,
  brief: string,
  kb: PatternDef[]
): BundleMeta {
  return cat.build(answers, brief, kb);
}

/* ---------------- build & test scripts ---------------- */

export function buildSteps(b: BundleMeta): { line: string; kind: "out" | "ok" }[] {
  return [
    { line: `resolving manifest · id ${b.id}`, kind: "out" },
    { line: `schema check · ncaa27-mod/3.1 · ${b.files[1].path.split("/").pop()}`, kind: "ok" },
    { line: `linking ${b.blocksLinked} blocks from ${b.kbUsed.length} patterns`, kind: "out" },
    { line: `hook-conflict scan · ${b.kbUsed.filter((k) => k.kind === "Hook").length} hooks · 0 conflicts`, kind: "ok" },
    { line: `compiling lua bytecode · ${b.files[2].path.split("/").pop()}`, kind: "out" },
    { line: `sealing var table · hotreload=true`, kind: "ok" },
    { line: `signing bundle · sha ${b.hash}`, kind: "ok" },
    { line: `BUILD PASSED · ${b.title} ready to ship`, kind: "ok" },
  ];
}

export function testLines(b: BundleMeta): { line: string; kind: "out" | "ok" }[] {
  const hookCount = b.kbUsed.filter((k) => k.kind === "Hook").length + 1;
  return [
    { line: `mounting sandbox · NCAA Football 27 (build 1.0.3841)`, kind: "out" },
    { line: `injecting ${b.id} · signature verified`, kind: "ok" },
    { line: `simulating 4 quarters @ 2-min tempo …`, kind: "out" },
    { line: `hooks fired: ${hookCount} types · ${34 + b.blocksLinked} events · 0 faults`, kind: "ok" },
    { line: `var hot-reload toggled mid-sim · held stable`, kind: "ok" },
    { line: `memory: +2.1MB peak · no leaks · framerate nominal`, kind: "ok" },
    { line: `verdict: SHIP IT — safe for live saves`, kind: "ok" },
  ];
}
