import { LUA_HOOK_CERTIFIED_BUILDS, PILE_LEAP_EXP001, type ExperimentEvidence } from "../data/gameplayExperimentCatalog.js";
export interface LabEnvironment { offline:boolean; exeSha256?:string; assetInventoryReady:boolean; baselineTrials:number; captureFps?:number; }
export interface LabReadiness { status:"READY_ASSET_DISCOVERY"|"READY_ASSET_EXPERIMENT"|"READY_RUNTIME"|"BLOCKED"; runtimeCertified:boolean; blockers:string[]; next:string[]; }
export interface TrialObservation { condition:string; attempts:number; branchOccurrences:number; tackleSuccesses:number; blockerStops:number; apexProxyMean?:number; horizontalTravelMean?:number; recoveryMsMean?:number; }
export interface PromotionInput { current:ExperimentEvidence; artifactRoundTrip:boolean; runtimeObserved:boolean; replicatedRuns:number; effectObserved:boolean; contradictoryRegression:boolean; }
export function runtimeBuildCertified(sha?:string):boolean {
  if(!sha)return false; const q=sha.toUpperCase(); return LUA_HOOK_CERTIFIED_BUILDS.some(b=>b.sha256===q&&b.support==="certified");
}
export function assessPileLeapReadiness(env:LabEnvironment):LabReadiness {
  const blockers:string[]=[]; const next:string[]=[]; const runtimeCertified=runtimeBuildCertified(env.exeSha256);
  if(!env.offline) blockers.push("offline mode is mandatory");
  if(!env.assetInventoryReady) next.push("generate/filter current-build EBX/RES/animation inventory for tackle/dive/lunge/contact/root-motion candidates");
  if(env.baselineTrials<20) next.push("capture at least 20 stock baseline repetitions with a fixed play/setup");
  if((env.captureFps??0)<60) next.push("capture replay/video at 60 fps or better for frame-level timing");
  if(!runtimeCertified) next.push("runtime instrumentation remains blocked until the exact executable hash is added as diagnostic/certified by cfb27-lua-hook");
  if(blockers.length)return{status:"BLOCKED",runtimeCertified,blockers,next};
  if(!env.assetInventoryReady)return{status:"READY_ASSET_DISCOVERY",runtimeCertified,blockers,next};
  if(env.assetInventoryReady&&env.baselineTrials>=20)return{status:runtimeCertified?"READY_RUNTIME":"READY_ASSET_EXPERIMENT",runtimeCertified,blockers,next};
  return{status:"READY_ASSET_EXPERIMENT",runtimeCertified,blockers,next};
}
export function summarizeObservation(o:TrialObservation){
  const rate=(n:number)=>o.attempts?Number((n/o.attempts).toFixed(3)):0;
  return{condition:o.condition,attempts:o.attempts,branchRate:rate(o.branchOccurrences),tackleSuccessRate:rate(o.tackleSuccesses),blockerStopRate:rate(o.blockerStops),apexProxyMean:o.apexProxyMean,horizontalTravelMean:o.horizontalTravelMean,recoveryMsMean:o.recoveryMsMean};
}
export function promoteEvidence(input:PromotionInput):ExperimentEvidence {
  if(input.contradictoryRegression)return input.current;
  if(input.artifactRoundTrip&&input.effectObserved&&input.runtimeObserved&&input.replicatedRuns>=2)return"BEHAVIOR_PROVEN";
  if(input.artifactRoundTrip&&input.effectObserved&&input.runtimeObserved)return"RUNTIME_PROVEN";
  if(input.artifactRoundTrip)return"WRITE_PROVEN";
  if(input.effectObserved)return"CORRELATED";
  return input.current;
}
export function buildPileLeapRunbook(){
  return{
    experiment:PILE_LEAP_EXP001.id,
    invariant:"one material variable per condition; same player/play/formation/difficulty/controller path where possible",
    phases:[
      "C0 stock baseline capture",
      "C1/C2 rating controls on copied save",
      "asset inventory discovery: tackle/dive/lunge/contact/root-motion/attribsys candidates",
      "C3-C6 isolated .fbmod/EBX/animation experiments with package reread",
      "runtime observation only after exact-build certification",
      "replicate successful effect twice independently, then evaluate promotion"
    ],
    stopRules:[
      "never modify original save/game assets in place",
      "never use online play",
      "never infer root-motion control from Jumping/Tackle rating changes",
      "never promote from visual impression alone; retain baseline + changed trial metrics"
    ]
  };
}