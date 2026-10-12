export {};

declare global {
  interface ChatGPTAuthStatus {
    desktop: boolean;
    connected: boolean;
    planEnabled: boolean;
    email?: string | null;
    name?: string | null;
    clientId?: string | null;
    expiresAt?: number | null;
  }
  interface ChatGPTModelOption { slug:string; displayName:string; }
  interface ModeratorLocalFile {
    path:string;
    name:string;
    extension:string;
    size:number;
    sha256:string;
    preview:string|null;
  }
  interface ModeratorDesktopBridge {
    isDesktop:true;
    auth:{
      status:()=>Promise<ChatGPTAuthStatus>;
      signIn:()=>Promise<ChatGPTAuthStatus>;
      disconnect:()=>Promise<ChatGPTAuthStatus>;
    };
    ai:{
      models:()=>Promise<ChatGPTModelOption[]>;
      chat:(request:{
        requestId:string;
        model:string;
        instructions:string;
        input:Array<{role:"user"|"assistant";content:string}>;
      })=>Promise<{requestId:string;text:string;model:string;completed:boolean}>;
      onDelta:(callback:(payload:{requestId:string;delta:string})=>void)=>()=>void;
    };
    files:{pick:()=>Promise<ModeratorLocalFile|null>};
    nexusReview:{
      snapshot:()=>Promise<{
        schema:"MODERATOR_NEXUS_REVIEW_INBOX_V1";
        source:"USER_SUPPLIED_ONLY";
        permissionIndependentlyVerified:false;
        automaticScoringEnabled:false;
        records:Array<{id:string;modId:string;sourceId:string;reviewerKey:string;provider:"NEXUS_MODS";
          date:string;role:"PLAYER_REPORT"|"AUTHOR_RESPONSE";stance:"FAVORABLE"|"UNFAVORABLE"|"MIXED"|"NEUTRAL";
          scope:"LEGITIMATE_GAME_CLAIM"|"UNOFFICIAL_REPACK"|"UNSPECIFIED";
          issueKey:string;gameBuild:string|null;sourceUrl:string;summary:string;
          provenanceState:"USER_ATTESTED_PENDING_VERIFICATION"|"CONFIRMED";qualityVoteEligible:boolean;
          gameRuntimeVerified:false}>
      }>;
      importPack:()=>Promise<{added:number;conflicts:number;recordCount:number;
        promotion:string;scoringApplied:false;userNotice:string}|null>;
    };
    modWatch:{snapshot:()=>Promise<{schema:"MOD_WATCH_SNAPSHOT_V1";observedAt:string;status:"OK"|"PARTIAL";counts:{totalObserved:number;newItems:number;failedSources:number;sourcesSucceeded:number};sourceStatus:Array<{id:string;status:"OK"|"ERROR";errorCode:string|null}>;events:Array<{id:string;sourceId:string;kind:"TOOL_RELEASE"|"TOOL_COMMIT"|"PATCH_CANDIDATE"|"EA_NEWS";provider:"GITHUB"|"EA_OFFICIAL";modId:string|null;title:string;publishedDate:string|null;observedAt:string;detection:"INITIAL_BASELINE"|"NEW_SOURCE_ITEM";url:string;status:string;summary:string}>}|null>};
    studio:{importPlan:()=>Promise<{
      name:string;
      status:"PLAN_IMPORTED_UNVERIFIED";
      target:"MADDEN27";
      requestedReadiness:string;
      sourceState:string;
      localArtifactBuilt:boolean;
      gameRuntimeTested:boolean;
      sha256:string;
      caveat:string;
    }|null>};
  }
  interface Window { moderatorDesktop?:ModeratorDesktopBridge; }
}
