import { useEffect,useMemo,useState } from "react";
import {ArrowRight, BookOpen, Code2, ExternalLink, Filter, Search, ShieldAlert, X} from "lucide-react";
import {modIntelligenceCatalog,MOD_INTELLIGENCE_UPDATED,type ModCatalogEntry} from "../data/modIntelligence";
import {searchModCatalog} from "../lib/modLibrarySearch";
import "./ModIntelligenceLibrary.css";

type Props={onClose:()=>void;onUse:(item:ModCatalogEntry)=>void};
export default function ModIntelligenceLibrary({onClose,onUse}:Props){
 const [query,setQuery]=useState("");
 const [kind,setKind]=useState<"All"|"Community mod"|"Code & tools">("All");
 const [category,setCategory]=useState("All");
 const categories=useMemo(()=>["All",...new Set(modIntelligenceCatalog.filter(item=>kind==="All"||item.kind===kind).map(x=>x.category))].sort((a,b)=>a==="All"?-1:b==="All"?1:a.localeCompare(b)),[kind]);
 const matches=useMemo(()=>searchModCatalog(query,kind,category),[query,kind,category]);
 useEffect(()=>{const f=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();};document.addEventListener("keydown",f);return()=>document.removeEventListener("keydown",f);},[onClose]);
 const code=modIntelligenceCatalog.filter(item=>item.kind==="Code & tools").length;
 return <div className="m27-lib-backdrop" role="presentation" onMouseDown={e=>{if(e.currentTarget===e.target)onClose();}}>
  <section className="m27-lib" role="dialog" aria-modal="true" aria-label="Madden 27 mod intelligence library">
   <header className="m27-lib-header"><div><span className="m27-lib-eyebrow">THE MODERATOR ARCHIVE / EVIDENCE REGISTRY</span>
    <h2>Mod intelligence <em>library</em></h2><p>Discover community work, analyze source-backed patterns and launch research-led designs. No external files are mirrored.</p></div>
    <button className="m27-lib-close" onClick={onClose} aria-label="Close mod library"><X size={22}/></button>
   </header>
   <div className="m27-lib-stats"><div><strong>{modIntelligenceCatalog.length-code}</strong><span>mod candidates</span></div><div><strong>{code}</strong><span>development references</span></div><div><strong>0</strong><span>in-game verified locally</span></div><div><strong>{MOD_INTELLIGENCE_UPDATED}</strong><span>research snapshot</span></div></div>
   <div className="m27-lib-controls">
    <label className="m27-lib-search"><Search size={18}/><input aria-label="Search mod knowledge" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ask: realistic franchise development, dark visors, camera angles, stadiums…"/></label>
    <div className="m27-lib-filters"><label><BookOpen size={15}/> Source type<select value={kind} onChange={e=>{setKind(e.target.value as typeof kind);setCategory("All");}}><option>All</option><option>Community mod</option><option>Code & tools</option></select></label>
    <label><Filter size={15}/> Category<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label></div>
   </div>
   <div className="m27-lib-notice"><ShieldAlert size={18}/><span><b>Research intelligence, not a verified download repository.</b> Search uses transparent intent-keyword expansion, not embeddings. Source reports are not game tests. License, patch compatibility and security must pass before installing or reusing files.</span></div>
   <div className="m27-lib-results-heading">{matches.length} sources match <span>{query?"intent keyword search":"all categories"} · Madden 27 research</span></div>
   <div className="m27-lib-list" aria-live="polite">
    {matches.map(m=><article className="m27-lib-card" key={m.id}>
     <div className="m27-lib-card-header"><div className="m27-lib-icon">{m.kind==="Code & tools"?<Code2 size={18}/>:<BookOpen size={18}/>}</div><div><div className="m27-lib-tags"><span>{m.category}</span><span>{m.evidence.replace(/_/g," ")}</span></div><h3>{m.title}</h3><div className="m27-lib-author">by {m.author} • {m.kind}</div></div></div>
     <p>{m.description}</p>
     <div className="m27-lib-caution">{m.caveat??`License: ${m.license??"UNKNOWN"} • Reuse policy: ${m.reuse??"NOT_VERIFIED"}.`}</div>
     <div className="m27-lib-lower"><span className="m27-lib-state">{m.kind==="Community mod"?"MADDEN27 CLAIM • NOT TESTED":"CODE REFERENCE • NOT GAME VERIFIED"}</span>
     <div className="m27-lib-buttons"><a target="_blank" rel="noopener noreferrer" href={m.url}>Read source <ExternalLink size={13}/></a>
     {m.distributionUrl&&m.distributionUrl!==m.url&&<a target="_blank" rel="noopener noreferrer" href={m.distributionUrl}>Creator community <ExternalLink size={13}/></a>}
     <button onClick={()=>onUse(m)}>Use as inspiration <ArrowRight size={13}/></button></div></div>
    </article>)}
    {!matches.length&&<div className="m27-lib-empty">No entries match these filters. Try an equipment, franchise, camera, stadium, or source-code description.</div>}
   </div>
   <footer className="m27-lib-foot"><span>Mod listings remain owned by their respective creators. No copyrighted binary/code distribution or anti-cheat operations are provided here.</span><button onClick={onClose}>Return to studio</button></footer>
  </section>
 </div>;
}