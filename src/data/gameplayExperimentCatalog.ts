export type ExperimentEvidence = "UNKNOWN"|"TARGET"|"CORRELATED"|"WRITE_PROVEN"|"RUNTIME_PROVEN"|"BEHAVIOR_PROVEN"|"NEGATIVE_EVIDENCE";
export interface MechanicsComponent { id:string; label:string; evidence:ExperimentEvidence; source:string; hypothesis:string; }
export interface ExperimentCondition { id:string; variable:string; change:string; purpose:string; requiredSurface:string; }
export interface GameplayExperiment {
  id:string; title:string; universe:"CFB27"; status:"READY_FOR_ASSET_DISCOVERY"|"READY_FOR_OFFLINE_EXECUTION"|"BLOCKED";
  officialBaseline:string; currentRuntimeGate:string; sources:Record<string,string>;
  components:readonly MechanicsComponent[]; conditions:readonly ExperimentCondition[];
  metrics:readonly string[]; promotionRule:string;
}
export const LUA_HOOK_CERTIFIED_BUILDS = [
  { label:"july-11-2026", sha256:"9E654AD49C4702D8F9FA4E38FD1110ABE657DD38926D4124B30C70E7D29ADFE8", support:"certified" },
  { label:"patch-1-2026-07-16", sha256:"A048578530F7ED5967DF38803B63AD9B9F04FC71287F1E151C901A94AB240BFD", support:"certified" },
] as const;
export const PILE_LEAP_EXP001:GameplayExperiment = {
  id:"CFB27-GAMEPLAY-EXP-001-PILE-LEAP",
  title:"Defender pile-leap / airborne tackle mechanics isolation",
  universe:"CFB27",
  status:"READY_FOR_ASSET_DISCOVERY",
  officialBaseline:"EA CFB27 Title Update September 3, 2026",
  currentRuntimeGate:"NEEDS_CURRENT_EXE_HASH_AND_CERTIFIED_RUNTIME_ADAPTER",
  sources:{
    ea:"https://www.ea.com/games/ea-sports-college-football/college-football-27/news/title-update-september-3rd-2026",
    engine:"https://github.com/eric-levinson/cfb27-dynasty-modding/blob/2ff86a25924d9fe88ca7565dd26b6e7745c06452/docs/engine-modding.md",
    animationProof:"https://github.com/eric-levinson/cfb27-dynasty-modding/blob/2ff86a25924d9fe88ca7565dd26b6e7745c06452/docs/research-log.md#73-player-animations-live-in-charactergameplay-ison-records-not-the-flat-player-style-fields-2026-07-07",
    runtime:"https://github.com/eric-levinson/cfb27-lua-hook/blob/fa80b228641c75a00645720721ef013ac1347c3c/docs/lua-api.md",
    runtimeBuilds:"https://github.com/eric-levinson/cfb27-lua-hook/blob/fa80b228641c75a00645720721ef013ac1347c3c/native/host/game_builds.json"
  },
  components:[
    {id:"trigger",label:"user tackle/dive trigger",evidence:"UNKNOWN",source:"input/gameplay",hypothesis:"Input and situation gate whether a leap/dive branch is eligible."},
    {id:"selection",label:"defensive tackle animation selection",evidence:"TARGET",source:"FROSTBITE_ANIMATION",hypothesis:"A specific defensive animation family or selector chooses the airborne tackle."},
    {id:"root-motion",label:"launch/root-motion trajectory",evidence:"UNKNOWN",source:"FROSTBITE_ANIMATION",hypothesis:"Animation/root-motion data determines vertical apex and forward displacement."},
    {id:"reach",label:"tackle reach/target acquisition",evidence:"UNKNOWN",source:"gameplay attribsys/tuning",hypothesis:"Target-acquisition windows determine whether contact can attach across/over blockers."},
    {id:"blocker-collision",label:"blocker collision clearance",evidence:"UNKNOWN",source:"gameplay attribsys/physics",hypothesis:"Collision filtering or contact response determines whether the defender is stopped by the pile."},
    {id:"airborne-contact",label:"airborne tackle contact",evidence:"UNKNOWN",source:"gameplay attribsys/physics",hypothesis:"Airborne contact rules determine whether a valid tackle can resolve before landing."},
    {id:"recovery",label:"landing/recovery window",evidence:"UNKNOWN",source:"animation/gameplay tuning",hypothesis:"Recovery timing controls the cost/failure state after the leap."},
    {id:"ratings-control",label:"Jumping/Tackle/HitPower ratings",evidence:"TARGET",source:"SAVE_FRTK",hypothesis:"Ratings may affect eligibility/success but must not be assumed to control trajectory or collision."},
    {id:"character-gameplay-negative",label:"CharacterGameplay throw/run/carry style",evidence:"NEGATIVE_EVIDENCE",source:"SAVE_FRTK_CHARACTER_GAMEPLAY",hypothesis:"Game-verified CharacterGameplay controls throw/run/carry style, not defensive tackle selection; exclude as primary pile-leap mechanism."}
  ],
  conditions:[
    {id:"C0",variable:"none",change:"stock baseline",purpose:"Measure natural pile interaction and tackle outcomes.",requiredSurface:"NONE"},
    {id:"C1",variable:"JumpingRating",change:"single controlled increase on copied save",purpose:"Control: test eligibility/frequency without claiming root-motion control.",requiredSurface:"SAVE_FRTK"},
    {id:"C2",variable:"TackleRating",change:"single controlled increase on copied save",purpose:"Control: test tackle-success effect separately from leap geometry.",requiredSurface:"SAVE_FRTK"},
    {id:"C3",variable:"candidate defensive animation/selector",change:"one isolated asset/tuning edit",purpose:"Test animation selection/trajectory linkage after inventory discovery.",requiredSurface:"FROSTBITE_ANIMATION"},
    {id:"C4",variable:"candidate root-motion parameter",change:"one isolated parameter edit",purpose:"Test vertical/horizontal displacement.",requiredSurface:"FROSTBITE_ANIMATION"},
    {id:"C5",variable:"candidate reach/target parameter",change:"one isolated parameter edit",purpose:"Test contact acquisition across a blocker pile.",requiredSurface:"FROSTBITE_EBX"},
    {id:"C6",variable:"candidate collision parameter",change:"one isolated parameter edit",purpose:"Test blocker interception/clearance.",requiredSurface:"FROSTBITE_EBX"},
    {id:"C7",variable:"runtime observation/hook",change:"read/watch first; guarded one-variable write only on certified exact build",purpose:"Resolve native path only if asset/tuning experiments cannot explain behavior.",requiredSurface:"RUNTIME_NATIVE"}
  ],
  metrics:[
    "attempt count","animation/branch occurrence","initiation distance","takeoff-to-contact ms","apex height proxy","horizontal travel",
    "blocker contact before ballcarrier","ballcarrier contact","tackle success","whiff","knockdown","landing/recovery ms","unexpected regression"
  ],
  promotionRule:"BEHAVIOR_PROVEN requires repeatable one-variable before/after behavior on an exact recorded build, successful artifact/readback verification, at least two independent replicated runs, and no contradictory regression evidence."
};