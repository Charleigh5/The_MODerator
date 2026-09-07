import type { ModEntry, PatternDef, Platform } from "../types";

export const PLATFORMS: Platform[] = [
  { id: "cfbvault", name: "CFB Vault", url: "cfbvault.gg", mods: 1204, status: "online", heartbeat: 1240, latency: 23 },
  { id: "modaxis", name: "ModAxis", url: "modaxis.io", mods: 862, status: "online", heartbeat: 890, latency: 18 },
  { id: "lockerroom", name: "The Locker Room", url: "lockerroom.mods", mods: 431, status: "syncing", heartbeat: 3420, latency: 67 },
  { id: "openplay", name: "OpenPlaybooks", url: "openplaybooks.dev", mods: 296, status: "online", heartbeat: 1560, latency: 31 },
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
    short: "Recruit Overhaul",
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
    description: "Complete recruiting engine overhaul with conference-specific bias tables, portal surge mechanics, and CPU coach AI that actually poaches your commits. Adds regional scouting, star ratings, and signing day drama.",
    rating: 4.8,
    reviewCount: 342,
    reviews: [
      { user: "CoachMike22", rating: 5, text: "Finally CPU coaches recruit like real humans. The conference bias tables are chef's kiss.", date: "2026-03-15", helpful: 89 },
      { user: "PortalKing", rating: 5, text: "Spring portal surge is chaotic in the best way. Lost 3 commits and gained 5 stars.", date: "2026-03-10", helpful: 67 },
      { user: "RealismFan", rating: 4, text: "Great mod but the AI can be too aggressive on 4-star recruits. Dial it back to 7/10 intensity.", date: "2026-02-28", helpful: 45 },
    ],
    pros: [
      "Conference bias tables add real regional flavor",
      "CPU AI actually poaches — no more safe commits",
      "Portal surge creates mid-season chaos",
      "Clean variable table for easy tuning",
      "Hot-reload support for live tweaking",
    ],
    cons: [
      "Can feel overwhelming if you like stock recruiting",
      "CPU intensity at 10/10 is brutal — not for casual",
      "Some edge cases with 5-star recruits",
      "Requires understanding of bias table structure",
    ],
    warnings: [
      "Back up your save before installing — this rewrites the recruiting engine",
      "Conflicts with any other recruiting mods",
      "CPU poaching can feel unfair at max intensity",
      "Test in exhibition first to tune to your taste",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "2.1 KB" },
      { name: "recruit.schema.json", purpose: "Schema for recruiting variables and hooks", size: "4.8 KB" },
      { name: "recruit_engine.lua", purpose: "Core recruiting logic and AI governors", size: "12.3 KB" },
      { name: "conference_bias.xml", purpose: "Hot-reload variable table for regional bias", size: "1.9 KB" },
    ],
    variables: [
      { name: "conference_bias[13]", type: "float[]", purpose: "Regional interest multiplier per conference (SEC=1.2, Big Ten=1.15, etc.)" },
      { name: "portal_surge_rate", type: "float", purpose: "Spring portal entry rate multiplier (default 2.4x)" },
      { name: "cpu_poach_aggression", type: "float", purpose: "How aggressively CPU coaches target your commits (0.0-1.0)" },
      { name: "star_rating_weight", type: "float", purpose: "Weight of star rating in CPU decision-making" },
    ],
    logic: [
      "OnRecruitDecision hook intercepts every CPU recruit decision",
      "Applies conference bias multiplier to interest score",
      "Clamps final interest to 0-100 range",
      "Portal window hook multiplies entry rate during spring",
      "CPU poaching logic checks your commit list every 2 weeks",
    ],
    testPlan: [
      "Load into exhibition mode with a 5-star recruit",
      "Advance to signing day — verify CPU coaches from same conference have higher interest",
      "Check portal window in spring — should see 2-3x normal entry rate",
      "Commit a 4-star and advance 4 weeks — CPU should attempt poach if aggression > 0.5",
      "Edit conference_bias.xml live — verify changes take effect without reload",
    ],
  },
  {
    id: "m_weather",
    name: "True Weather Systems",
    short: "True Weather",
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
    description: "Dynamic weather system with regional fronts, vector wind that bends deep passes, lightning delays, and field conditions that affect footing. Adds broadcast-quality weather overlays and real-time drift.",
    rating: 4.6,
    reviewCount: 218,
    reviews: [
      { user: "WeatherNerd", rating: 5, text: "Vector wind model is insane. Deep balls actually drift now. Lightning delay cutscene is chef's kiss.", date: "2026-03-12", helpful: 72 },
      { user: "RealismGuy", rating: 5, text: "Finally weather that matters. Played a game in a storm and it felt like a real Saturday.", date: "2026-03-05", helpful: 58 },
      { user: "ArcadeFan", rating: 3, text: "Too much weather for my taste. Wish there was a 'light' mode.", date: "2026-02-20", helpful: 34 },
    ],
    pros: [
      "Vector wind model actually affects passing game",
      "Lightning delays with locker-room cutscene",
      "Field puddles slow cuts and breaks",
      "Broadcast-quality overlays look pro",
      "Hot-reload weather variables for live tuning",
    ],
    cons: [
      "Can feel overdone if you prefer clear skies",
      "Wind model is complex — steep learning curve",
      "Some stadiums don't have proper overlays",
      "Performance hit on older hardware",
    ],
    warnings: [
      "Conflicts with any other weather mods",
      "Test in exhibition first — can be overwhelming",
      "Wind model requires understanding of vector math",
      "Some custom stadiums may not render overlays correctly",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "1.8 KB" },
      { name: "weather.schema.json", purpose: "Schema for weather variables and hooks", size: "3.9 KB" },
      { name: "weather_engine.lua", purpose: "Core weather logic and front generator", size: "9.7 KB" },
      { name: "wind_model.xml", purpose: "Hot-reload variable table for wind vectors", size: "2.3 KB" },
    ],
    variables: [
      { name: "wind_vector[3]", type: "float[]", purpose: "3D wind vector (x, y, z) in m/s" },
      { name: "front_intensity", type: "float", purpose: "Weather front intensity (0.0-1.0)" },
      { name: "lightning_threshold", type: "float", purpose: "Intensity threshold for lightning delay (default 0.8)" },
      { name: "field_puddle_factor", type: "float", purpose: "How much puddles slow player movement (0.0-0.5)" },
    ],
    logic: [
      "WeatherSystem generates regional fronts based on seed and region",
      "Fronts drift over time using dt (delta time)",
      "WindVector.apply bends passing game based on 3D wind vector",
      "Lightning delay triggers when intensity > threshold",
      "Field puddle logic reduces player speed in affected zones",
    ],
    testPlan: [
      "Load into exhibition with weather enabled",
      "Check wind direction — deep passes should drift downwind",
      "Advance to storm conditions — verify lightning delay cutscene",
      "Check field conditions — players should slow in puddle zones",
      "Edit wind_model.xml live — verify changes take effect without reload",
    ],
  },
  {
    id: "m_veer",
    name: "Veer & Shoot Playbook",
    short: "Veer & Shoot",
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
  if ctx.formation:startsWith("VEER") then
    ctx.meshWindow = PersonnelPackage(ctx.id).mesh
  end
  return ctx
end)`,
    description: "Complete triple-option playbook with mesh reads, personnel packages, and AI call frequency tuning. Adds 47 new formations, option pitches, and tempo-based clock management.",
    rating: 4.5,
    reviewCount: 189,
    reviews: [
      { user: "OptionGuru", rating: 5, text: "Finally a real triple-option playbook. Mesh reads work perfectly.", date: "2026-03-08", helpful: 56 },
      { user: "SpreadFan", rating: 4, text: "Great playbook but the AI calls it too often. Wish there was a frequency slider.", date: "2026-02-25", helpful: 41 },
      { user: "OldSchool", rating: 5, text: "Reminds me of the old days. Option football is back!", date: "2026-02-15", helpful: 38 },
    ],
    pros: [
      "47 new formations with proper option reads",
      "Mesh read logic is authentic triple-option",
      "Personnel packages auto-fit to roster",
      "Tempo-based clock management",
      "Clean hook structure for easy modding",
    ],
    cons: [
      "AI call frequency can be too high",
      "Some formations overlap with stock playbook",
      "Tempo rules can be confusing at first",
      "Limited passing game compared to spread",
    ],
    warnings: [
      "Conflicts with other playbook mods",
      "Test in exhibition to tune AI frequency",
      "Option plays require specific personnel",
      "Tempo rules affect game clock significantly",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "2.4 KB" },
      { name: "playbook.schema.json", purpose: "Schema for playbook variables and hooks", size: "5.2 KB" },
      { name: "veer_shoot.lua", purpose: "Core playbook logic and option reads", size: "14.8 KB" },
      { name: "personnel.xml", purpose: "Hot-reload variable table for personnel packages", size: "3.1 KB" },
    ],
    variables: [
      { name: "mesh_window", type: "float", purpose: "Time window for mesh read (default 0.4s)" },
      { name: "option_frequency", type: "float", purpose: "How often CPU calls option plays (0.0-1.0)" },
      { name: "tempo_mode", type: "string", purpose: "Tempo setting: 'hurry', 'normal', 'slow'" },
      { name: "personnel_package", type: "string", purpose: "Active personnel package ID" },
    ],
    logic: [
      "OnPlaycall hook intercepts CPU play calls",
      "Checks formation for VEER prefix",
      "Applies mesh window from PersonnelPackage",
      "Option pitch logic reads defensive alignment",
      "Tempo hook adjusts game clock runoff",
    ],
    testPlan: [
      "Load into exhibition with Veer & Shoot playbook",
      "Run option plays — verify mesh read timing",
      "Check AI frequency — should call option 25-40% of snaps",
      "Test tempo modes — verify clock runoff changes",
      "Edit personnel.xml live — verify package changes without reload",
    ],
  },
  {
    id: "m_atmos",
    name: "Saturday Atmosphere Pack",
    short: "Saturday Atmos",
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
    description: "Complete stadium atmosphere overhaul with crowd noise penalties, momentum shifts, night-game multipliers, band celebrations, and camera shake on big plays. Makes home field advantage real.",
    rating: 4.7,
    reviewCount: 267,
    reviews: [
      { user: "NightGameFan", rating: 5, text: "Night games feel electric now. Crowd noise actually matters.", date: "2026-03-11", helpful: 78 },
      { user: "BandGeek", rating: 5, text: "Band plays the fight song on big stops. Chills every time.", date: "2026-03-03", helpful: 62 },
      { user: "NeutralSite", rating: 4, text: "Great mod but wish there was a way to tone down the camera shake.", date: "2026-02-18", helpful: 45 },
    ],
    pros: [
      "Crowd noise causes real false starts",
      "Momentum shifts on big plays",
      "Night-game multiplier adds atmosphere",
      "Band celebrations on key moments",
      "Camera shake on goal-line stands",
    ],
    cons: [
      "Can feel overdone at max settings",
      "Camera shake can be disorienting",
      "Some stadiums don't have proper band audio",
      "Night multiplier can be too strong",
    ],
    warnings: [
      "Conflicts with other atmosphere mods",
      "Test in exhibition to tune intensity",
      "Camera shake may not suit all players",
      "Band audio requires specific stadium assets",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "1.9 KB" },
      { name: "atmosphere.schema.json", purpose: "Schema for atmosphere variables and hooks", size: "4.1 KB" },
      { name: "crowd_engine.lua", purpose: "Core crowd noise and momentum logic", size: "8.6 KB" },
      { name: "stadium_vars.xml", purpose: "Hot-reload variable table for atmosphere settings", size: "2.7 KB" },
    ],
    variables: [
      { name: "crowd_threshold", type: "float", purpose: "Decibel threshold for penalties (default 108 dB)" },
      { name: "night_multiplier", type: "float", purpose: "Home advantage boost for night games (default 1.3x)" },
      { name: "momentum_shift", type: "float", purpose: "Momentum change on big plays (default -0.4)" },
      { name: "camera_shake", type: "bool", purpose: "Enable camera shake on big plays" },
    ],
    logic: [
      "OnCrowdNoise hook monitors decibel levels",
      "Triggers false start bias when threshold exceeded",
      "MomentumShift adjusts team momentum on big plays",
      "Night-game multiplier boosts home advantage",
      "Band hook triggers fight song on key moments",
    ],
    testPlan: [
      "Load into night game exhibition",
      "Check crowd noise — should cause false starts at 108+ dB",
      "Make a big play — verify momentum shift and camera shake",
      "Check night multiplier — home team should have advantage",
      "Edit stadium_vars.xml live — verify changes without reload",
    ],
  },
  {
    id: "m_cpu",
    name: "CPU Coordinator Brain",
    short: "Coordinator Brain",
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
    description: "Complete CPU AI overhaul with late-game IQ profiles, rubber-band stripping, red zone aggression tuning, and tendency-based adjustments. Makes CPU coaches think like real coordinators.",
    rating: 4.9,
    reviewCount: 412,
    reviews: [
      { user: "HardcoreGamer", rating: 5, text: "Finally CPU plays smart in the 4th quarter. No more rubber-banding.", date: "2026-03-14", helpful: 95 },
      { user: "CompetitiveCoach", rating: 5, text: "Red zone aggression at 0.85 is perfect. CPU actually scores now.", date: "2026-03-09", helpful: 78 },
      { user: "CasualPlayer", rating: 4, text: "Great mod but can be brutal. CPU doesn't give you any breaks.", date: "2026-02-22", helpful: 52 },
    ],
    pros: [
      "Late-game IQ profiles are authentic",
      "Rubber-banding completely stripped",
      "Red zone aggression is tunable",
      "CPU adjusts to your tendencies",
      "Clean code structure for easy modding",
    ],
    cons: [
      "Can be too difficult for casual players",
      "CPU tendency adjustment can feel unfair",
      "Late-game profiles are aggressive",
      "Requires understanding of AI profiles",
    ],
    warnings: [
      "Conflicts with other AI mods",
      "Test in exhibition to tune difficulty",
      "CPU can be brutal at max settings",
      "Tendency adjustment learns your habits",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "2.2 KB" },
      { name: "cpu.schema.json", purpose: "Schema for CPU AI variables and hooks", size: "5.8 KB" },
      { name: "coordinator_brain.lua", purpose: "Core CPU AI logic and profiles", size: "18.4 KB" },
      { name: "ai_profiles.xml", purpose: "Hot-reload variable table for AI profiles", size: "3.6 KB" },
    ],
    variables: [
      { name: "late_game_profile", type: "string", purpose: "AI profile for 4th quarter: 'closer', 'conservative', 'aggressive'" },
      { name: "rubber_band", type: "bool", purpose: "Enable catch-up scripting (default false)" },
      { name: "red_zone_aggression", type: "float", purpose: "CPU red zone aggression (0.0-1.0, default 0.85)" },
      { name: "tendency_adjustment", type: "bool", purpose: "CPU adjusts to your play tendencies" },
    ],
    logic: [
      "Late-game profile activates in 4th quarter within 7 points",
      "RubberBand.strip removes catch-up scripting",
      "RedZoneAggression sets CPU scoring probability",
      "Tendency adjustment learns your play patterns",
      "CPU profile switches based on game situation",
    ],
    testPlan: [
      "Load into exhibition and play to 4th quarter",
      "Check CPU profile — should switch to 'closer' if within 7",
      "Verify no rubber-banding — CPU shouldn't get free scores",
      "Test red zone — CPU should score at configured aggression",
      "Edit ai_profiles.xml live — verify changes without reload",
    ],
  },
  {
    id: "m_clock",
    name: "Clock Kings",
    short: "Clock Kings",
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
    description: "Realistic clock rules with first-down runoff, extended spike windows, targeting review booth, and NCAA-compliant overtime. Makes time management matter.",
    rating: 4.3,
    reviewCount: 156,
    reviews: [
      { user: "RulesLawyer", rating: 5, text: "Finally clock rules match real NCAA. First-down runoff is huge.", date: "2026-03-07", helpful: 48 },
      { user: "StrategyFan", rating: 4, text: "Great mod but the spike window change takes getting used to.", date: "2026-02-28", helpful: 36 },
      { user: "OldSchool", rating: 4, text: "Targeting review booth is a nice touch. Overtime format is perfect.", date: "2026-02-19", helpful: 31 },
    ],
    pros: [
      "First-down runoff adds strategy",
      "Extended spike window is realistic",
      "Targeting review booth with instant replay",
      "NCAA-compliant overtime format",
      "Clean schema for easy tuning",
    ],
    cons: [
      "First-down runoff can be frustrating",
      "Spike window change requires adjustment",
      "Targeting reviews slow down game",
      "Overtime format may not suit all tastes",
    ],
    warnings: [
      "Conflicts with other clock mods",
      "Test in exhibition to tune runoff",
      "Targeting reviews add real-time delay",
      "Overtime format is fixed — no customization",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "1.6 KB" },
      { name: "clock.schema.json", purpose: "Schema for clock rules and hooks", size: "3.4 KB" },
      { name: "clock_rules.lua", purpose: "Core clock logic and runoff policy", size: "6.2 KB" },
      { name: "targeting.xml", purpose: "Hot-reload variable table for targeting rules", size: "1.8 KB" },
    ],
    variables: [
      { name: "first_down_runoff", type: "bool", purpose: "Enable clock runoff on first downs" },
      { name: "spike_window", type: "float", purpose: "Seconds allowed for spike (default 0.9)" },
      { name: "targeting_review", type: "bool", purpose: "Enable targeting review booth" },
      { name: "overtime_format", type: "string", purpose: "Overtime format: 'ncaa_2pt', 'single', 'sudden_death'" },
    ],
    logic: [
      "ClockRules hook intercepts clock management",
      "First-down runoff applies after new series",
      "Spike window extended from 0.4 to 0.9 seconds",
      "Targeting review triggers on flag",
      "Overtime format follows NCAA 2PT rules",
    ],
    testPlan: [
      "Load into exhibition and get a first down",
      "Verify clock runoff applies correctly",
      "Test spike window — should have 0.9 seconds",
      "Trigger targeting — verify review booth appears",
      "Play to overtime — verify NCAA 2PT format",
    ],
  },
  {
    id: "m_portal",
    name: "Transfer Portal Chaos",
    short: "Portal Chaos",
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
    description: "Transfer portal overhaul with spring surge, entry rate multipliers, and chaotic player movement. Makes the portal window feel like free agency.",
    rating: 4.1,
    reviewCount: 134,
    reviews: [
      { user: "PortalAddict", rating: 5, text: "Spring surge is wild. Lost my entire roster and rebuilt it. Love it.", date: "2026-03-06", helpful: 42 },
      { user: "StabilityFan", rating: 3, text: "Too chaotic for my taste. Wish there was a 'mild' mode.", date: "2026-02-24", helpful: 28 },
      { user: "RealismGuy", rating: 4, text: "Great concept but needs balance. Some seasons are too wild.", date: "2026-02-16", helpful: 35 },
    ],
    pros: [
      "Spring surge creates mid-season chaos",
      "Entry rate multiplier is tunable",
      "Portal window feels like free agency",
      "Reuses recruiting hooks for consistency",
      "Hot-reload support for live tuning",
    ],
    cons: [
      "Can be too chaotic for some tastes",
      "Beta version — some edge cases",
      "Entry rate can feel unbalanced",
      "Requires understanding of portal mechanics",
    ],
    warnings: [
      "Beta version — may have bugs",
      "Conflicts with other portal mods",
      "Spring surge can decimate your roster",
      "Test in exhibition first",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "1.7 KB" },
      { name: "portal.schema.json", purpose: "Schema for portal variables and hooks", size: "3.2 KB" },
      { name: "portal_chaos.lua", purpose: "Core portal logic and surge mechanics", size: "7.8 KB" },
      { name: "portal_vars.xml", purpose: "Hot-reload variable table for portal settings", size: "1.9 KB" },
    ],
    variables: [
      { name: "spring_surge_rate", type: "float", purpose: "Spring portal entry rate multiplier (default 2.4x)" },
      { name: "entry_threshold", type: "float", purpose: "Minimum rating to enter portal (default 3.0)" },
      { name: "chaos_mode", type: "bool", purpose: "Enable maximum chaos (default false)" },
    ],
    logic: [
      "PortalWindow hook intercepts portal entry",
      "Spring season multiplies entry rate by 2.4x",
      "Entry threshold filters low-rated players",
      "Chaos mode increases all rates further",
      "Reuses recruiting hooks for consistency",
    ],
    testPlan: [
      "Load into dynasty and advance to spring",
      "Check portal entry rate — should be 2.4x normal",
      "Verify entry threshold filters correctly",
      "Test chaos mode — rates should increase further",
      "Edit portal_vars.xml live — verify changes without reload",
    ],
  },
  {
    id: "m_redshirt",
    name: "Redshirt Realism",
    short: "Redshirt Realism",
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
    description: "Realistic injury model with medical charts, redshirt protection for long-term injuries, and severity-based recovery. Makes injuries matter.",
    rating: 4.4,
    reviewCount: 98,
    reviews: [
      { user: "MedicalModder", rating: 5, text: "Injury model is finally realistic. Redshirt protection is huge.", date: "2026-03-04", helpful: 38 },
      { user: "CasualPlayer", rating: 4, text: "Great mod but injuries can be brutal. Wish there was a 'light' mode.", date: "2026-02-21", helpful: 29 },
      { user: "RealismFan", rating: 4, text: "Medical chart adds depth. Recovery times feel authentic.", date: "2026-02-14", helpful: 32 },
    ],
    pros: [
      "Medical chart adds realism",
      "Redshirt protection for long injuries",
      "Severity-based recovery times",
      "Clean injury model logic",
      "Hot-reload support for tuning",
    ],
    cons: [
      "Injuries can be brutal",
      "Medical chart is complex",
      "Recovery times can feel long",
      "Requires understanding of injury mechanics",
    ],
    warnings: [
      "Conflicts with other injury mods",
      "Test in exhibition to tune severity",
      "Injuries can decimate your roster",
      "Redshirt rules are strict",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "1.5 KB" },
      { name: "injury.schema.json", purpose: "Schema for injury variables and hooks", size: "2.8 KB" },
      { name: "injury_model.lua", purpose: "Core injury logic and medical chart", size: "5.4 KB" },
      { name: "redshirt_vars.xml", purpose: "Hot-reload variable table for redshirt rules", size: "1.6 KB" },
    ],
    variables: [
      { name: "injury_severity", type: "float", purpose: "Base injury severity multiplier (default 1.0)" },
      { name: "redshirt_threshold", type: "int", purpose: "Games missed to protect redshirt (default 4)" },
      { name: "recovery_multiplier", type: "float", purpose: "Recovery time multiplier (default 1.0)" },
    ],
    logic: [
      "OnInjury hook intercepts injury events",
      "InjuryModel calculates severity from contact",
      "Redshirt protection triggers if games missed > threshold",
      "Recovery time based on severity and multiplier",
      "Medical chart tracks injury history",
    ],
    testPlan: [
      "Load into exhibition and trigger injuries",
      "Verify severity calculation from contact",
      "Check redshirt protection — should protect after 4 games",
      "Test recovery times — should match severity",
      "Edit redshirt_vars.xml live — verify changes without reload",
    ],
  },
  {
    id: "m_sound",
    name: "Stadium Soundstage",
    short: "Soundstage",
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
    description: "Advanced audio engine with crowd stem layering, band integration, momentum-based chants, and stadium-specific acoustics. Makes every stadium sound unique.",
    rating: 4.5,
    reviewCount: 167,
    reviews: [
      { user: "AudioNerd", rating: 5, text: "Crowd stem layering is incredible. Every stadium sounds different.", date: "2026-03-02", helpful: 51 },
      { user: "BandFan", rating: 5, text: "Band integration is perfect. Fight song triggers at the right moments.", date: "2026-02-26", helpful: 43 },
      { user: "CasualListener", rating: 4, text: "Great mod but some stadiums need better acoustic tuning.", date: "2026-02-17", helpful: 34 },
    ],
    pros: [
      "Crowd stem layering is authentic",
      "Band integration triggers correctly",
      "Momentum-based chants feel real",
      "Stadium-specific acoustics",
      "Clean audio engine structure",
    ],
    cons: [
      "Some stadiums need acoustic tuning",
      "Band audio requires specific assets",
      "Stem layering can be complex",
      "Performance hit on older hardware",
    ],
    warnings: [
      "Conflicts with other audio mods",
      "Test in different stadiums",
      "Band audio requires proper assets",
      "Acoustic tuning varies by stadium",
    ],
    files: [
      { name: "manifest.json", purpose: "Mod metadata and dependency declarations", size: "1.8 KB" },
      { name: "audio.schema.json", purpose: "Schema for audio variables and hooks", size: "3.5 KB" },
      { name: "soundstage.lua", purpose: "Core audio engine and stem layering", size: "8.9 KB" },
      { name: "stadium_acoustics.xml", purpose: "Hot-reload variable table for stadium acoustics", size: "2.4 KB" },
    ],
    variables: [
      { name: "crowd_base", type: "float", purpose: "Base crowd volume (default 0.6)" },
      { name: "chant_momentum", type: "float", purpose: "Momentum multiplier for chants (default 1.0)" },
      { name: "band_volume", type: "float", purpose: "Band volume when active (default 0.4)" },
      { name: "stadium_reverb", type: "float", purpose: "Stadium-specific reverb (0.0-1.0)" },
    ],
    logic: [
      "Audio.layers.crowd sets stem volumes",
      "Base crowd volume is constant",
      "Chant volume scales with momentum",
      "Band volume triggers when band is active",
      "Stadium reverb adds acoustic character",
    ],
    testPlan: [
      "Load into different stadiums",
      "Check crowd stem layering — should vary by momentum",
      "Trigger band — verify volume and timing",
      "Test stadium acoustics — reverb should differ",
      "Edit stadium_acoustics.xml live — verify changes without reload",
    ],
  },
];

export const TICKER_ITEMS = [
  "GO BLUE · the forge is open",
  "HAIL! TO THE VICTORS VALIANT",
  "THE BIG HOUSE · 107,601 SEATS OF OPINION",
  "THOSE WHO STAY WILL BE CHAMPIONS",
  "MAIZE & BLUE FOREVER · ANN ARBOR, MICH.",
  "CFB VAULT · 1,204 mods indexed",
  "MODAXIS sync OK · 862 mods",
  "THE LOCKER ROOM · re-syncing 431 mods",
  "OPENPLAYBOOKS · 296 mods verified",
  "schema ncaa27-mod/3.1 · stable",
  "hook-conflict scanner armed",
  "KB warm · patterns ready to weave",
];
