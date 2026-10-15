import {strict as assert} from "node:assert";
import {readFile} from "node:fs/promises";
import {readOnlyWatchSnapshot} from "../desktop/lib/mod-watch-read.mjs";
import {join} from "node:path";
const source={schema:"MOD_WATCH_SNAPSHOT_V1",observedAt:"2026-10-10T13:00:00Z",promotion:"RESEARCH_OBSERVATIONS_ONLY",
 sourceStatus:[{sourceId:"fmt-releases",status:"OK",itemsSeen:2,added:2}],
 recentItems:[{eventKey:"github-release:fmt:101",sourceId:"fmt-releases",provider:"GITHUB",modId:"dev-fmt-madden-27-profile-compiler",kind:"TOOL_RELEASE",
 title:"Upstream v1.0",publishedDate:"2026-10-10",discoveredAt:"2026-10-10T13:00:00Z",detection:"INITIAL_BASELINE",url:"https://github.com/FMTDev/FMT.Madden26Plugin/releases/tag/v1.0",claimStatus:"PRIMARY_HOST_METADATA",summary:"Tool source metadata",gameRuntimeVerified:false}],
 counts:{totalObserved:1,newItems:1,failedSources:0,sourcesSucceeded:1}};
const parsed=readOnlyWatchSnapshot(JSON.stringify(source));
assert.equal(parsed.schema,"MOD_WATCH_SNAPSHOT_V1");
assert.equal(parsed.events[0].modId,"dev-fmt-madden-27-profile-compiler");
assert.equal(parsed.events[0].gameRuntimeVerified,undefined,"No game-proof claim crosses IPC");
assert.equal(parsed.events[0].title,"Upstream v1.0");
assert.equal(parsed.counts.newItems,1);
assert.throws(()=>readOnlyWatchSnapshot(JSON.stringify({...source,promotion:"GAME_VERIFIED"})),/WATCH_SNAPSHOT_SCHEMA/);
assert.throws(()=>readOnlyWatchSnapshot(JSON.stringify({...source,recentItems:[{...source.recentItems[0],url:"https://evil.example/"}]})),/WATCH_UNTRUSTED_SOURCE/);
assert.throws(()=>readOnlyWatchSnapshot(JSON.stringify({...source,recentItems:[{...source.recentItems[0],modId:"../../secret"}]})),/WATCH_INVALID_MOD_ID/);
assert.throws(()=>readOnlyWatchSnapshot("x".repeat(450001)),/WATCH_SNAPSHOT_SIZE/);
console.log("MOD_WATCH_BRIDGE_PASS untrusted_host_blocked=1 game_claim_blocked=1");
