import {useEffect,useMemo,useState} from "react";
import {AlertTriangle,BarChart2,ExternalLink} from "lucide-react";
import {communityEvidence,gamePatches,type CommunityEvidence} from "../data/communityEvidence";
import {modIntelligenceCatalog} from "../data/modIntelligence";
import {evaluateModQuality} from "../lib/communityScoring";
import "./CommunityIntelligencePanel.css";
type LiveSnapshot=NonNullable<Awaited<ReturnType<ModeratorDesktopBridge["modWatch"]["snapshot"]>>>;
export default function CommunityIntelligencePanel(){
 const [focus,setFocus]=useState("All");
 const [live,setLive]=useState<LiveSnapshot|null>(null);
 const [fetchError,setFetchError]=useState("");
 useEffect(()=>{
   let mounted=true;
   window.moderatorDesktop?.modWatch.snapshot().then(x=>{if(mounted)setLive(x);})
     .catch(()=>{if(mounted)setFetchError("Local snapshot invalid or unavailable");});
   return ()=>{mounted=false;};
 },[]);
 const observations:CommunityEvidence[]=useMemo(()=>!live?[]:live.events
   .filter(x=>x.provider==="GITHUB"&&x.kind==="TOOL_RELEASE"&&x.modId)
   .map(x=>({
      id:x.id,modId:x.modId!,issueKey:"UPSTREAM_RELEASE",reporterKey:x.sourceId,
      role:"HOST_METADATA" as const,date:x.publishedDate,datePrecision:x.publishedDate?"DAY" as const:"UNKNOWN" as const,
      sourceUrl:x.url,stance:"NEUTRAL" as const,scope:"UNSPECIFIED" as const,
      statement:"Upstream release metadata observed; no Madden 27 runtime proof.",sourceStrength:"DIRECT" as const,
      independenceKey:x.id,issueOutcome:"NOT_APPLICABLE" as const
   })),[live]);
 const assessments=useMemo(()=>modIntelligenceCatalog.map(x=>evaluateModQuality(x,[...communityEvidence,...observations])),[observations]);
 const selected=useMemo(()=>assessments.filter(a=>focus==="All"||a.patchSignal===focus)
 .sort((a,b)=>b.evidenceScore-a.evidenceScore||a.id.localeCompare(b.id)),[focus,assessments]);
 return <div className="m27-ci">
 <div className="m27-ci-overview">
   <section className="m27-ci-intro"><div className="m27-ci-label">SOURCE EVALUATION / 2026-10-09</div><h3>Community confidence <em>is not popularity.</em></h3><p>Evidence-coverage scores measure how much attributable information exists about a mod, not whether players like it. Community quality ratings stay withheld until independent retail-build testing and adequate review coverage exist.</p></section>
   <div className="m27-ci-numbers"><div><strong>{assessments.length}</strong><span>Evaluated references</span></div><div><strong>{assessments.filter(x=>x.qualityScore!==null).length}</strong><span>Qualified quality ratings</span></div><div><strong>{communityEvidence.length}</strong><span>Dated source records</span></div></div>
 </div>
 <section className="m27-ci-watch"><div className="m27-ci-label">AUTOMATED SOURCE WATCH / HOMEPC</div>
 {live ? <><p>Last successful snapshot: {live.observedAt} · {live.counts.sourcesSucceeded}/7 feeds responding · {live.counts.totalObserved} distinct source observations · {live.counts.newItems} in latest run. Quality ratings remain evidence-gated.</p>
 <div className="m27-ci-live-items">{live.events.slice(0,8).map(item=><a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"><span>{item.detection==="INITIAL_BASELINE"?"BASELINE": "NEW"} · {item.kind.replace(/_/g," ")}</span><strong>{item.title}</strong><ExternalLink size={12}/></a>)}</div></>
 : <p>{fetchError|| (window.moderatorDesktop?"No valid local snapshot yet. Run the local collector.":"Recurring source-watch data is available through MODerator Desktop on HOMEPC.")}</p>}
 </section>
 <div className="m27-ci-patches"><div className="m27-ci-label">OFFICIAL MADDEN 27 PATCH EVENTS</div>
  <div className="m27-ci-patch-grid">{gamePatches.map(p=><article key={p.id} className="m27-ci-patch"><span>{p.effectiveDate}</span><h4>{p.title}</h4><p>{p.changes.join(" · ")}</p><small>Exact executable build number not established. A surface match calls for investigation, not a confirmed broken mod.</small><a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">Official EA notes <ExternalLink size={12}/></a></article>)}</div>
 </div>
 <div className="m27-ci-evidence">
  <div className="m27-ci-label">PER-MOD EVIDENCE GATES</div>
  <div className="m27-ci-filters"><label htmlFor="m27-ci-filter">Patch exposure</label><select id="m27-ci-filter" value={focus} onChange={e=>setFocus(e.target.value)}>
   <option value="All">All ({assessments.length})</option>
   <option value="RETEST_REQUIRED">Retest required</option>
   <option value="PATCH_RELEVANT_BUILD_UNCONFIRMED">Build unconfirmed</option>
   <option value="NO_DIRECT_PATCH_MATCH">No direct match</option>
   </select></div>
  <div className="m27-ci-rows">
   {selected.map(a=>{const mod=modIntelligenceCatalog.find(x=>x.id===a.id)!;return <article className="m27-ci-row" key={a.id}>
    <div className="m27-ci-row-top"><div><span className="m27-ci-label">{mod.category} / {mod.evidence.replace(/_/g," ")}</span><h4>{mod.title}</h4></div><strong>{a.evidenceScore}<small>/100 evidence</small></strong></div>
    <div className="m27-ci-bar" aria-label={`Evidence coverage ${a.evidenceScore} out of 100`}><span style={{width:`${a.evidenceScore}%`}}/></div>
    <div className="m27-ci-metrics"><span><BarChart2 size={13}/> Community quality: NOT RATED</span><span><AlertTriangle size={13}/> {a.patchSignal.replace(/_/g," ")}</span><span>{a.rawPlayerPosts} user posts → {a.issueClusters.length} independent issue clusters</span></div>
    {a.issueClusters.map(cluster=><div className="m27-ci-issue" key={cluster.id}><strong>{cluster.issueKey.replace(/_/g," ")}</strong><span>{cluster.reports} post(s) by one reporter; context: {cluster.scope.replace(/_/g," ")}; {cluster.firstSeen}–{cluster.lastSeen}</span><a href={cluster.sourceUrl} target="_blank" rel="noopener noreferrer">Discussion <ExternalLink size={12}/></a></div>)}
    <p>{a.rationale[a.rationale.length-1]}</p>
    <a className="m27-ci-link" href={mod.url} target="_blank" rel="noopener noreferrer">Inspect source <ExternalLink size={12}/></a>
   </article>})}
  </div>
 </div>
 <footer className="m27-ci-footer">Rubric: source specificity + independent unique reporters + first-party revision evidence + recency, capped at 65 without local same-build proof. Overlapping articles and repeat posts never increase the independent reviewer count. Status: research only.</footer>
 </div>;
}