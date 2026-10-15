/**
 * MODerator community-intelligence evidence slice, researched 2026-10-09.
 * All mod-specific claims remain source claims; NONE is a local game test.
 * A repeated author or reporter is one independent voice per issue/context.
 */
export type EvidenceRole = "HOST_METADATA" | "PLAYER_REPORT" | "AUTHOR_RESPONSE" | "EDITORIAL_REVIEW" | "VIDEO_DEMONSTRATION";
export type EvidenceStance = "FAVORABLE" | "UNFAVORABLE" | "MIXED" | "NEUTRAL";
export type EvidenceScope = "LEGITIMATE_GAME_CLAIM" | "UNOFFICIAL_REPACK" | "UNSPECIFIED";
export interface CommunityEvidence {
  id:string; modId:string; issueKey:string; reporterKey:string; role:EvidenceRole;
  date:string|null; datePrecision:"DAY"|"UNKNOWN"; sourceUrl:string;
  stance:EvidenceStance; scope:EvidenceScope; statement:string;
  sourceStrength:"DIRECT"|"SECONDARY"; independenceKey:string;
  issueOutcome?:"UNRESOLVED"|"DISPUTED"|"AUTHOR_ACKNOWLEDGED"|"NOT_APPLICABLE";
}
export interface GamePatch {
  id:string; effectiveDate:string; notesPublishedDate:string; sourceUrl:string;
  title:string; official:boolean; impactedDomains:string[]; changes:string[];
  knownBuildNumber:string|null;
}
const NEXUS="https://www.nexusmods.com/maddennfl27/mods/1?tab=posts";
const OS="https://newsletter.operationsports.com/p/madden-mods-and-tools-showcase";
const VIDEO="https://www.youtube.com/watch?v=hHmNCKg-TE8";
const osEditorial=(id:string,modId:string,topic:string,claim:string,stance:EvidenceStance="FAVORABLE"):CommunityEvidence=>({
 id,modId,issueKey:topic,reporterKey:"os-chase-becotte",role:"EDITORIAL_REVIEW",
 date:"2026-09-25",datePrecision:"DAY",sourceUrl:OS,stance,scope:"UNSPECIFIED",
 statement:claim,sourceStrength:"SECONDARY",independenceKey:"os-article-2026-09-25",
 issueOutcome:"NOT_APPLICABLE"
});
export const communityEvidence:CommunityEvidence[]=[
 {id:"nexus-metadata-v5",modId:"mod-001",issueKey:"RELEASE_METADATA",reporterKey:"nexus-listing",role:"HOST_METADATA",date:"2026-10-05",datePrecision:"DAY",sourceUrl:"https://www.nexusmods.com/maddennfl27/mods/1",stance:"NEUTRAL",scope:"UNSPECIFIED",statement:"Nexus listing reports version 5, updated October 5; public host metadata and virus-scan label are not independent game tests.",sourceStrength:"DIRECT",independenceKey:"nexus-listing-1",issueOutcome:"NOT_APPLICABLE"},
 {id:"nexus-complaint-0929",modId:"mod-001",issueKey:"PLAYER_APPEARANCE_MISSING_LIMBS",reporterKey:"nexus-reviewer-A",role:"PLAYER_REPORT",date:"2026-09-29",datePrecision:"DAY",sourceUrl:NEXUS,stance:"UNFAVORABLE",scope:"UNOFFICIAL_REPACK",statement:"User reports missing legs, transparent bodies and incomplete portraits while describing an unofficial repacked game build.",sourceStrength:"DIRECT",independenceKey:"nexus-reviewer-A",issueOutcome:"DISPUTED"},
 {id:"nexus-complaint-0930",modId:"mod-001",issueKey:"PLAYER_APPEARANCE_MISSING_LIMBS",reporterKey:"nexus-reviewer-A",role:"PLAYER_REPORT",date:"2026-09-30",datePrecision:"DAY",sourceUrl:NEXUS,stance:"UNFAVORABLE",scope:"UNOFFICIAL_REPACK",statement:"Same user expands affected team list, without presenting a separate independent install.",sourceStrength:"DIRECT",independenceKey:"nexus-reviewer-A",issueOutcome:"DISPUTED"},
 {id:"nexus-complaint-1001",modId:"mod-001",issueKey:"PLAYER_APPEARANCE_MISSING_LIMBS",reporterKey:"nexus-reviewer-A",role:"PLAYER_REPORT",date:"2026-10-01",datePrecision:"DAY",sourceUrl:NEXUS,stance:"UNFAVORABLE",scope:"UNOFFICIAL_REPACK",statement:"Same reporter repeats missing-limbs concerns on revised roster file.",sourceStrength:"DIRECT",independenceKey:"nexus-reviewer-A",issueOutcome:"DISPUTED"},
 {id:"nexus-complaint-1003",modId:"mod-001",issueKey:"PLAYER_APPEARANCE_MISSING_LIMBS",reporterKey:"nexus-reviewer-A",role:"PLAYER_REPORT",date:"2026-10-03",datePrecision:"DAY",sourceUrl:NEXUS,stance:"UNFAVORABLE",scope:"UNOFFICIAL_REPACK",statement:"Same reporter explicitly confirms unofficial repack as the installation context; this is not a second distinct user.",sourceStrength:"DIRECT",independenceKey:"nexus-reviewer-A",issueOutcome:"DISPUTED"},
 {id:"nexus-ratings-1001",modId:"mod-001",issueKey:"ROSTER_RATING_CALIBRATION",reporterKey:"nexus-reviewer-A",role:"PLAYER_REPORT",date:"2026-10-01",datePrecision:"DAY",sourceUrl:NEXUS,stance:"MIXED",scope:"UNOFFICIAL_REPACK",statement:"One reporter says legend-team overall ratings were lowered and calls the outcome incorrect.",sourceStrength:"DIRECT",independenceKey:"nexus-reviewer-A",issueOutcome:"AUTHOR_ACKNOWLEDGED"},
 {id:"nexus-author-1001",modId:"mod-001",issueKey:"ROSTER_RATING_CALIBRATION",reporterKey:"nexus-author-X2357",role:"AUTHOR_RESPONSE",date:"2026-10-01",datePrecision:"DAY",sourceUrl:NEXUS,stance:"NEUTRAL",scope:"LEGITIMATE_GAME_CLAIM",statement:"Author confirms intentionally lowering ratings to improve franchise balance; not a confirmation of a broken mod.",sourceStrength:"DIRECT",independenceKey:"nexus-author-X2357",issueOutcome:"AUTHOR_ACKNOWLEDGED"},
 {id:"nexus-author-1003",modId:"mod-001",issueKey:"PLAYER_APPEARANCE_MISSING_LIMBS",reporterKey:"nexus-author-X2357",role:"AUTHOR_RESPONSE",date:"2026-10-03",datePrecision:"DAY",sourceUrl:NEXUS,stance:"NEUTRAL",scope:"LEGITIMATE_GAME_CLAIM",statement:"Author says missing limbs/equipment are not reproduced on their legitimate copy; no independent resolution confirmed.",sourceStrength:"DIRECT",independenceKey:"nexus-author-X2357",issueOutcome:"DISPUTED"},
 {id:"nexus-feature-request-1002",modId:"mod-001",issueKey:"FEATURE_REQUEST_UPDATED_ROSTER",reporterKey:"nexus-reviewer-B",role:"PLAYER_REPORT",date:"2026-10-02",datePrecision:"DAY",sourceUrl:NEXUS,stance:"NEUTRAL",scope:"UNOFFICIAL_REPACK",statement:"A different user requests a regular-season updated roster for an unofficial repack; not a quality failure report.",sourceStrength:"DIRECT",independenceKey:"nexus-reviewer-B",issueOutcome:"NOT_APPLICABLE"},
 osEditorial("os-sabos-franchise","mod-002","FRANCHISE_SIM_FEATURES","Editorial writer describes SABOS Franchise 1.2 sim stats, regression, progression, retirement and injury tuning; full package still pending."),
 osEditorial("os-sabos-speed","mod-003","PLAYER_SPEED_FEATURES","Writer describes the early 1.0 Speed Mod as ball-carrier speed tuning, not a measured benchmark."),
 osEditorial("os-unlocked","mod-004","EQUIPMENT_UNLOCKS","Writer documents additional sleeves, cleats, jersey styles, tattoos and helmet removal; warns some balaclavas may not fit Madden heads."),
 osEditorial("os-realistic-franchise","mod-005","ROSTER_REALISM","Writer describes weekly roster, appearance, draft and franchise updates, with dependency on Unlocked."),
 osEditorial("os-scorebugs","mod-006","BROADCAST_OVERLAP","Writer describes optional broadcast scorebugs and warns presentation mod stacking is more complex and riskier."),
 osEditorial("os-mnf","mod-007","PRESENTATION_OVERLAP","Writer says expansive MNF presentation and music replacement should be selected for matching game contexts."),
 osEditorial("os-ej","mod-011","GAMEPLAY_OVERLAP","Writer describes EJ Gameplay support for All-Pro/All-Madden and warns against stacking unrelated gameplay overhauls."),
 osEditorial("os-coach-mode","mod-012","SLOW_SIM_FEATURES","Writer recommends Buhbooh's Coach Mode/SlowSim for CPU-vs-CPU balancing."),
 osEditorial("os-stadium","mod-013","STADIUM_AUTHENTICITY","Writer praises stadium advertising, jumbotron and ribbonboard replacements but offers no controlled current-patch benchmark."),
 {id:"video-trix-hair",modId:"mod-031",issueKey:"HAIR_COSMETIC_DEMO",reporterKey:"shady-mike-gaming",role:"VIDEO_DEMONSTRATION",date:"2026-08-11",datePrecision:"DAY",sourceUrl:VIDEO,stance:"NEUTRAL",scope:"UNSPECIFIED",statement:"Video demonstrates selecting a cosmetic hair-fix through MMC; video is not an independent exact-build compatibility test as of October 9.",sourceStrength:"SECONDARY",independenceKey:"shady-mike-video-20260811",issueOutcome:"NOT_APPLICABLE"}
];
export const gamePatches:GamePatch[]=[
 {id:"EA-M27-2026-08-26",effectiveDate:"2026-08-26",notesPublishedDate:"2026-08-25",sourceUrl:"https://www.ea.com/games/madden-nfl/madden-nfl-27/news/m27-title-update-august-26-2026",title:"Madden 27 August 26 Title Update",official:true,knownBuildNumber:null,impactedDomains:["Franchise","Roster","Equipment","Customization","Historical"],changes:["CPU wear-and-tear and injury handling","Custom roster Franchise import behavior","Contract void-year calculation","Nike Rivalries uniforms and Superstar stability"]},
 {id:"EA-M27-2026-09-16",effectiveDate:"2026-09-16",notesPublishedDate:"2026-09-15",sourceUrl:"https://www.ea.com/games/madden-nfl/madden-nfl-27/news/madden-nfl-27-title-update-september-16",title:"Madden 27 September 16 Title Update",official:true,knownBuildNumber:null,impactedDomains:["Gameplay","Franchise","Roster","Equipment","Customization","Presentation","Camera","Stadium","Historical","Audio"],changes:["Passing/coverage and defensive tuning","Free agency, contract, retirement and salary-cap updates","Scorebug, broadcast packages, camera and stadium changes","New cleats, facemasks, Guardian Caps and presentation fixes"]}
];
